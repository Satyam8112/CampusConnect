import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import EventCard from '../components/EventCard';
import {
  Calendar,
  Search,
  Filter,
  PlusCircle,
  Sparkles,
  AlertCircle,
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';
import { isOrganizer, getAuthHeaders } from '../utils/auth';

const categories = ['All', 'Technical', 'Cultural', 'Sports', 'Business', 'Academic', 'Social'];

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const userIsOrganizer = isOrganizer();

  const fetchEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/events', {
        headers: getAuthHeaders()
      });
      if (response.data && response.data.status === 'success') {
        setEvents(response.data.data || []);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error('[EVENTS PAGE FETCH ERROR]', err);
      setError(err.response?.data?.message || 'Failed to load events. Make sure the server is operational.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter events based on category and search query
  const filteredEvents = events.filter((event) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      (event.category || '').toLowerCase() === selectedCategory.toLowerCase();

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      (event.title || '').toLowerCase().includes(query) ||
      (event.description || '').toLowerCase().includes(query) ||
      (event.location || '').toLowerCase().includes(query) ||
      (event.organizer?.name || '').toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-6 bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-12 left-1/3 -z-10 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 -z-10 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="mx-auto max-w-7xl space-y-10">
        
        {/* Header Title & Actions */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-900 pb-8">
          <div>
            <div className="inline-flex items-center space-x-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 mb-3">
              <Sparkles className="h-3 w-3 text-indigo-400" />
              <span className="text-[10px] font-semibold tracking-wider text-indigo-300 uppercase">
                Campus Activities Hub
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              Discover Campus <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Events</span>
            </h1>
            <p className="text-slate-400 mt-2 text-sm sm:text-base max-w-2xl">
              Browse workshops, hackathons, sports tournaments, and club meets. RSVP to reserve your seat or manage your campus involvement.
            </p>
          </div>

          {/* Organizer Quick Action */}
          {userIsOrganizer && (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard/events"
                className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-300 bg-slate-900 hover:text-white hover:bg-slate-800 border border-slate-800 px-4 py-2.5 rounded-xl transition"
              >
                <span>My Events</span>
              </Link>
              <Link
                to="/dashboard/events/create"
                className="inline-flex items-center space-x-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Event</span>
              </Link>
            </div>
          )}
        </div>

        {/* Controls: Search & Category Filters */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events by title, description, venue, or organizer..."
                className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchEvents}
              title="Refresh events"
              className="inline-flex items-center justify-center p-3 rounded-2xl bg-slate-900/60 border border-slate-800 hover:bg-slate-900 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Category Chips Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            <span className="flex items-center gap-1.5 px-3 py-1.5 text-slate-500 text-xs font-semibold shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Categories:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-900/50 border border-slate-900 text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-300">{filteredEvents.length}</strong> {filteredEvents.length === 1 ? 'event' : 'events'}
            {selectedCategory !== 'All' && <span> in <strong className="text-indigo-400">{selectedCategory}</strong></span>}
            {searchQuery && <span> matching "<strong className="text-slate-300">{searchQuery}</strong>"</span>}
          </span>
        </div>

        {/* Loading State Skeleton */}
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-slate-900/30 border border-slate-900 rounded-2xl p-6 h-96 animate-pulse space-y-4">
                <div className="h-44 bg-slate-900/70 rounded-xl" />
                <div className="h-4 w-1/3 bg-slate-900 rounded" />
                <div className="h-6 w-3/4 bg-slate-900 rounded" />
                <div className="h-12 bg-slate-900/50 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="text-center py-16 bg-slate-900/30 border border-rose-900/30 rounded-3xl p-8 max-w-lg mx-auto space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-400 mb-2">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Failed to Load Events</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{error}</p>
            <button
              onClick={fetchEvents}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Loading</span>
            </button>
          </div>
        )}

        {/* Events Grid */}
        {!loading && !error && filteredEvents.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredEvents.length === 0 && (
          <div className="text-center py-20 bg-slate-900/20 border border-slate-900 border-dashed rounded-3xl p-12 max-w-md mx-auto space-y-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-500">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">No Events Found</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              {searchQuery || selectedCategory !== 'All'
                ? "We couldn't find any events matching your current filter criteria."
                : "No campus events are currently listed."}
            </p>
            {(searchQuery || selectedCategory !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-indigo-400 border border-slate-800 rounded-xl text-xs font-semibold transition"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Events;
