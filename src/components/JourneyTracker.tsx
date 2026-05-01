'use client';

import { useVoteSphereStore, type JourneyStage } from '@/lib/store';
import { CheckCircle, Circle, Lock } from 'lucide-react';

const STAGES: { id: JourneyStage; label: string; desc: string }[] = [
  { id: 'awareness',    label: 'Awareness',     desc: 'Learn about elections' },
  { id: 'eligibility',  label: 'Eligibility',   desc: 'Check your status' },
  { id: 'preparation',  label: 'Preparation',   desc: 'Get documents ready' },
  { id: 'participation',label: 'Participation', desc: 'Cast your vote' },
  { id: 'followup',     label: 'Follow-up',     desc: 'Stay informed' },
];

export default function JourneyTracker() {
  const { currentStage, progress, setCurrentStage } = useVoteSphereStore();
  const currentIdx = STAGES.findIndex(s => s.id === currentStage);
  const completedCount = Object.values(progress).filter(Boolean).length;
  const pct = Math.round((completedCount / STAGES.length) * 100);

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="section-tag">Civic Journey</p>
          <p className="text-base font-semibold text-white">Your Progress</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">{pct}<span className="text-sm text-slate-500 font-normal">%</span></p>
          <p className="text-xs text-slate-500">{completedCount}/{STAGES.length} stages</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-white/[0.06] rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Steps */}
      <div className="flex items-start gap-2">
        {STAGES.map((s, i) => {
          const done    = progress[s.id];
          const active  = s.id === currentStage;
          const locked  = i > currentIdx + 1;

          return (
            <div key={s.id} className="flex-1 flex flex-col items-center gap-2 relative">
              {/* Connector */}
              {i > 0 && (
                <div className="absolute right-1/2 top-[18px] w-full h-px bg-white/[0.06]">
                  {(done || i <= currentIdx) && (
                    <div className="h-full bg-blue-500 transition-all duration-500" />
                  )}
                </div>
              )}

              {/* Circle */}
              <button
                onClick={() => !locked && setCurrentStage(s.id)}
                disabled={locked}
                className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                  done
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : active
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : locked
                    ? 'bg-transparent border-white/10 text-slate-700'
                    : 'bg-transparent border-white/20 text-slate-400 hover:border-blue-500/50'
                }`}
              >
                {done
                  ? <CheckCircle size={16} strokeWidth={2.5} />
                  : locked
                  ? <Lock size={12} />
                  : <Circle size={16} fill={active ? 'currentColor' : 'none'} className={active ? 'opacity-30' : ''} />}
              </button>

              {/* Label */}
              <div className="text-center">
                <p className={`text-[10px] font-semibold leading-tight ${
                  done ? 'text-emerald-400' : active ? 'text-blue-400' : 'text-slate-600'
                }`}>
                  {s.label}
                </p>
                <p className="text-[9px] text-slate-700 hidden sm:block mt-0.5">{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
