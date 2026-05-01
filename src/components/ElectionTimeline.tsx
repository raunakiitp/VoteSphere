'use client';

import { 
  Calendar, Clock, CheckCircle2, 
  Circle, AlertCircle, ArrowRight 
} from 'lucide-react';

const EVENTS = [
  { 
    date: 'March 15, 2024', 
    title: 'Election Notification', 
    desc: 'Official announcement of election dates by ECI.',
    status: 'completed'
  },
  { 
    date: 'April 04, 2024', 
    title: 'Nomination Deadline', 
    desc: 'Last date for candidates to file their nominations.',
    status: 'completed'
  },
  { 
    date: 'April 19, 2024', 
    title: 'Phase 1 Polling', 
    desc: 'Voting begins across multiple constituencies.',
    status: 'active'
  },
  { 
    date: 'May 07, 2024', 
    title: 'Phase 3 Polling', 
    desc: 'Major states go to polls in this critical phase.',
    status: 'upcoming'
  },
  { 
    date: 'June 01, 2024', 
    title: 'Final Phase Polling', 
    desc: 'Conclusion of the multi-phase voting process.',
    status: 'upcoming'
  },
  { 
    date: 'June 04, 2024', 
    title: 'Result Announcement', 
    desc: 'Counting of votes and declaration of winners.',
    status: 'upcoming'
  },
];

export default function ElectionTimeline() {
  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-400 font-bold uppercase tracking-widest mb-4">
          <Clock size={12} /> Live Schedule
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Election Timeline 2024</h1>
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
          Track important milestones, registration deadlines, and polling phases across the country.
        </p>
      </div>

      <div className="relative space-y-4">
        {/* Vertical line */}
        <div className="absolute left-[17px] top-2 bottom-2 w-px bg-white/[0.06]" />

        {EVENTS.map((ev, i) => (
          <div key={i} className="relative pl-10 group">
            {/* Dot */}
            <div className={`absolute left-0 top-1.5 w-9 h-9 rounded-full flex items-center justify-center border-4 border-[#04080f] z-10 transition-all ${
              ev.status === 'completed' 
                ? 'bg-emerald-500 text-white' 
                : ev.status === 'active'
                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] animate-pulse'
                : 'bg-slate-800 text-slate-500 border-white/[0.06]'
            }`}>
              {ev.status === 'completed' ? (
                <CheckCircle2 size={16} strokeWidth={2.5} />
              ) : ev.status === 'active' ? (
                <Calendar size={16} strokeWidth={2.5} />
              ) : (
                <Circle size={10} fill="currentColor" />
              )}
            </div>

            {/* Card */}
            <div className={`card p-5 transition-all group-hover:border-white/20 ${
              ev.status === 'active' ? 'border-blue-500/30 bg-blue-500/5' : ''
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  ev.status === 'completed' ? 'text-emerald-400' : ev.status === 'active' ? 'text-blue-400' : 'text-slate-500'
                }`}>
                  {ev.date}
                </span>
                {ev.status === 'active' && (
                  <span className="pill bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[9px] animate-pulse">
                    Live Now
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-white mb-1">{ev.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{ev.desc}</p>
              
              {ev.status === 'upcoming' && (
                <div className="mt-4 pt-4 border-t border-white/[0.04] flex items-center justify-between text-[10px]">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <AlertCircle size={12} /> Reminder set for 24h before
                  </span>
                  <button className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1">
                    Details <ArrowRight size={10} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="card p-6 bg-blue-600/5 border-blue-500/10 text-center">
        <p className="text-xs text-slate-400 mb-4">
          Deadlines may vary slightly by state. Always check your local electoral office for precise dates.
        </p>
        <button className="btn-secondary text-xs">
          Sync to My Calendar
        </button>
      </div>
    </div>
  );
}
