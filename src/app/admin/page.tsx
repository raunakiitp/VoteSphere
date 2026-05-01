'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useVoteSphereStore } from '@/lib/store';
import {
  LayoutDashboard, Users, Activity, MessageSquare, Bell,
  ArrowLeft, Vote, TrendingUp, Eye, CheckCircle,
  FileText, MapPin, Trash2, Plus, AlertCircle, Info,
  ChevronRight, Loader2, BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';

const STATS = [
  { label: 'Total Users',        value: '12,847', change: '+127 today', icon: Users,        color: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-500/20' },
  { label: 'Active Today',       value: '1,243',  change: '+8.2%',      icon: Eye,          color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  { label: 'AI Questions Asked', value: '38,291', change: '+2,103',     icon: MessageSquare,color: 'text-violet-400',  bg: 'bg-violet-500/10 border-violet-500/20' },
  { label: 'Eligibility Checks', value: '9,412',  change: '+341',       icon: CheckCircle,  color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20' },
  { label: 'Doc Validations',    value: '6,831',  change: '+201',       icon: FileText,     color: 'text-cyan-400',    bg: 'bg-cyan-500/10 border-cyan-500/20' },
  { label: 'Map Views',          value: '14,203', change: '+892',       icon: MapPin,       color: 'text-rose-400',    bg: 'bg-rose-500/10 border-rose-500/20' },
];

const FUNNEL = [
  { stage: 'Awareness',     users: 12847, pct: 100 },
  { stage: 'Eligibility',   users: 9412,  pct: 73  },
  { stage: 'Preparation',   users: 6831,  pct: 53  },
  { stage: 'Participation', users: 4203,  pct: 33  },
  { stage: 'Follow-up',     users: 2841,  pct: 22  },
];

const TOP_QUERIES = [
  { q: 'How to register to vote?',         n: 3421 },
  { q: 'What documents are needed?',        n: 2891 },
  { q: 'How to find polling station?',      n: 2234 },
  { q: 'When is election day?',             n: 1987 },
  { q: 'What is NOTA?',                     n: 1654 },
  { q: 'Can I vote without Voter ID?',      n: 1203 },
];

const ACTIVITY = [
  { msg: 'New user registered from Maharashtra', time: '2 min ago' },
  { msg: 'Eligibility check completed',           time: '5 min ago' },
  { msg: 'AI chat session started — 14 messages', time: '8 min ago' },
  { msg: 'Document validation — 3 docs verified', time: '12 min ago' },
  { msg: 'Map viewed — polling station searched', time: '18 min ago' },
  { msg: 'Language switched to Hindi',            time: '24 min ago' },
];

const HEATMAP = Array.from({ length: 7 }, (_, di) =>
  Array.from({ length: 24 }, (_, hi) => {
    const base = hi >= 9 && hi <= 18 ? 60 : 20;
    return Math.min(100, base + ((di * 7 + hi * 3) % 40));
  })
);
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

interface Announcement {
  id: number; title: string; body: string; type: 'info' | 'warning' | 'success'; date: string;
}
const INIT_ANNS: Announcement[] = [
  { id: 1, title: 'Voter Registration Drive', body: 'Special camps organised from May 5–10 across 50 cities.', type: 'info', date: '2026-05-01' },
  { id: 2, title: 'Document Submission Deadline', body: 'Last date to update voter details is May 10, 2026.', type: 'warning', date: '2026-05-01' },
];

const TAB_ICON: Record<string, React.ReactNode> = {
  overview:    <LayoutDashboard size={15} />,
  funnel:      <TrendingUp size={15} />,
  heatmap:     <Activity size={15} />,
  queries:     <BarChart3 size={15} />,
  announcements: <Bell size={15} />,
};

export default function AdminPage() {
  const { user } = useVoteSphereStore();
  const [tab, setTab] = useState('overview');
  const [anns, setAnns] = useState<Announcement[]>(INIT_ANNS);
  const [form, setForm] = useState({ title: '', body: '', type: 'info' as const });
  const [showForm, setShowForm] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#04080f] flex items-center justify-center px-4">
        <div className="card p-8 text-center max-w-sm w-full">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={22} className="text-amber-400" />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">Authentication Required</h2>
          <p className="text-sm text-slate-400 mb-5">Sign in with your admin Google account to access the command center.</p>
          <Link href="/" className="btn-primary justify-center w-full">
            <ArrowLeft size={15} /> Back to VoteSphere
          </Link>
        </div>
      </div>
    );
  }

  const addAnn = () => {
    if (!form.title || !form.body) { toast.error('Fill in title and message.'); return; }
    setAnns(prev => [...prev, { ...form, id: Date.now(), date: new Date().toISOString().slice(0, 10) }]);
    setForm({ title: '', body: '', type: 'info' });
    setShowForm(false);
    toast.success('Announcement pushed!');
  };

  const tabs = ['overview', 'funnel', 'heatmap', 'queries', 'announcements'];

  return (
    <div className="min-h-screen bg-[#04080f]">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#04080f]/95 backdrop-blur-xl px-6 py-3 flex items-center gap-4">
        <Link href="/" className="btn-ghost text-slate-400 p-2 rounded-lg border border-white/[0.06]">
          <ArrowLeft size={16} />
        </Link>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center">
            <Vote size={15} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Admin Command Center</p>
            <p className="text-[10px] text-amber-400">VoteSphere Control Panel</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {user.photoURL && <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full" />}
          <p className="text-sm text-white font-medium">{user.name}</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto scroll-thin pb-1">
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={tab === t ? 'nav-item-active' : 'nav-item'}>
              {TAB_ICON[t]}
              <span className="capitalize">{t}</span>
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div className="space-y-5 animate-fade-in">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {STATS.map(({ label, value, change, icon: Icon, color, bg }) => (
                <div key={label} className="card p-4">
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center mb-3 ${bg}`}>
                    <Icon size={15} className={color} />
                  </div>
                  <p className="text-xl font-black text-white">{value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{label}</p>
                  <p className="text-[10px] text-emerald-400 mt-1">{change}</p>
                </div>
              ))}
            </div>

            {/* Activity feed */}
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Activity size={15} className="text-blue-400" />
                <p className="text-sm font-semibold text-white">Live Activity Feed</p>
                <span className="ml-auto flex items-center gap-1.5 text-[10px] text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: 'pulse-dot 2s ease-in-out infinite' }} />
                  Live
                </span>
              </div>
              <div className="space-y-2">
                {ACTIVITY.map((a, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                      <p className="text-sm text-slate-300">{a.msg}</p>
                    </div>
                    <p className="text-xs text-slate-600 flex-shrink-0 ml-3">{a.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── FUNNEL ── */}
        {tab === 'funnel' && (
          <div className="card p-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp size={15} className="text-blue-400" />
              <p className="text-sm font-semibold text-white">User Drop-off Funnel</p>
            </div>
            <div className="space-y-4">
              {FUNNEL.map((f, i) => (
                <div key={f.stage}>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-medium text-white">{f.stage}</span>
                    <span className="text-slate-400">{f.users.toLocaleString()} users — <span className="text-white font-semibold">{f.pct}%</span></span>
                  </div>
                  <div className="h-8 bg-white/[0.04] rounded-lg overflow-hidden relative">
                    <div
                      className="h-full rounded-lg flex items-center justify-end pr-3 transition-all duration-700"
                      style={{
                        width: `${f.pct}%`,
                        background: `linear-gradient(90deg, hsl(${220 - i * 18}, 80%, 45%), hsl(${230 - i * 18}, 70%, 55%))`,
                      }}>
                      {f.pct > 20 && <span className="text-xs text-white font-semibold">{f.pct}%</span>}
                    </div>
                  </div>
                  {i < FUNNEL.length - 1 && (
                    <p className="text-[10px] text-slate-600 text-right mt-1">
                      {(FUNNEL[i].users - FUNNEL[i+1].users).toLocaleString()} users dropped off at this stage
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── HEATMAP ── */}
        {tab === 'heatmap' && (
          <div className="card p-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <Activity size={15} className="text-blue-400" />
              <p className="text-sm font-semibold text-white">Engagement Heatmap</p>
            </div>
            <p className="text-xs text-slate-500 mb-5">User activity by day of week and hour (darker = more active)</p>
            <div className="overflow-x-auto scroll-thin">
              <div className="flex gap-2 min-w-max">
                {/* Day labels */}
                <div className="flex flex-col pt-7 pr-2 gap-0.5">
                  {DAYS.map(d => <p key={d} className="text-[10px] text-slate-500 h-5 flex items-center">{d}</p>)}
                </div>
                <div>
                  {/* Hour labels */}
                  <div className="flex gap-0.5 mb-0.5">
                    {Array.from({ length: 24 }, (_, i) => (
                      <p key={i} className="w-5 text-[9px] text-slate-600 text-center">
                        {i % 6 === 0 ? `${i}h` : ''}
                      </p>
                    ))}
                  </div>
                  {/* Grid */}
                  {HEATMAP.map((row, di) => (
                    <div key={di} className="flex gap-0.5 mb-0.5">
                      {row.map((v, hi) => (
                        <div key={hi}
                          title={`${DAYS[di]} ${hi}:00 — ${v}% activity`}
                          className="w-5 h-5 rounded-sm transition-all hover:scale-125 hover:z-10 relative"
                          style={{ background: `rgba(59,130,246,${v / 100})` }} />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <p className="text-xs text-slate-500">Low</p>
              {[0.1, 0.3, 0.5, 0.7, 0.9].map(o => (
                <div key={o} className="w-5 h-3 rounded-sm" style={{ background: `rgba(59,130,246,${o})` }} />
              ))}
              <p className="text-xs text-slate-500">High</p>
            </div>
          </div>
        )}

        {/* ── TOP QUERIES ── */}
        {tab === 'queries' && (
          <div className="card p-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 size={15} className="text-blue-400" />
              <p className="text-sm font-semibold text-white">Most Asked AI Queries</p>
            </div>
            <div className="space-y-3">
              {TOP_QUERIES.map((q, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-400 flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">{q.q}</p>
                    <div className="mt-1.5 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${(q.n / TOP_QUERIES[0].n) * 100}%` }} />
                    </div>
                  </div>
                  <p className="text-sm font-bold text-blue-400 flex-shrink-0 tabular-nums">
                    {q.n.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ANNOUNCEMENTS ── */}
        {tab === 'announcements' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Push Announcements</p>
              <button onClick={() => setShowForm(!showForm)} className="btn-primary text-xs py-2">
                <Plus size={13} /> New Announcement
              </button>
            </div>

            {showForm && (
              <div className="card p-5 border-amber-500/20 animate-fade-in-up">
                <p className="text-sm font-semibold text-amber-400 mb-4">Create Announcement</p>
                <div className="space-y-3">
                  <div>
                    <label className="label">Title</label>
                    <input type="text" placeholder="Announcement title..." value={form.title}
                      onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="input" />
                  </div>
                  <div>
                    <label className="label">Message</label>
                    <textarea placeholder="Announcement message..." value={form.body} rows={3}
                      onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                      className="input resize-none" />
                  </div>
                  <div>
                    <label className="label">Type</label>
                    <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as any }))} className="select">
                      <option value="info">Info</option>
                      <option value="warning">Warning</option>
                      <option value="success">Success</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={addAnn} className="btn-primary flex-1 justify-center">
                      <Bell size={13} /> Push Announcement
                    </button>
                    <button onClick={() => setShowForm(false)} className="btn-secondary px-4">Cancel</button>
                  </div>
                </div>
              </div>
            )}

            {anns.map(a => {
              const cfg = {
                info:    { icon: <Info size={14} className="text-blue-400" />,    border: 'border-blue-500/20',    tag: 'text-blue-400',    bg: 'bg-blue-500/5' },
                warning: { icon: <AlertCircle size={14} className="text-amber-400" />, border: 'border-amber-500/20', tag: 'text-amber-400', bg: 'bg-amber-500/5' },
                success: { icon: <CheckCircle size={14} className="text-emerald-400" />, border: 'border-emerald-500/20', tag: 'text-emerald-400', bg: 'bg-emerald-500/5' },
              }[a.type];
              return (
                <div key={a.id} className={`card p-4 border ${cfg.border} ${cfg.bg}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="mt-0.5 flex-shrink-0">{cfg.icon}</div>
                      <div>
                        <p className={`text-sm font-semibold ${cfg.tag}`}>{a.title}</p>
                        <p className="text-sm text-slate-400 mt-1">{a.body}</p>
                        <p className="text-xs text-slate-600 mt-2">{a.date}</p>
                      </div>
                    </div>
                    <button onClick={() => { setAnns(p => p.filter(x => x.id !== a.id)); toast.success('Removed'); }}
                      className="text-slate-700 hover:text-red-400 transition-colors flex-shrink-0">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
