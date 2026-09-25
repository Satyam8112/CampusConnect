import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, ArrowRight, Users, CheckCircle2 } from 'lucide-react';
import { formatShortDate, getCategoryBadgeStyle } from '../utils/auth';

const EventCard = ({ event }) => {
  const {
    _id,
    title,
    description,
    category = 'Technical',
    date,
    startTime,
    endTime,
    location,
    image,
    organizer,
    capacity = 0,
    registrations = [],
    isRegistered = false
  } = event;

  const style = getCategoryBadgeStyle(category);
  const regCount = event.registrationCount !== undefined ? event.registrationCount : registrations.length;
  const remaining = event.remainingSeats !== undefined ? event.remainingSeats : Math.max(0, capacity - regCount);
  const isFull = event.isFull !== undefined ? event.isFull : (capacity > 0 && regCount >= capacity);

  const organizerName = organizer?.name || (typeof organizer === 'string' ? organizer : 'Campus Organizer');
  const formattedDate = formatShortDate(date);
  const timeDisplay = startTime ? `${startTime}${endTime ? ` - ${endTime}` : ''}` : 'Time TBA';

  // Category fallback gradients when image is not present
  const categoryGradients = {
    technical: 'from-indigo-900/60 via-slate-900 to-slate-950',
    cultural: 'from-pink-900/60 via-slate-900 to-slate-950',
    sports: 'from-emerald-900/60 via-slate-900 to-slate-950',
    business: 'from-amber-900/60 via-slate-900 to-slate-950',
    academic: 'from-cyan-900/60 via-slate-900 to-slate-950',
    social: 'from-violet-900/60 via-slate-900 to-slate-950'
  };

  const gradientClass = categoryGradients[category.toLowerCase()] || categoryGradients.technical;

  return (
    <div className="group flex flex-col bg-slate-900/40 border border-slate-900 rounded-2xl overflow-hidden hover:border-slate-800 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-300">
      
      {/* Event Banner Image or Gradient Header */}
      <div className={`relative h-44 w-full overflow-hidden bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              // Fallback to gradient if image fails to load
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="text-center px-4">
            <span className="text-2xl font-black uppercase tracking-widest text-white/10 select-none">
              {category}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />
        
        {/* Category Badge */}
        <span className={`absolute top-4 left-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase text-white shadow-md ${style.badge}`}>
          {category}
        </span>

        {/* Status Pills */}
        <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5">
          {isRegistered && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-500/90 text-white shadow-md">
              <CheckCircle2 className="w-3 h-3" />
              Registered
            </span>
          )}
          {isFull && !isRegistered && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-rose-500/90 text-white shadow-md">
              Sold Out
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          {/* Host Branding */}
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 block mb-2 truncate">
            Hosted by {organizerName}
          </span>
          
          {/* Title */}
          <h4 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors duration-200 line-clamp-1 mb-2">
            {title}
          </h4>
          
          {/* Description */}
          <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed mb-5">
            {description}
          </p>
        </div>

        {/* Metadatas */}
        <div className="space-y-3 border-t border-slate-900/80 pt-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 font-medium">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>{regCount}/{capacity}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <Clock className="w-4 h-4 text-slate-500 shrink-0" />
            <span className="truncate">{timeDisplay}</span>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
            <span className="truncate">{location}</span>
          </div>

          {/* Button CTA linking to /events/:id */}
          <Link
            to={`/events/${_id}`}
            className="group/btn inline-flex items-center justify-between w-full text-xs font-semibold text-white bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 py-3 px-4 rounded-xl transition duration-200 mt-2"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform text-indigo-400" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
