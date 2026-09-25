import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  User,
  Mail,
  Shield,
  Calendar,
  ClipboardList,
  LogOut,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Database,
  PlusCircle,
  MapPin,
  Users,
  Bell
} from 'lucide-react';
import {
  formatShortDate,
  getCategoryBadgeStyle,
  getAuthToken,
  getAuthHeaders,
  clearAuthSession
} from '../utils/auth';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [eventsList, setEventsList] = useState([]);
  const [totalHubEvents, setTotalHubEvents] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    const token = getAuthToken();

    if (!token) {
      setError('Access denied. No authentication token found.');
      setLoading(false);
      const timer = setTimeout(() => {
        navigate('/login');
      }, 1000);
      return () => clearTimeout(timer);
    }

    const fetchDashboardData = async () => {
      try {
        // Fetch current user
        const userRes = await axios.get('/api/auth/me', {
          headers: getAuthHeaders()
        });

        if (userRes.data && userRes.data.status === 'success') {
          const userData = userRes.data.user;
          setUser(userData);
          localStorage.setItem('campusconnect_user', JSON.stringify(userData));

          // Fetch role-specific event data
          if (userData.role === 'organizer') {
            try {
              const myEventsRes = await axios.get('/api/events/organizer/my-events', {
                headers: getAuthHeaders()
              });
              if (myEventsRes.data && myEventsRes.data.status === 'success') {
                setEventsList(myEventsRes.data.data || []);
              }
            } catch (e) {
              console.error('Error fetching organizer events:', e);
            }
          } else {
            try {
              const myRegsRes = await axios.get('/api/events/student/my-registrations', {
                headers: getAuthHeaders()
              });
              if (myRegsRes.data && myRegsRes.data.status === 'success') {
                setEventsList(myRegsRes.data.data || []);
              }
            } catch (e) {
              console.error('Error fetching student registrations:', e);
            }
          }

          // Fetch total events count in the hub
          try {
            const allEventsRes = await axios.get('/api/events');
            if (allEventsRes.data && allEventsRes.data.status === 'success') {
              setTotalHubEvents(allEventsRes.data.count || 0);
            }
          } catch (e) {
            console.error('Error fetching total hub events:', e);
          }

          // Fetch unread notifications count
          try {
            const notifRes = await axios.get('/api/notifications/unread-count', {
              headers: getAuthHeaders()
            });
            if (notifRes.data && notifRes.data.status === 'success') {
              setUnreadNotifications(notifRes.data.unreadCount || 0);
            }
          } catch (e) {
            console.error('Error fetching unread notifications:', e);
          }

        } else {
          throw new Error('Could not retrieve user info');
        }
      } catch (err) {
        console.error('[DASHBOARD FETCH ERROR]', err);
        setError(err.response?.data?.message || 'Session expired or invalid token. Redirecting to login...');
        clearAuthSession();

        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    clearAuthSession();
    navigate('/login');
  };

  // Loading State (Shimmer UI Skeleton)
  if (loading) {
    return (
      <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-start py-12 px-6 overflow-hidden bg-slate-950 text-slate-100">
        <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-indigo-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 -z-10 h-96 w-96 rounded-full bg-purple-500/5 blur-3xl" />
        
        <div className="mx-auto max-w-6xl w-full space-y-8 animate-pulse">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-8">
            <div className="space-y-3">
              <div className="h-4 w-32 bg-slate-900 rounded-full" />
              <div className="h-10 w-64 bg-slate-900 rounded-xl" />
            </div>
            <div className="h-12 w-32 bg-slate-900 rounded-xl" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1 h-80 bg-slate-900/30 border border-slate-900 rounded-3xl" />
            <div className="md:col-span-2 space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-28 bg-slate-900/30 border border-slate-900 rounded-2xl" />
                <div className="h-28 bg-slate-900/30 border border-slate-900 rounded-2xl" />
                <div className="h-28 bg-slate-900/30 border border-slate-900 rounded-2xl" />
              </div>
              <div className="h-64 bg-slate-900/30 border border-slate-900 rounded-3xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error && !user) {
    return (
      <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-20 px-6 overflow-hidden bg-slate-950 text-slate-100">
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />
        <div className="max-w-md w-full text-center space-y-6 bg-slate-900/40 border border-slate-800/80 p-8 rounded-3xl backdrop-blur-md">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <AlertCircle className="w-6 h-6 animate-bounce" />
          </div>
          <h3 className="text-xl font-bold text-white">Authentication Redirect</h3>
          <p className="text-sm text-slate-400 leading-relaxed">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-2.5 px-4 bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-200 rounded-xl transition text-sm font-semibold"
          >
            Redirecting to login...
          </button>
        </div>
      </div>
    );
  }

  const isUserOrganizer = user.role === 'organizer';
  const totalRegistrations = isUserOrganizer
    ? eventsList.reduce((sum, e) => sum + (e.registrationCount || (e.registrations ? e.registrations.length : 0)), 0)
    : eventsList.length;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] py-12 px-6 overflow-hidden bg-slate-950 text-slate-100">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />

      <div className="mx-auto max-w-6xl w-full space-y-8">
        
        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-900 pb-8">
          <div>
            <div className="inline-flex items-center space-x-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 mb-3">
              <Sparkles className="h-3 w-3 text-indigo-400" />
              <span className="text-[9px] font-semibold tracking-wider text-indigo-300 uppercase">
                CampusConnect Workspace
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{user.name}</span>!
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {isUserOrganizer && (
              <Link
                to="/dashboard/events/create"
                className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-3 rounded-2xl shadow-lg shadow-indigo-600/20 transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Event</span>
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center space-x-2 text-sm font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white px-5 py-3 rounded-2xl shadow-lg transition duration-200"
            >
              <LogOut className="w-4 h-4 text-slate-400" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Dashboard Grid Content */}
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Profile Card Summary */}
          <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-6 rounded-3xl flex flex-col justify-between h-fit">
            <div>
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/10 text-white font-bold text-xl uppercase">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">{user.name}</h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase mt-1.5 ${
                    user.role === 'organizer' 
                      ? 'bg-purple-500/10 border border-purple-500/20 text-purple-400' 
                      : 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400'
                  }`}>
                    {user.role}
                  </span>
                </div>
              </div>

              <div className="space-y-4 border-t border-slate-950 pt-5">
                <div className="flex items-center space-x-3 text-xs text-slate-400">
                  <Mail className="w-4 h-4 text-slate-500" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-xs text-slate-400">
                  <Shield className="w-4 h-4 text-slate-500" />
                  <span className="capitalize">{user.role} Account</span>
                </div>
                {user.createdAt && (
                  <div className="flex items-center space-x-3 text-xs text-slate-400">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span>Joined {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 border-t border-slate-950 pt-5">
              <div className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-900/60 flex items-center space-x-3 text-[11px] text-slate-500">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Account verified for campus event management.</span>
              </div>
            </div>
          </div>

          {/* Main Dashboard Interaction Widgets */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900/20 border border-slate-900/80 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    {isUserOrganizer ? 'Events Created' : 'Registered Events'}
                  </span>
                  <span className="text-2xl font-extrabold text-white mt-1 block">
                    {eventsList.length}
                  </span>
                </div>
                <div className="h-9 w-9 rounded-xl bg-slate-950 border border-slate-900 flex items-center justify-center text-slate-400">
                  <ClipboardList className="w-4 h-4 text-indigo-400" />
                </div>
              </div>

              <div className="bg-slate-900/20 border border-slate-900/80 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    {isUserOrganizer ? 'Total Event RSVPs' : 'Active Campuses'}
                  </span>
                  <span className="text-2xl font-extrabold text-white mt-1 block">
                    {isUserOrganizer ? totalRegistrations : 1}
                  </span>
                </div>
                <div className="h-9 w-9 rounded-xl bg-slate-950 border border-slate-900 flex items-center justify-center text-slate-400">
                  <Database className="w-4 h-4 text-purple-400" />
                </div>
              </div>

              <div className="bg-slate-900/20 border border-slate-900/80 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Hub Events</span>
                  <span className="text-2xl font-extrabold text-white mt-1 block">{totalHubEvents}</span>
                </div>
                <div className="h-9 w-9 rounded-xl bg-slate-950 border border-slate-900 flex items-center justify-center text-slate-400">
                  <Calendar className="w-4 h-4 text-pink-400" />
                </div>
              </div>

              {/* Unread Notifications Summary */}
              <div className="bg-slate-900/20 border border-slate-900/80 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Unread Notifications</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-2xl font-extrabold text-white block">{unreadNotifications}</span>
                    <Link
                      to="/notifications"
                      className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 hover:underline"
                    >
                      View Notifications
                    </Link>
                  </div>
                </div>
                <div className="h-9 w-9 rounded-xl bg-slate-950 border border-slate-900 flex items-center justify-center text-slate-400">
                  <Bell className="w-4 h-4 text-amber-400" />
                </div>
              </div>
            </div>

            {/* Modular Summary Cards */}
            <div className="grid sm:grid-cols-2 gap-6">
              
              {/* Event Module Card */}
              <div className="bg-slate-900/40 border border-slate-900 hover:border-slate-800/80 p-6 rounded-3xl transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="h-10 w-10 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800 mb-4 shadow-sm">
                    <Calendar className="h-5 w-5 text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Campus Events</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    Browse all academic workshops, cultural events, hackathons, and activities scheduled on campus.
                  </p>
                </div>
                <Link
                  to="/events"
                  className="group inline-flex items-center justify-between w-full text-xs font-semibold text-white bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 py-3 px-4 rounded-xl transition duration-200"
                >
                  <span>Explore Events</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-slate-400 group-hover:text-white" />
                </Link>
              </div>

              {/* Organizer: Manage Events OR Student: My Registrations */}
              {isUserOrganizer ? (
                <div className="bg-slate-900/40 border border-purple-500/20 hover:border-purple-500/40 p-6 rounded-3xl transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 mb-4 shadow-sm">
                      <Shield className="h-5 w-5 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Organizer Console</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-6">
                      Manage events you have created, view registration counts, update event information, or post new ones.
                    </p>
                  </div>
                  <Link
                    to="/dashboard/events"
                    className="group inline-flex items-center justify-between w-full text-xs font-semibold text-white bg-purple-600/20 border border-purple-500/30 hover:bg-purple-600 py-3 px-4 rounded-xl transition duration-200"
                  >
                    <span>Manage My Events ({eventsList.length})</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-purple-300 group-hover:text-white" />
                  </Link>
                </div>
              ) : (
                <div className="bg-slate-900/40 border border-slate-900 hover:border-slate-800/80 p-6 rounded-3xl transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="h-10 w-10 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800 mb-4 shadow-sm">
                      <ClipboardList className="h-5 w-5 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">My Registrations</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-6">
                      Track events you have registered for, view venue schedules, and manage your RSVPs.
                    </p>
                  </div>
                  <Link
                    to="/events"
                    className="group inline-flex items-center justify-between w-full text-xs font-semibold text-white bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 py-3 px-4 rounded-xl transition duration-200"
                  >
                    <span>View Registered ({eventsList.length})</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-slate-400 group-hover:text-white" />
                  </Link>
                </div>
              )}

              {/* Registered Events / My Events Summary List */}
              <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-3xl sm:col-span-2 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    {isUserOrganizer ? 'Recently Created Events' : 'Your Registered Campus Events'}
                  </h3>
                  {isUserOrganizer ? (
                    <Link to="/dashboard/events" className="text-xs text-indigo-400 hover:underline">
                      View all
                    </Link>
                  ) : (
                    <Link to="/events" className="text-xs text-indigo-400 hover:underline">
                      Browse more
                    </Link>
                  )}
                </div>

                {eventsList.length > 0 ? (
                  <div className="space-y-3">
                    {eventsList.slice(0, 3).map((event) => {
                      const style = getCategoryBadgeStyle(event.category);
                      const formattedDate = formatShortDate(event.date);
                      return (
                        <div
                          key={event._id}
                          className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-900/80 hover:border-slate-800 transition"
                        >
                          <div className="space-y-1 min-w-0 pr-4">
                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md ${style.badge}`}>
                                {event.category}
                              </span>
                              <span className="text-xs text-slate-400 truncate font-semibold text-white">
                                {event.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-[11px] text-slate-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formattedDate}
                              </span>
                              <span className="flex items-center gap-1 truncate">
                                <MapPin className="w-3 h-3" />
                                {event.location}
                              </span>
                            </div>
                          </div>

                          <Link
                            to={`/events/${event._id}`}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white shrink-0 transition"
                          >
                            View
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-xs text-slate-500">
                      {isUserOrganizer
                        ? 'You have not created any events yet.'
                        : 'You are not currently registered for any events.'}
                    </p>
                    <Link
                      to={isUserOrganizer ? '/dashboard/events/create' : '/events'}
                      className="inline-block mt-3 text-xs font-semibold text-indigo-400 hover:underline"
                    >
                      {isUserOrganizer ? 'Create your first event →' : 'Explore events to attend →'}
                    </Link>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
