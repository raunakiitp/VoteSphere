import React from 'react';
import { Bot, Volume2, VolumeX, RefreshCw } from 'lucide-react';

interface ChatHeaderProps {
  voice: boolean;
  setVoice: (v: boolean) => void;
  onClear: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ voice, setVoice, onClear }) => (
  <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
        <Bot size={18} className="text-blue-400" />
      </div>
      <div>
        <p className="text-sm font-semibold text-white">AI Civic Guide</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400">Gemini-powered</span>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-1">
      <button 
        onClick={() => setVoice(!voice)}
        className={`btn-ghost ${voice ? 'text-blue-400' : 'text-slate-500'}`} 
        title={voice ? "Disable voice response" : "Enable voice response"}
        aria-label="Toggle voice response">
        {voice ? <Volume2 size={15} /> : <VolumeX size={15} />}
      </button>
      <button 
        onClick={onClear} 
        className="btn-ghost text-slate-500" 
        title="Clear chat history"
        aria-label="Clear chat history">
        <RefreshCw size={14} />
      </button>
    </div>
  </div>
);
