import React from 'react';
import {
  Grid,
  Box,
  Typography,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import NotificationCard from './NotificationCard';
import logger from '../services/logger';

const FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'Event', label: 'Event' },
  { value: 'Result', label: 'Result' },
  { value: 'Placement', label: 'Placement' },
];

export default function NotificationList({
  notifications,
  loading,
  error,
  page,
  totalPages,
  filter,
  onPageChange,
  onFilterChange,
}) {
  const handleFilterChange = async (e) => {
    const newFilter = e.target.value;
    await logger.info(`FILTER_CHANGE: ${newFilter}`);
    onFilterChange(newFilter);
  };

  const handlePageChange = async (_, newPage) => {
    await logger.info(`PAGE_NAVIGATION: page=${newPage}`);
    onPageChange(newPage);
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography variant="h5" component="h2" fontWeight={600}>
          All Notifications
        </Typography>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="filter-label">Type</InputLabel>
          <Select
            labelId="filter-label"
            value={filter}
            label="Type"
            onChange={handleFilterChange}
          >
            {FILTER_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

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
            No notifications found.
          </Typography>
        </Paper>
      )}

      {!loading && !error && notifications && notifications.length > 0 && (
        <>
          <Grid container spacing={2}>
            {notifications.map((notification) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={notification.id || notification._id}>
                <NotificationCard notification={notification} />
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
