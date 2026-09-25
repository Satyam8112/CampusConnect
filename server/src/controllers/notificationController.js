import mongoose from 'mongoose';
import Notification from '../models/Notification.js';

// ==========================================
// 1. GET NOTIFICATIONS
// ==========================================
export const getNotifications = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    const userId = req.user.id;
    const limit = parseInt(req.query.limit, 10) || 50;

    // Fetch user notifications newest first
    const notifications = await Notification.find({ recipient: userId })
      .populate('actor', 'name email role')
      .populate('event', 'title date location category')
      .sort({ createdAt: -1 })
      .limit(limit);

    // Calculate unread count for the user
    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      isRead: false
    });

    res.status(200).json({
      status: 'success',
      count: notifications.length,
      unreadCount,
      data: notifications
    });
  } catch (error) {
    console.error('[GET NOTIFICATIONS ERROR]', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve notifications'
    });
  }
};

// ==========================================
// 2. GET UNREAD COUNT
// ==========================================
export const getUnreadCount = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    const userId = req.user.id;
    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      isRead: false
    });

    res.status(200).json({
      status: 'success',
      unreadCount
    });
  } catch (error) {
    console.error('[GET UNREAD COUNT ERROR]', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve unread notification count'
    });
  }
};

// ==========================================
// 3. MARK AS READ (Single)
// ==========================================
export const markAsRead = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid notification ID format'
      });
    }

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        status: 'error',
        message: 'Notification not found'
      });
    }

    // Strict ownership verification: only recipient can modify
    if (notification.recipient.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Unauthorized notification access'
      });
    }

    notification.isRead = true;
    await notification.save();

    const populated = await Notification.findById(id)
      .populate('actor', 'name email role')
      .populate('event', 'title date location category');

    res.status(200).json({
      status: 'success',
      message: 'Notification marked as read',
      data: populated
    });
  } catch (error) {
    console.error('[MARK AS READ ERROR]', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to mark notification as read'
    });
  }
};

// ==========================================
// 4. MARK ALL AS READ
// ==========================================
export const markAllAsRead = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    const userId = req.user.id;

    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({
      status: 'success',
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('[MARK ALL AS READ ERROR]', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to mark all notifications as read'
    });
  }
};

// ==========================================
// 5. DELETE NOTIFICATION
// ==========================================
export const deleteNotification = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid notification ID format'
      });
    }

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        status: 'error',
        message: 'Notification not found'
      });
    }

    // Strict ownership verification: only recipient can delete
    if (notification.recipient.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Unauthorized notification access'
      });
    }

    await Notification.findByIdAndDelete(id);

    res.status(200).json({
      status: 'success',
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('[DELETE NOTIFICATION ERROR]', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete notification'
    });
  }
};
