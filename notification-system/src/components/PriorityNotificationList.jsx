import React from 'react';
import {
  Grid,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import NotificationCard from './NotificationCard';

export default function PriorityNotificationList({ notifications, loading, error }) {
  return (
    <Box>
      <Typography variant="h5" component="h2" fontWeight={600} sx={{ mb: 3 }}>
        Priority Inbox
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {error && !loading && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && (!notifications || notifications.length === 0) && (
        <Paper sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No priority notifications available.
          </Typography>
        </Paper>
      )}

      {!loading && !error && notifications && notifications.length > 0 && (
        <Grid container spacing={2}>
          {notifications.map((notification) => (
            <Grid item xs={12} sm={6} md={4} key={notification.id || notification._id}>
              <NotificationCard
                notification={notification}
                priorityScore={notification.priorityScore}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
