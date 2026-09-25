import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Sparkles } from 'lucide-react';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  const contactDetails = [
    {
      icon: <Mail className="w-5 h-5 text-indigo-400" />,
      title: 'Email Support',
      value: 'support@campusconnect.edu',
      sub: 'Response within 24 hours'
    },
    {
      icon: <Phone className="w-5 h-5 text-purple-400" />,
      title: 'Phone Helpline',
      value: '+1 (555) 234-5678',
      sub: 'Mon-Fri, 9:00 AM - 5:00 PM'
    },
    {
      icon: <MapPin className="w-5 h-5 text-pink-400" />,
      title: 'Main Office',
      value: 'Student Union, Room 402',
      sub: 'University Campus Plaza'
    },
  ];

  return (
    <div className="relative py-20 px-6 overflow-hidden">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />

      <div className="mx-auto max-w-5xl">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 mb-6 shadow-inner">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span className="text-[10px] font-semibold tracking-wider text-indigo-300 uppercase">
              Get in Touch
            </span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Contact Our Team
          </h1>
          <p className="mt-4 text-base text-slate-400">
            Have questions about organizing an event, registering a new student club, or technical support? Drop us a line.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-5 gap-10">
          
          {/* Contact Details (Left) */}
          <div className="md:col-span-2 space-y-6">
            <h3 className="text-xl font-bold text-white tracking-tight">Contact Information</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              You can reach out directly via these channels, or schedule an in-person meeting during support office hours.
            </p>

            <div className="space-y-4">
              {contactDetails.map((detail, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-slate-900/30 border border-slate-900/60 backdrop-blur-sm">
                  <div className="h-10 w-10 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800 shrink-0">
                    {detail.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{detail.title}</h4>
                    <p className="text-sm font-semibold text-white mt-0.5">{detail.value}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{detail.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form (Right) */}
          <div className="md:col-span-3">
            <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl">
              {submitted ? (
                <div className="text-center py-10 animate-in fade-in zoom-in-95 duration-300">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">Message Sent!</h3>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                    Thank you, {name}. Your inquiry has been logged successfully. We will get back to you shortly.
                  </p>
                  <button 
                    onClick={() => {
                      setSubmitted(false);
                      setName('');
                      setEmail('');
                      setSubject('');
                      setMessage('');
                    }}
                    className="mt-6 inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-900 transition text-sm font-semibold"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Johnson"
                        className="block w-full px-4 py-3 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@university.edu"
                        className="block w-full px-4 py-3 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Setting up a new coding club profile"
                      className="block w-full px-4 py-3 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Message Body
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your message details here..."
                      className="block w-full px-4 py-3 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative flex items-center justify-center w-full px-4 py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 text-sm font-semibold tracking-wide transition-all duration-200 hover:-translate-y-0.5"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending Message...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        Send Message
                        <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
