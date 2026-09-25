import express from 'express';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification
} from '../controllers/notificationController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// All notification routes require authentication
router.use(authMiddleware);

// Unread count endpoint (declared before /:id)
router.get('/unread-count', getUnreadCount);

// Mark all notifications as read (declared before /:id)
router.patch('/read-all', markAllAsRead);

// Base notification retrieval
router.get('/', getNotifications);

// Mark single notification as read
router.patch('/:id/read', markAsRead);

// Delete single notification
router.delete('/:id', deleteNotification);

export default router;
