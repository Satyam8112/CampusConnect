import axios from 'axios';
import { getAuthHeaders } from './auth';

// Custom event to synchronize unread count and notifications across components
export const NOTIFICATION_SYNC_EVENT = 'campusconnect-notification-change';

export const triggerNotificationSync = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(NOTIFICATION_SYNC_EVENT));
  }
};

/**
 * Fetch notifications for current authenticated user
 * @param {number} [limit=50]
 */
export const fetchNotifications = async (limit = 50) => {
  const response = await axios.get(`/api/notifications?limit=${limit}`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

/**
 * Fetch unread notification count for current authenticated user
 */
export const fetchUnreadCount = async () => {
  const response = await axios.get('/api/notifications/unread-count', {
    headers: getAuthHeaders()
  });
  return response.data;
};

/**
 * Mark a single notification as read
 * @param {string} id
 */
export const markNotificationRead = async (id) => {
  const response = await axios.patch(
    `/api/notifications/${id}/read`,
    {},
    { headers: getAuthHeaders() }
  );
  triggerNotificationSync();
  return response.data;
};

/**
 * Mark all unread notifications as read
 */
export const markAllNotificationsRead = async () => {
  const response = await axios.patch(
    '/api/notifications/read-all',
    {},
    { headers: getAuthHeaders() }
  );
  triggerNotificationSync();
  return response.data;
};

/**
 * Delete a notification
 * @param {string} id
 */
export const deleteNotification = async (id) => {
  const response = await axios.delete(`/api/notifications/${id}`, {
    headers: getAuthHeaders()
  });
  triggerNotificationSync();
  return response.data;
};

/**
 * Human-friendly relative time formatter (e.g. "Just now", "5m ago", "2h ago", "Yesterday")
 * @param {string|Date} dateString
 */
export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return 'Yesterday';
  }
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};
