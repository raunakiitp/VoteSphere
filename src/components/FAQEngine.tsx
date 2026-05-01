'use client';

import { useState } from 'react';
import { 
  Search, HelpCircle, ChevronDown, 
  ChevronUp, Sparkles, Filter, Info 
} from 'lucide-react';

const FAQS = [
  {
    q: 'How do I check if my name is on the electoral roll?',
    a: 'You can check your name on the electoral roll by visiting the official ECI Electoral Search portal at electoralsearch.in or by using the Voter Helpline App. You can search by your EPIC number or by entering your personal details.',
    cat: 'Registration'
  },
  {
    q: 'What is an EPIC card?',
    a: 'EPIC stands for Electors Photo Identity Card. It is the official identity card issued by the Election Commission of India to all eligible voters to establish their identity and prevent impersonation during voting.',
    cat: 'Documents'
  },
  {
    q: 'Can I vote if I do not have my Voter ID card?',
    a: 'Yes, if your name is on the electoral roll, you can vote by showing any of the 12 alternative photo identity documents approved by the ECI, such as Aadhaar Card, PAN Card, Passport, or Driving License.',
    cat: 'Voting'
  },
  {
    q: 'What is NOTA?',
    a: 'NOTA (None of the Above) is an option on the Electronic Voting Machine (EVM) that allows voters to officially register a vote of rejection for all candidates who are contesting the election in their constituency.',
    cat: 'Voting'
  },
  {
    q: 'How can I register as a new voter?',
    a: 'You can register as a new voter by filling out Form 6. This can be done online through the Voter Portal (voterportal.eci.gov.in), the Voter Helpline App, or offline by submitting the form to your Booth Level Officer (BLO).',
    cat: 'Registration'
  }
];

export default function FAQEngine() {
  const [query, setQuery] = useState('');
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [activeCat, setActiveCat] = useState('All');

  const filtered = FAQS.filter(f => 
    (activeCat === 'All' || f.cat === activeCat) &&
    (f.q.toLowerCase().includes(query.toLowerCase()) || f.a.toLowerCase().includes(query.toLowerCase()))
  );

  const cats = ['All', ...Array.from(new Set(FAQS.map(f => f.cat)))];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Knowledge Base</h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Search our comprehensive database of election-related questions, 
          enhanced with AI-driven insights for clarity.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input
            type="text"
            placeholder="Search FAQs (e.g., 'registration', 'documents')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input pl-12 py-4 text-base"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
             <div className="pill bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px]">
                AI Enhanced
             </div>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scroll-thin pb-2">
          <div className="flex-shrink-0 p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] mr-2">
            <Filter size={14} className="text-slate-500" />
          </div>
          {cats.map(c => (
            <button
              key={c}
              onClick={() => setActiveCat(c)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeCat === c
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-white/[0.02] border border-white/[0.06] text-slate-400 hover:text-slate-200 hover:border-white/20'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ List */}
      <div className="space-y-3">
        {filtered.length > 0 ? filtered.map((f, i) => (
          <div key={i} className="card overflow-hidden transition-all duration-300">
            <button
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.01] transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="mt-0.5 p-1.5 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400">
                  <HelpCircle size={16} />
                </div>
                <span className="text-sm font-semibold text-white pr-8">{f.q}</span>
              </div>
              {openIdx === i ? <ChevronUp size={18} className="text-slate-500" /> : <ChevronDown size={18} className="text-slate-500" />}
            </button>
            
            {openIdx === i && (
              <div className="px-5 pb-6 pl-[52px] animate-fade-in">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                  <p className="text-sm text-slate-400 leading-relaxed">{f.a}</p>
                  <div className="mt-4 pt-4 border-t border-white/[0.04] flex items-center justify-between">
                    <span className="text-[10px] text-slate-600 italic">Source: Election Commission of India</span>
                    <button className="text-[10px] font-bold text-blue-400 flex items-center gap-1 hover:text-blue-300">
                       <Sparkles size={10} /> Get Detailed AI Explanation
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )) : (
          <div className="text-center py-20 card bg-white/[0.01]">
            <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
               <Info size={24} className="text-slate-600" />
            </div>
            <p className="text-slate-500">No matching questions found.</p>
            <button onClick={() => { setQuery(''); setActiveCat('All'); }} className="text-blue-400 text-sm mt-2 hover:underline">
               Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-6 rounded-2xl bg-blue-600/5 border border-blue-500/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Sparkles size={20} className="text-blue-400" />
           </div>
           <div>
              <p className="text-sm font-bold text-white">Still have questions?</p>
              <p className="text-xs text-slate-400">Our AI assistant can provide personalized answers.</p>
           </div>
        </div>
        <button className="btn-primary">
           Chat with AI Assistant
        </button>
      </div>
    </div>
  );
}
