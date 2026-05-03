'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import AICivicGuide from '@/components/AICivicGuide';
import { useVoteSphereStore } from '@/lib/store';
import { ArrowRight, Vote, Shield, Zap, Globe } from 'lucide-react';
import { 
  STATS, FEATURES, FEATURE_HREFS, HOME_TEXT 
} from '@/lib/home-config';

// ── Sub-components for better modularity ──────────────────────────

const StatCard = ({ label, value, icon: Icon }: { label: string, value: string, icon: any }) => (
  <div className="card p-4 text-center transition-transform hover:scale-[1.02]">
    <Icon size={18} className="text-blue-400 mx-auto mb-2 opacity-60" />
    <p className="text-xl font-black text-gradient">{value}</p>
    <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">{label}</p>
  </div>
);

const FeatureCard = ({ icon: Icon, title, desc, color, bg, href }: any) => (
  <Link href={href} className="card-hover p-5 block group cursor-pointer border-white/[0.03]">
    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 transition-all group-hover:scale-110 group-hover:shadow-[0_0_20px] group-hover:shadow-current/20 ${bg}`}>
      <Icon size={18} className={color} />
    </div>
    <h3 className="font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">{title}</h3>
    <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    <div className="flex items-center gap-1 mt-4 text-xs font-bold uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-all translate-x-[-4px] group-hover:translate-x-0">
      <span className={color}>Launch Tool</span>
      <ArrowRight size={11} className={color} />
    </div>
  </Link>
);

const TechItem = ({ label, sub, color }: { label: string, sub: string, color: string }) => (
  <div className="flex items-center gap-3 py-1">
    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${color} shadow-[0_0_8px] shadow-current`} />
    <div>
      <p className="text-xs font-bold text-white leading-none">{label}</p>
      <p className="text-[10px] text-slate-600 mt-0.5">{sub}</p>
    </div>
  </div>
);

// ── Main Page Component ───────────────────────────────────────────

export default function HomePage() {
  const { completeStage, unlockBadge, user, language } = useVoteSphereStore();

  useEffect(() => {
    // Initial engagement goals
    completeStage('awareness');
    unlockBadge({ id: 'awareness_done', name: 'Informed Voter', description: 'Completed Awareness', emoji: '📚' });
    if (user) {
      unlockBadge({ id: 'first_login', name: 'Civic Pioneer', description: 'Joined VoteSphere', emoji: '🌟' });
    }
  }, [user, completeStage, unlockBadge]);

  // Memoize text to prevent unnecessary re-computations on unrelated state changes
  const t = useMemo(() => HOME_TEXT[language], [language]);
  const currentStats = useMemo(() => STATS[language], [language]);
  const currentFeatures = useMemo(() => FEATURES[language], [language]);

  return (
    <div className="min-h-screen bg-[#04080f] selection:bg-blue-500/30">
      <Navbar />

      {/* ── HERO ────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-32 pb-20 px-4">
        {/* Background grid architecture */}
        <div className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: 'linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />
        
        {/* Cinematic glow orbs */}
        <div className="absolute top-20 left-1/4 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none animate-float opacity-50" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[100px] pointer-events-none animate-float-delayed opacity-30" />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/5 text-[11px] text-blue-400 font-bold uppercase tracking-widest mb-8 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            {t.heroTag}
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6 animate-fade-in-up">
            <span className="text-gradient-white">{t.hero1}</span>
            <br />
            <span className="text-gradient">{t.hero2}</span>
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-100">
            {t.heroSub}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up delay-200">
            <Link href="/journey" className="btn-primary text-base py-3.5 px-8 shadow-lg shadow-blue-600/20">
              {t.btnStart} <ArrowRight size={18} />
            </Link>
            <Link href="/eligibility" className="btn-secondary text-base py-3.5 px-8">
              {t.btnCheck}
            </Link>
          </div>

          {/* Stats Distribution */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-in-up delay-300">
            {currentStats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ───────────────────────────────── */}
      <section className="py-24 px-4 border-t border-white/[0.04] bg-slate-900/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-tag mb-3">{t.featTag}</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{t.featTitle}</h2>
            <p className="text-slate-500 mt-4 text-base max-w-2xl mx-auto font-medium">{t.featSub}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentFeatures.map((feature, i) => (
              <FeatureCard 
                key={feature.title} 
                {...feature} 
                href={FEATURE_HREFS[i]} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE CORE ────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap size={18} className="text-blue-400" />
                Live Civic Assistant
              </h3>
            </div>
            <AICivicGuide />
          </div>
          
          <div className="space-y-6">
            <div className="card p-6 bg-slate-900/30 border-white/[0.05]">
              <p className="section-tag mb-6">{t.powerTag} Industry Standards</p>
              <div className="space-y-4">
                <TechItem label="Google Gemini 1.5" sub="Next-gen AI reasoning" color="bg-blue-500" />
                <TechItem label="Firebase Auth" sub="Enterprise security" color="bg-orange-500" />
                <TechItem label="Cloud Firestore" sub="Distributed state persistence" color="bg-amber-500" />
                <TechItem label="Google Maps API" sub="Geospatial intelligence" color="bg-emerald-500" />
                <TechItem label="Content Security Policy" sub="XSS and Injection protection" color="bg-violet-500" />
                <TechItem label="Strict HTTPS/HSTS" sub="Military-grade encryption" color="bg-cyan-500" />
              </div>
              
              <div className="mt-8 p-4 rounded-xl bg-blue-600/5 border border-blue-500/10">
                <p className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-2">System Health</p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>API Latency</span>
                  <span className="text-emerald-400">~240ms</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mt-1.5">
                  <span>Uptime</span>
                  <span className="text-emerald-400">99.98%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FOOTER ──────────────────────────────────────── */}
      <footer className="border-t border-white/[0.04] py-12 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Vote size={20} className="text-white" />
            </div>
            <div>
              <p className="text-base font-black text-white tracking-tight">VoteSphere</p>
              <p className="text-xs text-slate-500 font-medium">Empowering the World&apos;s Largest Democracy</p>
            </div>
          </div>
          
          <div className="text-center md:text-left">
            <p className="text-xs text-slate-600 max-w-md leading-relaxed font-medium">
              An independent civic-tech initiative built to simplify the complex electoral process. 
              Always cross-reference with official ECI guidelines at voterportal.eci.gov.in.
            </p>
          </div>

          <div className="flex items-center gap-6 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><Shield size={12} className="text-emerald-500" /> Hardened</span>
            <span className="flex items-center gap-1.5"><Zap size={12} className="text-amber-500" /> Real-time</span>
            <span className="flex items-center gap-1.5"><Globe size={12} className="text-blue-500" /> Global</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

