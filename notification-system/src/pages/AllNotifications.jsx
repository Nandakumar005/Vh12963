import React, { useState, useEffect, useCallback } from 'react';
import { Container } from '@mui/material';
import NotificationList from '../components/NotificationList';
import { fetchNotifications } from '../services/notificationService';
import logger from '../services/logger';

const LIMIT = 12;

export default function AllNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all');

  const loadNotifications = useCallback(async (currentPage, currentFilter) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNotifications({
        page: currentPage,
        limit: LIMIT,
        notification_type: currentFilter === 'all' ? undefined : currentFilter,
      });
      setNotifications(data.notifications || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      const msg = err.response
        ? `Failed to load notifications (${err.response.status})`
        : 'Network error. Please check your connection.';
      setError(msg);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications(page, filter);
  }, [page, filter, loadNotifications]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <NotificationList
        notifications={notifications}
        loading={loading}
        error={error}
        page={page}
        totalPages={totalPages}
        filter={filter}
        onPageChange={handlePageChange}
        onFilterChange={handleFilterChange}
      />
    </Container>
  );
}
