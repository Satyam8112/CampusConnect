import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Shield,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Edit,
  Trash2,
  Share2,
  UserCheck,
  UserX,
  LogIn
} from 'lucide-react';
import {
  getAuthUser,
  getAuthHeaders,
  isAuthenticated,
  isStudent,
  isOrganizer,
  formatEventDate,
  getCategoryBadgeStyle
} from '../utils/auth';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const currentUser = getAuthUser();
  const loggedIn = isAuthenticated();
  const userIsStudent = isStudent();
  const userIsOrganizer = isOrganizer();

  const fetchEvent = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`/api/events/${id}`, {
        headers: getAuthHeaders()
      });
      if (response.data && response.data.status === 'success') {
        setEvent(response.data.data);
      } else {
        setError('Event details could not be retrieved.');
      }
    } catch (err) {
      console.error('[EVENT DETAILS FETCH ERROR]', err);
      setError(err.response?.data?.message || 'Event not found or failed to load.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  // Handle RSVP / Register
  const handleRegister = async () => {
    if (!loggedIn) {
      navigate('/login');
      return;
    }

    if (!userIsStudent) {
      setFeedback({
        type: 'error',
        message: 'Only student accounts can register for campus events.'
      });
      return;
    }

    setActionLoading(true);
    setFeedback({ type: '', message: '' });

    try {
      const response = await axios.post(
        `/api/events/${id}/register`,
        {},
        { headers: getAuthHeaders() }
      );

      if (response.data && response.data.status === 'success') {
        setFeedback({
          type: 'success',
          message: 'RSVP confirmed! You are registered for this event.'
        });
        if (response.data.data) {
          setEvent(response.data.data);
        } else {
          fetchEvent();
        }
      }
    } catch (err) {
      console.error('[REGISTRATION ERROR]', err);
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to complete registration.'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Cancel Registration (Unregister)
  const handleCancelRegistration = async () => {
    if (!window.confirm('Are you sure you want to cancel your registration for this event?')) {
      return;
    }

    setActionLoading(true);
    setFeedback({ type: '', message: '' });

    try {
      const response = await axios.delete(
        `/api/events/${id}/register`,
        { headers: getAuthHeaders() }
      );

      if (response.data && response.data.status === 'success') {
        setFeedback({
          type: 'success',
          message: 'Your registration has been cancelled.'
        });
        if (response.data.data) {
          setEvent(response.data.data);
        } else {
          fetchEvent();
        }
      }
    } catch (err) {
      console.error('[CANCEL REGISTRATION ERROR]', err);
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to cancel registration.'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Delete Event (Organizer Owner)
  const handleDeleteEvent = async () => {
    setActionLoading(true);
    setFeedback({ type: '', message: '' });

    try {
      const response = await axios.delete(
        `/api/events/${id}`,
        { headers: getAuthHeaders() }
      );

      if (response.data && response.data.status === 'success') {
        navigate('/dashboard/events', {
          state: { message: 'Event successfully deleted.' }
        });
      }
    } catch (err) {
      console.error('[DELETE EVENT ERROR]', err);
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to delete event.'
      });
      setActionLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  // Share Event link
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setFeedback({ type: 'success', message: 'Event link copied to clipboard!' });
      setTimeout(() => setFeedback({ type: '', message: '' }), 3000);
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] py-12 px-6 bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="max-w-4xl w-full space-y-8 animate-pulse">
          <div className="h-6 w-32 bg-slate-900 rounded" />
          <div className="h-64 bg-slate-900/60 rounded-3xl" />
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <div className="h-8 w-3/4 bg-slate-900 rounded" />
              <div className="h-24 bg-slate-900/40 rounded-xl" />
            </div>
            <div className="h-64 bg-slate-900/40 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !event) {
    return (
      <div className="min-h-[calc(100vh-4rem)] py-20 px-6 bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="max-w-md w-full text-center space-y-6 bg-slate-900/40 border border-slate-800 p-8 rounded-3xl backdrop-blur-md">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Event Not Available</h3>
          <p className="text-sm text-slate-400 leading-relaxed">{error || 'Event could not be found.'}</p>
          <Link
            to="/events"
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-xl transition text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Events Hub</span>
          </Link>
        </div>
      </div>
    );
  }

  const {
    title,
    description,
    category = 'Technical',
    date,
    startTime,
    endTime,
    location,
    capacity = 0,
    registrations = [],
    organizer,
    image,
    isRegistered = false,
    registrationCount = registrations.length,
    remainingSeats = Math.max(0, capacity - registrations.length),
    isFull = capacity > 0 && registrations.length >= capacity
  } = event;

  const style = getCategoryBadgeStyle(category);
  const formattedDate = formatEventDate(date);
  const timeDisplay = startTime ? `${startTime}${endTime ? ` - ${endTime}` : ''}` : 'Time TBA';
  const organizerId = organizer?._id || organizer;
  const isOwner = userIsOrganizer && currentUser && organizerId && (organizerId.toString() === currentUser.id);

  const fillPercentage = capacity > 0 ? Math.min(100, Math.round((registrationCount / capacity) * 100)) : 0;

  return (
    <div className="min-h-[calc(100vh-4rem)] py-10 px-6 bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-10 left-1/4 -z-10 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 -z-10 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-5xl space-y-8">
        
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <Link
            to="/events"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Events</span>
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center space-x-1.5 text-xs font-medium text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>

        {/* Feedback Banner */}
        {feedback.message && (
          <div
            className={`p-4 rounded-2xl border flex items-center space-x-3 text-sm animate-in fade-in duration-200 ${
              feedback.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Hero Banner Card */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-900 bg-slate-900/40">
          {image ? (
            <div className="h-64 sm:h-80 w-full overflow-hidden">
              <img
                src={image}
                alt={title}
                className="h-full w-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
          ) : (
            <div className="h-48 sm:h-56 w-full bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-950 flex items-center px-8 border-b border-slate-900">
              <span className="text-4xl sm:text-6xl font-black uppercase tracking-widest text-white/5 select-none">
                {category}
              </span>
            </div>
          )}

          {/* Banner Overlays & Category Tag */}
          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-md ${style.badge}`}>
                {category}
              </span>

              {isRegistered && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-500/90 text-white shadow-md">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  You are Registered
                </span>
              )}

              {isFull && !isRegistered && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-rose-500/90 text-white shadow-md">
                  Capacity Reached (Full)
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {title}
            </h1>

            <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-400">
              <span>Organized by</span>
              <strong className="text-slate-200 font-semibold">{organizer?.name || 'Campus Faculty / Club'}</strong>
              {organizer?.email && (
                <span className="text-slate-500">({organizer.email})</span>
              )}
            </div>
          </div>
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Main Description Column */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-slate-900/40 border border-slate-900 p-6 sm:p-8 rounded-3xl space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                About this Event
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </div>

            {/* Organizer Controls (If current user is owner) */}
            {isOwner && (
              <div className="bg-purple-950/20 border border-purple-500/20 p-6 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Shield className="w-4 h-4 text-purple-400" />
                      Organizer Administration
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      You are the host and creator of this campus event.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    to={`/dashboard/events/edit/${event._id}`}
                    className="inline-flex items-center space-x-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 px-4 py-2.5 rounded-xl shadow-lg shadow-purple-600/20 transition"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Event Details</span>
                  </Link>

                  {!showDeleteConfirm ? (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="inline-flex items-center space-x-2 text-xs font-semibold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-600 border border-rose-500/20 px-4 py-2.5 rounded-xl transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Event</span>
                    </button>
                  ) : (
                    <div className="flex items-center space-x-2 bg-rose-950/60 border border-rose-500/40 p-1.5 rounded-xl">
                      <span className="text-xs text-rose-300 px-2 font-medium">Confirm delete?</span>
                      <button
                        onClick={handleDeleteEvent}
                        disabled={actionLoading}
                        className="px-3 py-1 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition"
                      >
                        {actionLoading ? 'Deleting...' : 'Yes, Delete'}
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-2.5 py-1 text-xs text-slate-400 hover:text-white transition"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Action & Metadata Column */}
          <div className="space-y-6">
            
            {/* Event Details Card */}
            <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-3xl space-y-5">
              <h3 className="text-base font-bold text-white border-b border-slate-900 pb-3">
                Schedule & Venue
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start space-x-3 text-slate-300">
                  <Calendar className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-semibold">Date</span>
                    <span>{formattedDate}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-slate-300">
                  <Clock className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-semibold">Time</span>
                    <span>{timeDisplay}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-slate-300">
                  <MapPin className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-semibold">Location</span>
                    <span>{location}</span>
                  </div>
                </div>
              </div>

              {/* Capacity & Progress */}
              <div className="border-t border-slate-900 pt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-400" />
                    Registrations
                  </span>
                  <span className="font-semibold text-white">
                    {registrationCount} / {capacity}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                  <div
                    className={`h-full transition-all duration-500 ${
                      fillPercentage >= 100
                        ? 'bg-rose-500'
                        : fillPercentage > 75
                        ? 'bg-amber-500'
                        : 'bg-indigo-500'
                    }`}
                    style={{ width: `${fillPercentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{remainingSeats} seats available</span>
                  <span>{fillPercentage}% full</span>
                </div>
              </div>

              {/* RSVP Action Panel */}
              <div className="border-t border-slate-900 pt-5 space-y-3">
                {loggedIn ? (
                  userIsStudent ? (
                    isRegistered ? (
                      <div className="space-y-3">
                        <div className="w-full py-3 px-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-center space-x-2">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>You are confirmed for this event</span>
                        </div>
                        <button
                          onClick={handleCancelRegistration}
                          disabled={actionLoading}
                          className="w-full py-2.5 px-4 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded-xl transition"
                        >
                          {actionLoading ? 'Updating...' : 'Cancel my RSVP'}
                        </button>
                      </div>
                    ) : isFull ? (
                      <button
                        disabled
                        className="w-full py-3.5 px-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 text-xs font-bold uppercase tracking-wider cursor-not-allowed text-center"
                      >
                        Event Sold Out
                      </button>
                    ) : (
                      <button
                        onClick={handleRegister}
                        disabled={actionLoading}
                        className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-indigo-600/25 transition duration-200 flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>{actionLoading ? 'Reserving Seat...' : 'RSVP / Register Now'}</span>
                      </button>
                    )
                  ) : (
                    <div className="p-3 bg-slate-950/60 border border-slate-900 rounded-xl text-center text-xs text-slate-400">
                      Logged in as <strong>Organizer</strong>. Switch to a Student account to register for events.
                    </div>
                  )
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-indigo-600/25 transition duration-200 flex items-center justify-center space-x-2"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Sign In to Register</span>
                    </Link>
                    <p className="text-[11px] text-slate-500 text-center">
                      Don't have an account?{' '}
                      <Link to="/register" className="text-indigo-400 hover:underline">
                        Register here
                      </Link>
                    </p>
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

export default EventDetails;
