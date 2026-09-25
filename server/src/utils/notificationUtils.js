import Notification from '../models/Notification.js';

// Create a single notification document (safe fallback, doesn't throw)
export const notifyUser = async ({
  recipient,
  type,
  title,
  message,
  event = null,
  actor = null
}) => {
  try {
    if (!recipient) return null;

    return await Notification.create({
      recipient,
      type,
      title: title.trim(),
      message: message.trim(),
      event: event || null,
      actor: actor || null,
      isRead: false
    });
  } catch (error) {
    console.error('[NOTIFY USER ERROR]', error.message);
    return null;
  }
};

// Batch create notifications for multiple recipients (e.g. event update/cancel)
export const notifyUsers = async (recipients, {
  type,
  title,
  message,
  event = null,
  actor = null
}) => {
  try {
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return [];
    }

    const actorStr = actor ? actor.toString() : null;
    const uniqueRecipientIds = [
      ...new Set(
        recipients
          .filter(Boolean)
          .map((id) => (id._id ? id._id.toString() : id.toString()))
          .filter((idStr) => idStr !== actorStr)
      )
    ];

    if (uniqueRecipientIds.length === 0) return [];

    const notificationDocs = uniqueRecipientIds.map((recipientId) => ({
      recipient: recipientId,
      type,
      title: title.trim(),
      message: message.trim(),
      event: event || null,
      actor: actor || null,
      isRead: false
    }));

    return await Notification.insertMany(notificationDocs);
  } catch (error) {
    console.error('[NOTIFY USERS ERROR]', error.message);
    return [];
  }
};
