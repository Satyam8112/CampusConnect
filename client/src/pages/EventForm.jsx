import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Tag,
  Image,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  PlusCircle,
  Save,
  Shield,
  Loader2
} from 'lucide-react';
import {
  isOrganizer,
  getAuthHeaders,
  getAuthUser,
  isAuthenticated
} from '../utils/auth';

const categories = ['Technical', 'Cultural', 'Sports', 'Business', 'Academic', 'Social'];

const EventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    category: 'Technical',
    capacity: 50,
    image: ''
  });

  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [currentRegistrationsCount, setCurrentRegistrationsCount] = useState(0);

  const currentUser = getAuthUser();

  // Route protection and initial data loading for edit mode
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    if (!isOrganizer()) {
      navigate('/dashboard');
      return;
    }

    if (isEditMode) {
      const loadEvent = async () => {
        setInitialLoading(true);
        setServerError('');
        try {
          const res = await axios.get(`/api/events/${id}`, {
            headers: getAuthHeaders()
          });

          if (res.data && res.data.status === 'success') {
            const ev = res.data.data;
            const organizerId = ev.organizer?._id || ev.organizer;

            // Verify ownership
            if (currentUser && organizerId && organizerId.toString() !== currentUser.id) {
              setServerError('You are not authorized to edit this event because you are not its creator.');
              setInitialLoading(false);
              return;
            }

            let formattedDate = '';
            if (ev.date) {
              const d = new Date(ev.date);
              if (!isNaN(d.getTime())) {
                formattedDate = d.toISOString().split('T')[0];
              }
            }

            setFormData({
              title: ev.title || '',
              description: ev.description || '',
              date: formattedDate,
              startTime: ev.startTime || '',
              endTime: ev.endTime || '',
              location: ev.location || '',
              category: ev.category || 'Technical',
              capacity: ev.capacity || 50,
              image: ev.image || ''
            });

            setCurrentRegistrationsCount(ev.registrationCount || (ev.registrations?.length || 0));
          } else {
            setServerError('Failed to fetch event details.');
          }
        } catch (err) {
          console.error('[LOAD EVENT ERROR]', err);
          setServerError(err.response?.data?.message || 'Event not found or failed to load.');
        } finally {
          setInitialLoading(false);
        }
      };

      loadEvent();
    }
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Event title is required';
    if (!formData.description.trim()) errs.description = 'Event description is required';
    if (!formData.date) errs.date = 'Event date is required';
    if (!formData.startTime.trim()) errs.startTime = 'Start time is required';
    if (!formData.location.trim()) errs.location = 'Location/venue is required';

    const cap = parseInt(formData.capacity, 10);
    if (!cap || cap < 1) {
      errs.capacity = 'Capacity must be at least 1 attendee';
    } else if (isEditMode && cap < currentRegistrationsCount) {
      errs.capacity = `Capacity cannot be lower than existing registrations (${currentRegistrationsCount})`;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMessage('');

    if (!validate()) return;

    setSubmitting(true);

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        date: formData.date,
        startTime: formData.startTime.trim(),
        endTime: formData.endTime ? formData.endTime.trim() : '',
        location: formData.location.trim(),
        category: formData.category,
        capacity: parseInt(formData.capacity, 10),
        image: formData.image ? formData.image.trim() : ''
      };

      if (isEditMode) {
        const res = await axios.put(`/api/events/${id}`, payload, {
          headers: getAuthHeaders()
        });

        if (res.data && res.data.status === 'success') {
          setSuccessMessage('Event updated successfully! Redirecting...');
          setTimeout(() => navigate('/dashboard/events'), 1200);
        }
      } else {
        const res = await axios.post('/api/events', payload, {
          headers: getAuthHeaders()
        });

        if (res.data && res.data.status === 'success') {
          setSuccessMessage('Event created successfully! Redirecting...');
          setTimeout(() => navigate('/dashboard/events'), 1200);
        }
      }
    } catch (err) {
      console.error('[EVENT FORM ERROR]', err);
      setServerError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} event.`);
    } finally {
      setSubmitting(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] py-12 px-6 bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="flex items-center space-x-3 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
          <span>Loading event details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-6 bg-slate-950 text-slate-100 relative overflow-hidden">
      <div className="mx-auto max-w-3xl space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/dashboard/events"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to My Events</span>
          </Link>
          <span className="text-xs text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full font-medium flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            {isEditMode ? 'Event Editor' : 'Organizer Mode'}
          </span>
        </div>

        {/* Header Title */}
        <div className="border-b border-slate-900 pb-6">
          <div className="inline-flex items-center space-x-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 mb-3">
            <Sparkles className="h-3 w-3 text-indigo-400" />
            <span className="text-[10px] font-semibold tracking-wider text-indigo-300 uppercase">
              Event Management
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {isEditMode ? (
              <>Edit <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Event</span></>
            ) : (
              <>Create Campus <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Event</span></>
            )}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {isEditMode
              ? 'Update event details, change schedules, or adjust attendee capacity.'
              : 'Fill in the details below to publish an upcoming university event, club workshop, or tournament.'}
          </p>
        </div>

        {/* Alerts */}
        {serverError && (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-sm flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <span>{serverError}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-sm flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-slate-900/40 border border-slate-900 p-8 rounded-3xl space-y-6 backdrop-blur-md">
          
          {/* Title */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Event Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Annual Campus Hackathon 2026"
              className={`w-full bg-slate-950/60 border ${
                errors.title ? 'border-rose-500' : 'border-slate-800'
              } rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition`}
            />
            {errors.title && <p className="text-xs text-rose-400">{errors.title}</p>}
          </div>

          {/* Category & Capacity Row */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-indigo-400" />
                Category <span className="text-rose-400">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition"
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-slate-900 text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                Max Capacity <span className="text-rose-400">*</span>
                {isEditMode && currentRegistrationsCount > 0 && (
                  <span className="text-[10px] text-slate-500 font-normal lowercase">
                    ({currentRegistrationsCount} registered)
                  </span>
                )}
              </label>
              <input
                type="number"
                name="capacity"
                min="1"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="100"
                className={`w-full bg-slate-950/60 border ${
                  errors.capacity ? 'border-rose-500' : 'border-slate-800'
                } rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition`}
              />
              {errors.capacity && <p className="text-xs text-rose-400">{errors.capacity}</p>}
            </div>
          </div>

          {/* Date & Time Row */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                Date <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full bg-slate-950/60 border ${
                  errors.date ? 'border-rose-500' : 'border-slate-800'
                } rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition`}
              />
              {errors.date && <p className="text-xs text-rose-400">{errors.date}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                Start Time <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                placeholder="10:00 AM"
                className={`w-full bg-slate-950/60 border ${
                  errors.startTime ? 'border-rose-500' : 'border-slate-800'
                } rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition`}
              />
              {errors.startTime && <p className="text-xs text-rose-400">{errors.startTime}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                End Time
              </label>
              <input
                type="text"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                placeholder="02:00 PM (optional)"
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              Location / Venue <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Main Auditorium, Block C"
              className={`w-full bg-slate-950/60 border ${
                errors.location ? 'border-rose-500' : 'border-slate-800'
              } rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition`}
            />
            {errors.location && <p className="text-xs text-rose-400">{errors.location}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Description <span className="text-rose-400">*</span>
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed schedule, speaker details, rules, prerequisites..."
              className={`w-full bg-slate-950/60 border ${
                errors.description ? 'border-rose-500' : 'border-slate-800'
              } rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition resize-none`}
            />
            {errors.description && <p className="text-xs text-rose-400">{errors.description}</p>}
          </div>

          {/* Banner Image URL */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Image className="w-3.5 h-3.5 text-slate-500" />
              Banner Image URL (optional)
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition"
            />
          </div>

          {/* Actions */}
          <div className="border-t border-slate-800 pt-6 flex items-center justify-end space-x-4">
            <Link
              to="/dashboard/events"
              className="px-5 py-3 rounded-xl border border-slate-800 bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-900 transition text-sm font-semibold"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/20 transition disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isEditMode ? 'Saving...' : 'Publishing...'}</span>
                </>
              ) : isEditMode ? (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Publish Event</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default EventForm;
