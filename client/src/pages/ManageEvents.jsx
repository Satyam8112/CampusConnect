import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  Shield,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';
import {
  getAuthHeaders,
  isOrganizer,
  isAuthenticated,
  formatShortDate,
  getCategoryBadgeStyle
} from '../utils/auth';

const ManageEvents = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [actionSuccess, setActionSuccess] = useState('');
  const [eventToDelete, setEventToDelete] = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    if (!isOrganizer()) {
      navigate('/dashboard');
      return;
    }

    fetchMyEvents();
  }, [navigate]);

  const fetchMyEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/events/organizer/my-events', {
        headers: getAuthHeaders()
      });
      if (response.data && response.data.status === 'success') {
        setEvents(response.data.data || []);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error('[MANAGE EVENTS FETCH ERROR]', err);
      setError(err.response?.data?.message || 'Failed to load your events.');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;

    setDeletingId(eventToDelete._id);
    setActionSuccess('');
    setError('');

    try {
      const response = await axios.delete(`/api/events/${eventToDelete._id}`, {
        headers: getAuthHeaders()
      });

      if (response.data && response.data.status === 'success') {
        setEvents((prev) => prev.filter((e) => e._id !== eventToDelete._id));
        setActionSuccess(`"${eventToDelete.title}" has been deleted.`);
        setTimeout(() => setActionSuccess(''), 4000);
      }
    } catch (err) {
      console.error('[DELETE EVENT ERROR]', err);
      setError(err.response?.data?.message || 'Failed to delete event.');
    } finally {
      setDeletingId(null);
      setEventToDelete(null);
    }
  };

  // Metrics
  const totalEvents = events.length;
  const totalRegistrations = events.reduce(
    (sum, e) => sum + (e.registrationCount || (e.registrations ? e.registrations.length : 0)),
    0
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-6 bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-12 left-1/4 -z-10 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 -z-10 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-6xl space-y-8">
        
        {/* Top Breadcrumb & Status */}
        <div className="flex items-center justify-between">
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>

          <span className="text-xs text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full font-medium flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            Organizer Console
          </span>
        </div>

        {/* Header Title Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-900 pb-8">
          <div>
            <div className="inline-flex items-center space-x-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 mb-3">
              <Sparkles className="h-3 w-3 text-indigo-400" />
              <span className="text-[10px] font-semibold tracking-wider text-indigo-300 uppercase">
                Event Management
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Manage Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Events</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Create new campus events, monitor live RSVPs, update schedules, or remove past listings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchMyEvents}
              title="Refresh listings"
              className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Link
              to="/dashboard/events/create"
              className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-500 px-5 py-3 rounded-xl shadow-lg shadow-indigo-600/20 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Event</span>
            </Link>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Total Events Created
              </span>
              <span className="text-3xl font-extrabold text-white mt-1 block">
                {totalEvents}
              </span>
            </div>
            <div className="h-11 w-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Total RSVPs Received
              </span>
              <span className="text-3xl font-extrabold text-white mt-1 block">
                {totalRegistrations}
              </span>
            </div>
            <div className="h-11 w-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Alerts */}
        {actionSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-sm flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-sm flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-24 bg-slate-900/40 border border-slate-900 rounded-2xl" />
            ))}
          </div>
        )}

        {/* Events List / Table */}
        {!loading && events.length > 0 && (
          <div className="space-y-4">
            {events.map((event) => {
              const style = getCategoryBadgeStyle(event.category);
              const formattedDate = formatShortDate(event.date);
              const regCount = event.registrationCount !== undefined ? event.registrationCount : (event.registrations?.length || 0);
              const capacity = event.capacity || 0;
              const remaining = Math.max(0, capacity - regCount);
              const isFull = capacity > 0 && regCount >= capacity;

              return (
                <div
                  key={event._id}
                  className="group bg-slate-900/40 border border-slate-900 hover:border-slate-800 p-5 rounded-2xl transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left info */}
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase shadow-sm ${style.badge}`}>
                        {event.category}
                      </span>
                      {isFull && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-rose-500/20 text-rose-400 border border-rose-500/30">
                          Full
                        </span>
                      )}
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formattedDate}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {event.startTime}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors truncate">
                      {event.title}
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {event.location}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-slate-300">
                        <Users className="w-3.5 h-3.5 text-indigo-400" />
                        {regCount} / {capacity} registered ({remaining} left)
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 border-slate-900 pt-3 md:pt-0">
                    <Link
                      to={`/events/${event._id}`}
                      title="View public details"
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>

                    <Link
                      to={`/dashboard/events/edit/${event._id}`}
                      title="Edit event"
                      className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600/10 hover:bg-indigo-600 border border-indigo-500/20 text-indigo-400 hover:text-white text-xs font-semibold transition"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </Link>

                    <button
                      onClick={() => setEventToDelete(event)}
                      title="Delete event"
                      className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-600 border border-rose-500/20 text-rose-400 hover:text-white text-xs font-semibold transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && events.length === 0 && (
          <div className="text-center py-20 bg-slate-900/20 border border-slate-900 border-dashed rounded-3xl p-12 max-w-md mx-auto space-y-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">No Events Published Yet</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              You have not created any campus events yet. Start organizing workshops, seminars, or activities for university students.
            </p>
            <Link
              to="/dashboard/events/create"
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-indigo-600/25 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Your First Event</span>
            </Link>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {eventToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Trash2 className="w-6 h-6" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Delete Event</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Are you sure you want to delete <strong className="text-white">"{eventToDelete.title}"</strong>? This will permanently remove the event and all of its student RSVP registrations.
                </p>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  onClick={() => setEventToDelete(null)}
                  disabled={deletingId === eventToDelete._id}
                  className="px-4 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deletingId === eventToDelete._id}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-rose-600/20"
                >
                  {deletingId === eventToDelete._id ? 'Deleting...' : 'Yes, Delete Event'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ManageEvents;
