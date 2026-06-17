const PRIORITY_ORDER = { Placement: 3, Result: 2, Event: 1 };

export function calculatePriorityScore(notification) {
  const type = notification.notification_type || notification.type || '';
  return PRIORITY_ORDER[type] || 0;
}

export function rankNotifications(notifications) {
  if (!notifications || notifications.length === 0) return [];

  const scored = notifications.map((n) => ({
    ...n,
    priorityScore: calculatePriorityScore(n),
  }));

  scored.sort((a, b) => {
    if (b.priorityScore !== a.priorityScore) {
      return b.priorityScore - a.priorityScore;
    }
    return new Date(b.created_at || b.timestamp || 0) - new Date(a.created_at || a.timestamp || 0);
  });

  return scored.slice(0, 10);
}
