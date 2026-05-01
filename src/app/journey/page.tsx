'use client';

import { useVoteSphereStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import JourneyTracker from '@/components/JourneyTracker';
import BadgeSystem from '@/components/BadgeSystem';
import { 
  ArrowRight, CheckCircle, Info, ExternalLink, 
  UserPlus, FileCheck, MapPin, Vote, Award 
} from 'lucide-react';
import Link from 'next/link';

interface Stage {
  icon: any;
  title: string;
  desc: string;
  steps: string[];
  next: string | null;
  link?: string;
  btn?: string;
}

const STAGE_CONTENT: Record<string, Stage> = {
  awareness: {
    icon: Info,
    title: 'Awareness & Education',
    desc: 'Understand the importance of your vote and how the democratic process works in India.',
    steps: [
      'Learn about the Election Commission of India (ECI)',
      'Understand your rights and duties as a citizen',
      'Watch educational videos on electoral processes'
    ],
    next: 'eligibility'
  },
  eligibility: {
    icon: UserPlus,
    title: 'Check Eligibility',
    desc: 'Verify if you meet the criteria to be a registered voter in India.',
    steps: [
      'Check age requirement (18+)',
      'Confirm Indian citizenship',
      'Assess your eligibility status using our Smart Engine'
    ],
    link: '/eligibility',
    btn: 'Check Eligibility Now',
    next: 'preparation'
  },
  preparation: {
    icon: FileCheck,
    title: 'Preparation & Documents',
    desc: 'Get your documents ready for registration or for carrying to the polling station.',
    steps: [
      'Identify valid identity and residence proofs',
      'Use the Document Validator to check your IDs',
      'Locate your nearest Voter Registration Center if needed'
    ],
    link: '/documents',
    btn: 'Validate Documents',
    next: 'participation'
  },
  participation: {
    icon: MapPin,
    title: 'Participation & Voting',
    desc: 'Find your polling station and cast your vote on election day.',
    steps: [
      'Locate your polling booth using the map',
      'Check live crowd levels and best voting times',
      'Carry your EPIC card or approved alternative ID'
    ],
    link: '/map',
    btn: 'Find Polling Booth',
    next: 'followup'
  },
  followup: {
    icon: Award,
    title: 'Follow-up & Results',
    desc: 'Stay informed about result dates and the post-election process.',
    steps: [
      'Track election results in real-time',
      'Verify that your vote was counted',
      'Share your voting experience to inspire others'
    ],
    next: null
  }
};

export default function JourneyPage() {
  const { currentStage, completeStage, language } = useVoteSphereStore();
  const stage = STAGE_CONTENT[currentStage] || STAGE_CONTENT.awareness;
  const Icon = stage.icon;

  return (
    <div className="min-h-screen bg-[#04080f]">
      <Navbar />
      
      <div className="pt-24 max-w-7xl mx-auto px-4 pb-24 space-y-8">
        <div className="max-w-4xl mx-auto">
          <JourneyTracker />
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Stage Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-8 relative overflow-hidden">
              {/* Background Decoration */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 blur-[100px] pointer-events-none" />
              
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mb-6">
                  <Icon className="text-blue-400" size={28} />
                </div>
                
                <h1 className="text-3xl font-bold text-white mb-3">{stage.title}</h1>
                <p className="text-slate-400 mb-8 leading-relaxed">{stage.desc}</p>
                
                <div className="space-y-4 mb-10">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Key Missions</p>
                  {stage.steps.map((s, i) => (
                    <div key={i} className="flex items-start gap-3 group">
                      <div className="mt-1 w-5 h-5 rounded-full border border-blue-500/30 flex items-center justify-center group-hover:border-blue-400 transition-colors">
                        <CheckCircle size={12} className="text-blue-500 group-hover:text-blue-400" />
                      </div>
                      <span className="text-sm text-slate-300">{s}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/[0.06]">
                  {stage.link ? (
                    <Link href={stage.link} className="btn-primary">
                      {stage.btn} <ExternalLink size={14} />
                    </Link>
                  ) : (
                    <button 
                      onClick={() => completeStage(currentStage)}
                      className="btn-primary"
                    >
                      Mark Stage as Complete <CheckCircle size={14} />
                    </button>
                  )}
                  
                  {stage.next && (
                    <button 
                      onClick={() => {
                        completeStage(currentStage);
                        // Store logic will handle move to next if needed
                      }}
                      className="btn-secondary"
                    >
                      Next Phase <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* AI Context Card */}
            <div className="card p-6 bg-blue-600/5 border-blue-500/10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Vote className="text-blue-400" size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white mb-1">AI Guide Recommendation</p>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Based on your progress in the <span className="text-blue-400 font-medium">{stage.title}</span> stage, 
                    I recommend checking the latest ECI notifications regarding voter roll revisions in your constituency.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <BadgeSystem />
            
            <div className="card p-6">
              <h3 className="text-sm font-bold text-white mb-4">Quick Resources</h3>
              <div className="space-y-3">
                {[
                  { label: 'ECI Official Portal', url: 'https://eci.gov.in' },
                  { label: 'Voter Search', url: 'https://electoralsearch.in' },
                  { label: 'Download Forms', url: 'https://voterportal.eci.gov.in' },
                ].map(r => (
                  <a 
                    key={r.label} 
                    href={r.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs text-slate-400 hover:text-white hover:border-white/10 transition-all"
                  >
                    {r.label}
                    <ExternalLink size={12} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

