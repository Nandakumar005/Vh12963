import React, { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import PriorityNotificationList from '../components/PriorityNotificationList';
import { fetchAllNotifications } from '../services/notificationService';
import { rankNotifications } from '../utils/priorityRanking';
import logger from '../services/logger';

export default function PriorityInbox() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        await logger.info('PRIORITY_INBOX_START');
        const all = await fetchAllNotifications();
        const ranked = rankNotifications(all);
        if (!cancelled) {
          setNotifications(ranked);
          await logger.info(`PRIORITY_INBOX_SUCCESS: top ${ranked.length} notifications`);
        }
      } catch (err) {
        if (!cancelled) {
          const msg = err.response
            ? `Failed to load priority notifications (${err.response.status})`
            : 'Network error. Please check your connection.';
          setError(msg);
          await logger.error(`PRIORITY_INBOX_FAILURE: ${msg}`);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <PriorityNotificationList
        notifications={notifications}
        loading={loading}
        error={error}
      />
    </Container>
  );
}
