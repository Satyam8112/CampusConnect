import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Github, Twitter, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-8 relative">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1 - Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-md">
                <Calendar className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">CampusConnect</span>
            </div>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              Bridging the gap between college organizations, students, and events. Discover clubs, plan attendance, and foster campus communities together.
            </p>
          </div>

          {/* Column 2 - Quick Links */}
          <div className="space-y-4">
            <h5 className="text-white text-sm font-semibold tracking-wider uppercase">Navigation</h5>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/" className="hover:text-indigo-400 transition-colors duration-200">Home</Link></li>
              <li><Link to="/events" className="hover:text-indigo-400 transition-colors duration-200">Events</Link></li>
              <li><Link to="/about" className="hover:text-indigo-400 transition-colors duration-200">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-indigo-400 transition-colors duration-200">Contact</Link></li>
            </ul>
          </div>

          {/* Column 3 - Technical stack */}
          <div className="space-y-4">
            <h5 className="text-white text-sm font-semibold tracking-wider uppercase">Built With</h5>
            <ul className="space-y-2 text-sm text-slate-500 font-mono">
              <li>React & Vite</li>
              <li>Tailwind CSS</li>
              <li>Node.js & Express</li>
              <li>MongoDB & Mongoose</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-1">
            <span>© 2026 CampusConnect Hub. Created with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for university students.</span>
          </div>

          {/* Socials */}
          <div className="flex items-center space-x-4">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition duration-200">
              <Github className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition duration-200">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition duration-200">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
