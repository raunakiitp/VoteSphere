import React from 'react';
import { Users, Clock, MapPin, ExternalLink } from 'lucide-react';
import { Station } from '@/types';

const CROWD = ['Low', 'Moderate', 'High', 'Very High'] as const;
const CROWD_COLOR = ['text-emerald-400', 'text-amber-400', 'text-orange-400', 'text-red-400'];
const BEST_TIME = ['7:00 – 8:30 AM', '2:00 – 3:30 PM', '5:00 – 6:00 PM', '7:00 – 8:00 AM'];

interface StationDetailsProps {
  station: Station;
}

export const StationDetails: React.FC<StationDetailsProps> = ({ station }) => (
  <div className="p-4 border-t border-white/[0.06] space-y-3 bg-[#080d17] animate-slide-up">
    <div className="grid grid-cols-3 gap-2">
      <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-2 text-center">
        <Users size={13} className={`mx-auto mb-1 ${CROWD_COLOR[station.crowd]}`} />
        <p className="text-[9px] text-slate-500 uppercase tracking-wider">Crowd</p>
        <p className={`text-[11px] font-semibold mt-0.5 ${CROWD_COLOR[station.crowd]}`}>{CROWD[station.crowd]}</p>
      </div>
      <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-2 text-center">
        <Clock size={13} className="mx-auto mb-1 text-blue-400" />
        <p className="text-[9px] text-slate-500 uppercase tracking-wider">Best time</p>
        <p className="text-[11px] font-semibold mt-0.5 text-blue-400">{BEST_TIME[station.crowd]}</p>
      </div>
      <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-2 text-center">
        <MapPin size={13} className="mx-auto mb-1 text-slate-400" />
        <p className="text-[9px] text-slate-500 uppercase tracking-wider">Booth</p>
        <p className="text-[11px] font-bold mt-0.5 text-white">{station.booth}</p>
      </div>
    </div>
    <a
      href={`https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`}
      target="_blank" rel="noopener noreferrer"
      className="btn-primary w-full text-[13px] py-2.5 justify-center mt-1 font-medium group">
      <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /> 
      Navigate to Polling Station
    </a>
  </div>
);
