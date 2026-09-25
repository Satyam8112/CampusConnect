import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Check,
  Trash2,
  Calendar,
  UserPlus,
  UserMinus,
  AlertTriangle,
  Info,
  ArrowRight,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  formatRelativeTime,
  NOTIFICATION_SYNC_EVENT
} from '../utils/notifications';
import { isAuthenticated } from '../utils/auth';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'unread'

  const loadNotificationsData = async () => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetchNotifications(100);
      if (res && res.status === 'success') {
        setNotifications(res.data || []);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error('[NOTIFICATIONS PAGE FETCH ERROR]', err);
      setError(err.response?.data?.message || 'Failed to load notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotificationsData();

    // Listen for sync events triggered elsewhere
    const handleSync = () => {
      loadNotificationsData();
    };

    window.addEventListener(NOTIFICATION_SYNC_EVENT, handleSync);
    return () => {
      window.removeEventListener(NOTIFICATION_SYNC_EVENT, handleSync);
    };
  }, []);

  const handleMarkOneRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((item) => (item._id === id ? { ...item, isRead: true } : item))
      );
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    setActionLoading(true);
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all read:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'unread') return !n.isRead;
    return true;
  });

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'event_registration':
        return (
          <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <UserPlus className="h-5 w-5" />
          </div>
        );
      case 'registration_cancelled':
        return (
          <div className="h-10 w-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <UserMinus className="h-5 w-5" />
          </div>
        );
      case 'event_updated':
        return (
          <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
            <Calendar className="h-5 w-5" />
          </div>
        );
      case 'event_cancelled':
        return (
          <div className="h-10 w-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
        );
      default:
        return (
          <div className="h-10 w-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
            <Info className="h-5 w-5" />
          </div>
        );
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-6 bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-12 left-1/4 -z-10 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 -z-10 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="mx-auto max-w-4xl space-y-8">
        
        {/* Header Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-6">
          <div>
            <div className="inline-flex items-center space-x-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 mb-3">
              <Sparkles className="h-3 w-3 text-indigo-400" />
              <span className="text-[10px] font-semibold tracking-wider text-indigo-300 uppercase">
                Activity Center
              </span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-white">Notifications</h1>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-600/30 border border-indigo-500/40 text-xs font-bold text-indigo-300">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Stay updated with your registrations, event updates, and campus organizer alerts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadNotificationsData}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </button>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                disabled={actionLoading}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/10 transition disabled:opacity-50"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Mark All Read</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-2 border-b border-slate-900/80 pb-4">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'bg-slate-900/50 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setActiveFilter('unread')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeFilter === 'unread'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'bg-slate-900/50 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Notifications List Content */}
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-slate-900/40 border border-slate-900 rounded-2xl" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-rose-950/20 border border-rose-900/40 rounded-3xl space-y-3">
            <ShieldAlert className="mx-auto h-8 w-8 text-rose-400" />
            <p className="text-sm font-medium text-rose-300">{error}</p>
            <button
              onClick={loadNotificationsData}
              className="text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-xl border border-slate-800"
            >
              Try Again
            </button>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/20 border border-slate-900 rounded-3xl p-8">
            <div className="h-14 w-14 mx-auto rounded-2xl bg-slate-900 flex items-center justify-center border border-slate-800 text-slate-500 mb-3">
              <Bell className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-white">No notifications found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {activeFilter === 'unread'
                ? 'All caught up! You do not have any unread notifications.'
                : 'You have no activity notifications at the moment.'}
            </p>
            <Link
              to="/events"
              className="inline-flex items-center space-x-2 mt-4 text-xs font-semibold text-indigo-400 hover:underline"
            >
              <span>Explore Campus Events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => {
              const hasActiveEvent = notification.event && notification.event._id;

              return (
                <div
                  key={notification._id}
                  className={`relative p-5 rounded-2xl border transition-all duration-200 ${
                    !notification.isRead
                      ? 'bg-slate-900/60 border-indigo-500/30 shadow-lg shadow-indigo-950/20'
                      : 'bg-slate-900/20 border-slate-900/90 hover:border-slate-800/80'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Visual Type Icon */}
                    {getNotificationIcon(notification.type)}

                    {/* Main Details */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-white">
                          {notification.title}
                        </h4>
                        {!notification.isRead && (
                          <span className="h-2 w-2 rounded-full bg-indigo-400 shrink-0" />
                        )}
                        <span className="text-[11px] text-slate-500 ml-auto shrink-0">
                          {formatRelativeTime(notification.createdAt)}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {notification.message}
                      </p>

                      {/* Event Link or Deleted Event Status */}
                      <div className="pt-2 flex flex-wrap items-center gap-3">
                        {hasActiveEvent ? (
                          <Link
                            to={`/events/${notification.event._id}`}
                            className="inline-flex items-center space-x-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition"
                          >
                            <span>View Event: {notification.event.title}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        ) : notification.type === 'event_cancelled' ? (
                          <span className="inline-flex items-center space-x-1 text-[11px] font-medium text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded-md border border-rose-900/40">
                            <span>Event Cancelled</span>
                          </span>
                        ) : null}

                        {notification.actor && notification.actor.name && (
                          <span className="text-[11px] text-slate-500">
                            By {notification.actor.name}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-1.5 shrink-0 pl-2">
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkOneRead(notification._id)}
                          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-indigo-400 transition"
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification._id)}
                        className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-900/40 text-slate-400 hover:text-rose-400 transition"
                        title="Delete notification"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default Notifications;
