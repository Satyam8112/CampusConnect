import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft, Calendar } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="relative min-h-[calc(100vh-16rem)] flex flex-col items-center justify-center py-24 px-6 text-center overflow-hidden">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl animate-pulse" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />

      <div className="max-w-md mx-auto space-y-6">
        {/* Glow Icon */}
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-2 shadow-inner">
          <HelpCircle className="h-8 w-8 animate-bounce" />
        </div>

        {/* 404 Header */}
        <h1 className="text-8xl font-black bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
          404
        </h1>

        <h2 className="text-2xl font-bold text-white tracking-tight mt-4">
          Page Not Found
        </h2>

        <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
          The requested page path does not exist, has been removed, or is undergoing scheduling maintenance.
        </p>

        {/* Home Button CTA */}
        <div className="pt-6">
          <Link
            to="/"
            className="group inline-flex items-center justify-center space-x-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl shadow-lg shadow-indigo-600/15 hover:shadow-indigo-600/30 hover:-translate-y-0.5 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
