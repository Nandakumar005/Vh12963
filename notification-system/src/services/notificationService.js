import axios from 'axios';
import logger from './logger';

const API_BASE = 'http://4.224.186.213/evaluation-service/notifications';

export async function fetchNotifications({ page = 1, limit = 12, notification_type } = {}) {
  const params = { page, limit };
  if (notification_type && notification_type !== 'all') {
    params.notification_type = notification_type;
  }

  await logger.info(`FETCH_START: page=${page}, limit=${limit}, type=${notification_type || 'all'}`);

  try {
    const response = await axios.get(API_BASE, { params });
    await logger.info(`FETCH_SUCCESS: received ${response.data?.notifications?.length || 0} notifications`);
    return response.data;
  } catch (error) {
    const message = error.response
      ? `HTTP ${error.response.status}: ${JSON.stringify(error.response.data)}`
      : error.message;
    await logger.error(`FETCH_FAILURE: ${message}`);
    throw error;
  }
}

export async function fetchAllNotifications() {
  // Fetch multiple pages to get all notifications for priority ranking
  let allNotifications = [];
  let page = 1;
  const limit = 50;
  let totalPages = 1;

  try {
    const firstPage = await fetchNotifications({ page: 1, limit });
    allNotifications = firstPage.notifications || [];
    totalPages = firstPage.totalPages || 1;

    for (page = 2; page <= totalPages; page++) {
      const data = await fetchNotifications({ page, limit });
      allNotifications = allNotifications.concat(data.notifications || []);
    }

    return allNotifications;
  } catch (error) {
    throw error;
  }
}
