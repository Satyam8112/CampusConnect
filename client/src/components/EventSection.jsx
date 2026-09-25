import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import EventCard from './EventCard';
import { CalendarDays, Filter, Loader2, ArrowRight } from 'lucide-react';
import { getAuthHeaders } from '../utils/auth';

const EventSection = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Technical', 'Cultural', 'Sports', 'Business', 'Academic'];

  useEffect(() => {
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
        console.error('[EVENT SECTION FETCH ERROR]', err);
        setError('Unable to load upcoming events right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = activeCategory === 'All'
    ? events
    : events.filter(event => (event.category || '').toLowerCase() === activeCategory.toLowerCase());

  return (
    <section id="events" className="py-20 border-t border-slate-900 bg-slate-950/40 relative">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 text-indigo-400 bg-indigo-500/5 border border-indigo-500/10 px-3 py-1 rounded-lg text-xs font-semibold mb-3 uppercase tracking-wider">
              <CalendarDays className="w-4 h-4" />
              <span>Campus Calendar</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Upcoming Campus Events
            </h2>
            <p className="text-slate-400 mt-2 text-sm sm:text-base max-w-xl">
              Explore what's happening around the university and find events to expand your skillset, network, or simply unwind.
            </p>
          </div>

          {/* Categories Navigation Filter */}
          <div className="flex flex-wrap items-center gap-2 border border-slate-900 bg-slate-950/60 p-1.5 rounded-2xl">
            <span className="flex items-center gap-1.5 px-3 py-1 text-slate-500 text-xs font-medium border-r border-slate-900 mr-1.5">
              <Filter className="w-3.5 h-3.5" />
              Filter
            </span>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition duration-200 ${
                  activeCategory === category
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-slate-900/30 border border-slate-900 rounded-2xl p-6 h-96 animate-pulse space-y-4">
                <div className="h-44 bg-slate-900/60 rounded-xl" />
                <div className="h-4 w-1/3 bg-slate-900 rounded" />
                <div className="h-6 w-3/4 bg-slate-900 rounded" />
                <div className="h-12 bg-slate-900/40 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="text-center py-16 bg-slate-900/20 border border-slate-900 border-dashed rounded-3xl p-6">
            <p className="text-slate-400 text-sm mb-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-xs font-semibold text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-xl transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Events Grid */}
        {!loading && !error && filteredEvents.length > 0 && (
          <div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                to="/events"
                className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 px-6 py-3 rounded-2xl shadow-lg transition duration-200"
              >
                <span>Browse All Campus Events</span>
                <ArrowRight className="w-4 h-4 text-indigo-400" />
              </Link>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredEvents.length === 0 && (
          <div className="text-center py-20 bg-slate-900/10 border border-slate-900 border-dashed rounded-3xl p-8">
            <CalendarDays className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h4 className="text-base font-semibold text-slate-300">No events found</h4>
            <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
              {activeCategory !== 'All'
                ? `No events currently scheduled under ${activeCategory}.`
                : 'No campus events are currently scheduled. Check back soon!'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default EventSection;
