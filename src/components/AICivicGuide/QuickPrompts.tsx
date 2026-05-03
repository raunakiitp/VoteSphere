import React from 'react';
import { Language } from '@/types';

const QUICK = {
  en: ['How to register to vote?', 'What documents do I need?', 'Where is my polling station?', 'What is NOTA?'],
  hi: ['मतदाता पंजीकरण कैसे करें?', 'कौन से दस्तावेज़ चाहिए?', 'मतदान केंद्र कैसे खोजें?', 'NOTA क्या है?'],
};

interface QuickPromptsProps {
  language: Language;
  onSelect: (prompt: string) => void;
}

export const QuickPrompts: React.FC<QuickPromptsProps> = ({ language, onSelect }) => (
  <div className="flex gap-2 px-4 py-2.5 border-b border-white/[0.06] overflow-x-auto scroll-thin flex-shrink-0">
    {QUICK[language].map(p => (
      <button key={p} onClick={() => onSelect(p)}
        className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full border border-white/[0.08] text-slate-400 hover:text-white hover:border-blue-500/40 hover:bg-blue-500/5 transition-all whitespace-nowrap">
        {p}
      </button>
    ))}
  </div>
);
