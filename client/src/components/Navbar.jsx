import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Calendar,
  UserPlus,
  LogIn,
  LogOut,
  Bell,
  CheckCheck,
  Check,
  ArrowRight
} from 'lucide-react';
import {
  fetchUnreadCount,
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  formatRelativeTime,
  NOTIFICATION_SYNC_EVENT
} from '../utils/notifications';
import { isAuthenticated as checkAuth, isOrganizer, clearAuthSession } from '../utils/auth';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthenticated = checkAuth();
  const isUserOrganizer = isOrganizer();

  // Load unread count on mount or auth change
  const loadUnreadCount = async () => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return;
    }
    try {
      const res = await fetchUnreadCount();
      if (res && res.status === 'success') {
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (err) {
      // Quiet fail if guest or token expired
    }
  };

  // Load recent notifications when dropdown is opened
  const loadRecentNotifications = async () => {
    if (!isAuthenticated) return;
    setLoadingNotifications(true);
    try {
      const res = await fetchNotifications(5);
      if (res && res.status === 'success') {
        setRecentNotifications(res.data || []);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (err) {
      console.error('[NAVBAR NOTIFICATIONS LOAD ERROR]', err);
    } finally {
      setLoadingNotifications(false);
    }
  };

  useEffect(() => {
    loadUnreadCount();

    // Listen to notification sync events from any component
    const handleSync = () => {
      loadUnreadCount();
      if (isNotificationOpen) {
        loadRecentNotifications();
      }
    };

    window.addEventListener(NOTIFICATION_SYNC_EVENT, handleSync);
    return () => {
      window.removeEventListener(NOTIFICATION_SYNC_EVENT, handleSync);
    };
  }, [isAuthenticated, isNotificationOpen]);

  // Handle outside click & escape key to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsNotificationOpen(false);
      }
    };

    if (isNotificationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isNotificationOpen]);

  // Toggle notification dropdown
  const toggleNotificationDropdown = () => {
    const nextState = !isNotificationOpen;
    setIsNotificationOpen(nextState);
    if (nextState) {
      loadRecentNotifications();
    }
  };

  const handleMarkOneAsRead = async (e, id) => {
    e.stopPropagation();
    try {
      await markNotificationRead(id);
      setRecentNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  const handleMarkAllAsRead = async (e) => {
    e.stopPropagation();
    try {
      await markAllNotificationsRead();
      setRecentNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      try {
        await markNotificationRead(notification._id);
        setRecentNotifications((prev) =>
          prev.map((n) => (n._id === notification._id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch (err) {
        console.error('Failed to mark read:', err);
      }
    }
    setIsNotificationOpen(false);

    // If notification has a valid event reference that is still active
    if (notification.event && notification.event._id) {
      navigate(`/events/${notification.event._id}`);
    } else {
      navigate('/notifications');
    }
  };

  const handleLogout = () => {
    clearAuthSession();
    setIsNotificationOpen(false);
    navigate('/login');
  };

  const baseLinks = [
    { name: 'Home', href: '/' },
    { name: 'Events', href: '/events' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const navLinks = isAuthenticated
    ? isUserOrganizer
      ? [...baseLinks, { name: 'Dashboard', href: '/dashboard' }, { name: 'My Events', href: '/dashboard/events' }]
      : [...baseLinks, { name: 'Dashboard', href: '/dashboard' }]
    : baseLinks;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors duration-200">
                  CampusConnect
                </span>
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Event Hub
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm font-medium text-slate-300 hover:text-indigo-400 transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Call-to-Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Notification Bell with Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleNotificationDropdown}
                    className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white hover:bg-slate-900 transition-all duration-200 cursor-pointer"
                    aria-label="Notifications"
                    title="Notifications"
                  >
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white shadow-lg shadow-indigo-600/50 animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown Panel */}
                  {isNotificationOpen && (
                    <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-slate-800 bg-slate-950/95 backdrop-blur-xl shadow-2xl shadow-slate-950/80 animate-in fade-in zoom-in-95 duration-150 z-50 overflow-hidden">
                      {/* Dropdown Header */}
                      <div className="flex items-center justify-between border-b border-slate-800/80 px-4 py-3 bg-slate-900/40">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-white">Notifications</span>
                          {unreadCount > 0 && (
                            <span className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-400">
                              {unreadCount} unread
                            </span>
                          )}
                        </div>

                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllAsRead}
                            className="flex items-center space-x-1 text-[11px] font-medium text-slate-400 hover:text-indigo-400 transition"
                            title="Mark all as read"
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                            <span>Mark all read</span>
                          </button>
                        )}
                      </div>

                      {/* Dropdown Content */}
                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-900/60">
                        {loadingNotifications ? (
                          <div className="p-6 text-center text-xs text-slate-400 space-y-2">
                            <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                            <p>Loading notifications...</p>
                          </div>
                        ) : recentNotifications.length === 0 ? (
                          <div className="p-8 text-center">
                            <Bell className="mx-auto h-8 w-8 text-slate-600 mb-2" />
                            <p className="text-xs font-medium text-slate-300">No notifications yet</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              You'll see activity updates for your campus events here.
                            </p>
                          </div>
                        ) : (
                          recentNotifications.map((notification) => (
                            <div
                              key={notification._id}
                              onClick={() => handleNotificationClick(notification)}
                              className={`flex items-start justify-between gap-3 p-3.5 hover:bg-slate-900/60 transition cursor-pointer ${
                                !notification.isRead ? 'bg-indigo-950/20' : ''
                              }`}
                            >
                              <div className="space-y-1 min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  {!notification.isRead && (
                                    <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
                                  )}
                                  <h5 className="text-xs font-semibold text-white truncate">
                                    {notification.title}
                                  </h5>
                                </div>
                                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                                  {notification.message}
                                </p>
                                <span className="text-[10px] text-slate-500 block pt-0.5">
                                  {formatRelativeTime(notification.createdAt)}
                                </span>
                              </div>

                              {!notification.isRead && (
                                <button
                                  onClick={(e) => handleMarkOneAsRead(e, notification._id)}
                                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white shrink-0 transition"
                                  title="Mark as read"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          ))
                        )}
                      </div>

                      {/* Dropdown Footer */}
                      <div className="border-t border-slate-800/80 bg-slate-900/30 p-2 text-center">
                        <Link
                          to="/notifications"
                          onClick={() => setIsNotificationOpen(false)}
                          className="flex items-center justify-center space-x-1.5 py-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
                        >
                          <span>View all notifications</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  to="/dashboard"
                  className="inline-flex items-center space-x-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900 px-4 py-2 rounded-xl border border-slate-800/80 transition-all duration-200"
                >
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center space-x-1.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 px-4 py-2 rounded-xl shadow-lg shadow-rose-600/10 hover:shadow-rose-600/25 transition-all duration-200 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center space-x-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900 px-4 py-2 rounded-xl border border-slate-800/80 transition-all duration-200"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center space-x-1.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/25 transition-all duration-200"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {isAuthenticated && (
              <Link
                to="/notifications"
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-900 transition-all duration-200"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[9px] font-bold text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-900 transition-all duration-200"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-slate-900 bg-slate-950 px-6 py-6 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-medium text-slate-300 hover:text-indigo-400 py-1 transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}

            {isAuthenticated && (
              <Link
                to="/notifications"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between text-base font-medium text-slate-300 hover:text-indigo-400 py-1 transition-colors duration-200"
              >
                <span className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-indigo-400" />
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )}
            
            {/* Divider */}
            <div className="border-t border-slate-900 my-2 pt-4 flex flex-col space-y-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center space-x-2 w-full text-center text-sm font-medium text-slate-300 border border-slate-800 hover:bg-slate-900 py-2.5 rounded-xl transition duration-200"
                  >
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center justify-center space-x-2 w-full text-center text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 py-2.5 rounded-xl transition duration-200 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center space-x-2 w-full text-center text-sm font-medium text-slate-300 border border-slate-800 hover:bg-slate-900 py-2.5 rounded-xl transition duration-200"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center space-x-2 w-full text-center text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 py-2.5 rounded-xl transition duration-200"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Register</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
