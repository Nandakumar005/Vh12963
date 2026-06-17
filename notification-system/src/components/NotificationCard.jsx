import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
} from '@mui/material';

const TYPE_COLORS = {
  Placement: { bg: '#e3f2fd', color: '#1565c0' },
  Result: { bg: '#e8f5e9', color: '#2e7d32' },
  Event: { bg: '#fff3e0', color: '#e65100' },
};

export default function NotificationCard({ notification, priorityScore }) {
  const type = notification.notification_type || notification.type || 'Unknown';
  const colors = TYPE_COLORS[type] || { bg: '#f5f5f5', color: '#616161' };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: 6 },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Chip
            label={type}
            size="small"
            sx={{
              backgroundColor: colors.bg,
              color: colors.color,
              fontWeight: 600,
            }}
          />
          {priorityScore !== undefined && (
            <Chip
              label={`Score: ${priorityScore}`}
              size="small"
              color={priorityScore >= 3 ? 'primary' : priorityScore >= 2 ? 'success' : 'default'}
              variant="outlined"
            />
          )}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {notification.message || notification.description || 'No message'}
        </Typography>
        <Typography variant="caption" color="text.disabled">
          {notification.created_at || notification.timestamp
            ? new Date(notification.created_at || notification.timestamp).toLocaleString()
            : ''}
        </Typography>
      </CardContent>
    </Card>
  );
}
