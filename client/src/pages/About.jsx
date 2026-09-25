import React from 'react';
import { Users, Award, BookOpen, ShieldCheck, Heart, Sparkles } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: <Users className="h-6 w-6 text-indigo-400" />,
      title: 'Vibrant Community',
      description: 'Strengthening campus bonds by encouraging real-world interaction, club engagement, and social activities.'
    },
    {
      icon: <BookOpen className="h-6 w-6 text-purple-400" />,
      title: 'Skill Development',
      description: 'Enabling learning outside the classroom through student-led hackathons, design sprints, and academic workshops.'
    },
    {
      icon: <Award className="h-6 w-6 text-pink-400" />,
      title: 'Leadership & Growth',
      description: 'Providing a platform for club executives to plan, promote, and manage events, gaining crucial leadership experience.'
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
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center space-x-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 mb-6 shadow-inner">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span className="text-[10px] font-semibold tracking-wider text-indigo-300 uppercase">
              Our Identity & Mission
            </span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            About CampusConnect
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            We build tools to bring university students closer to their campus ecosystems. Discover amazing activities, coordinate with clubs, and make the most of your college experience.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">Bridging the Event Management Gap</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Traditionally, campus events have been advertised through fragmented channels—bulletin boards, social media groups, and word-of-mouth. CampusConnect resolves this by consolidating everything into a centralized calendar.
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              Whether you are looking to code at a midnight hackathon, sing at the acoustic music fest, compete in inter-department sports, or attend professional startup seminars, we ensure you never miss out on campus opportunities.
            </p>
          </div>
          <div className="bg-gradient-to-tr from-indigo-950/40 to-purple-950/40 border border-slate-900 p-8 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <ShieldCheck className="w-40 h-40 text-indigo-500" />
            </div>
            <h3 className="text-lg font-bold text-white mb-4">Core Ecosystem Values</h3>
            <ul className="space-y-3.5 text-xs text-slate-400">
              <li className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                <span>Consolidated event registry for all student organizations.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                <span>Responsive filters and categories (Technical, Cultural, Sports, Business).</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                <span>Real-time connectivity to express server API systems.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                <span>A fully immersive, dark-optimized user experience.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Values Grid */}
        <div>
          <h3 className="text-xl font-bold text-white text-center mb-10 tracking-tight">Why CampusConnect Matters</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((val, idx) => (
              <div 
                key={idx} 
                className="bg-slate-900/30 border border-slate-900 hover:border-slate-800/80 backdrop-blur-sm p-6 rounded-2xl transition duration-300"
              >
                <div className="h-10 w-10 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800 mb-4 shadow-sm">
                  {val.icon}
                </div>
                <h4 className="text-base font-bold text-white mb-2">{val.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{val.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
