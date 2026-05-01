'use client';

import { Trophy, Lock, CheckCircle } from 'lucide-react';
import { useVoteSphereStore } from '@/lib/store';

const ALL_BADGES = [
  { id: 'first_login',     name: 'Civic Pioneer',       desc: 'Joined VoteSphere' },
  { id: 'awareness_done',  name: 'Informed Voter',      desc: 'Completed Awareness' },
  { id: 'eligible',        name: 'Eligibility Verified',desc: 'Confirmed eligibility' },
  { id: 'docs_checked',    name: 'Document Ready',      desc: 'Validated documents' },
  { id: 'map_explored',    name: 'Booth Explorer',      desc: 'Found polling station' },
  { id: 'voted',           name: 'Democracy Hero',      desc: 'Cast your vote' },
];

export default function BadgeSystem() {
  const { badges } = useVoteSphereStore();
  const unlocked = badges.map(b => b.id);
  const count = unlocked.length;

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="section-tag">Achievements</p>
          <p className="text-sm font-semibold text-white">Your Badges</p>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
          <Trophy size={12} className="text-amber-400" />
          <span className="text-xs font-bold text-amber-400">{count}/{ALL_BADGES.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {ALL_BADGES.map(b => {
          const earned = unlocked.includes(b.id);
          return (
            <div key={b.id} title={b.desc}
              className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-center transition-all ${
                earned
                  ? 'border-amber-500/25 bg-amber-500/5'
                  : 'border-white/[0.06] bg-white/[0.02] opacity-40'
              }`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                earned ? 'bg-amber-500/15 border border-amber-500/25' : 'bg-white/[0.04] border border-white/[0.06]'
              }`}>
                {earned
                  ? <CheckCircle size={16} className="text-amber-400" />
                  : <Lock size={13} className="text-slate-700" />}
              </div>
              <p className={`text-[10px] font-semibold leading-tight ${earned ? 'text-white' : 'text-slate-700'}`}>
                {b.name}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-white/[0.06]">
        <div className="flex gap-1.5">
          <div className="h-1 flex-1 bg-white/[0.06] rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full transition-all duration-700"
              style={{ width: `${(count / ALL_BADGES.length) * 100}%` }} />
          </div>
        </div>
        <p className="text-[10px] text-slate-600 mt-1.5 text-center">Complete the journey to unlock all badges</p>
      </div>
    </div>
  );
}
