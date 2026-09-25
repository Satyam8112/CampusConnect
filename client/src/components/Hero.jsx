import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative overflow-hidden py-24 md:py-32 flex flex-col items-center justify-center">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60" />

      <div className="mx-auto max-w-4xl px-6 text-center">
        {/* Floating Accent Tag */}
        <div className="inline-flex items-center space-x-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 mb-8 animate-fade-in shadow-inner">
          <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse" />
          <span className="text-xs font-semibold tracking-wide text-indigo-300 uppercase">
            Empowering Campus Life
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
          CampusConnect –
          <span className="mt-2 block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            College Event Management System
          </span>
        </h1>

        {/* Description Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-slate-400 leading-relaxed">
          The central hub for organizing, discovering, and joining exciting campus activities. Connect with clubs, track schedules, and never miss out on workshops, festivals, or hackathons.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/events"
            className="group inline-flex items-center justify-center space-x-2 w-full sm:w-auto text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-6 py-3.5 rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:-translate-y-0.5 transition-all duration-200"
          >
            <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
            <span>Explore Events</span>
          </Link>
          <Link
            to="/register"
            className="group inline-flex items-center justify-center space-x-2 w-full sm:w-auto text-base font-semibold text-slate-300 hover:text-white bg-slate-900/50 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 px-6 py-3.5 rounded-xl hover:-translate-y-0.5 transition-all duration-200"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Statistics Grid (Premium touch) */}
        <div className="mt-20 grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-3xl mx-auto border-t border-slate-900 pt-10">
          <div>
            <span className="block text-3xl md:text-4xl font-extrabold text-white">50+</span>
            <span className="block text-xs uppercase tracking-wider text-slate-500 mt-1 font-medium">Campus Clubs</span>
          </div>
          <div>
            <span className="block text-3xl md:text-4xl font-extrabold text-white">120+</span>
            <span className="block text-xs uppercase tracking-wider text-slate-500 mt-1 font-medium">Annual Events</span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="block text-3xl md:text-4xl font-extrabold text-white">5K+</span>
            <span className="block text-xs uppercase tracking-wider text-slate-500 mt-1 font-medium">Students Joined</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
