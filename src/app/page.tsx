'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import AICivicGuide from '@/components/AICivicGuide';
import { useVoteSphereStore } from '@/lib/store';
import {
  Vote, Bot, CheckSquare, MapPin, FileText,
  Clock, MessageCircle, Shield, Zap, Globe,
  ArrowRight, Users, Building2, Radio
} from 'lucide-react';

const STATS = {
  en: [
    { label: 'Registered Voters',  value: '96.8 Cr', icon: Users },
    { label: 'Constituencies',     value: '543',      icon: Building2 },
    { label: 'Polling Stations',   value: '10.5 L',   icon: Radio },
    { label: 'States & UTs',       value: '36',        icon: Globe },
  ],
  hi: [
    { label: 'पंजीकृत मतदाता',  value: '96.8 Cr', icon: Users },
    { label: 'निर्वाचन क्षेत्र',     value: '543',      icon: Building2 },
    { label: 'मतदान केंद्र',   value: '10.5 L',   icon: Radio },
    { label: 'राज्य और केंद्र शासित',       value: '36',        icon: Globe },
  ]
};

const FEATURE_HREFS = ['/journey', '/eligibility', '/map', '/documents', '/timeline', '/faq'];

const FEATURES = {
  en: [
    { icon: Bot,           title: 'AI Civic Guide',          desc: 'Gemini-powered assistant answering your election questions in real-time with bilingual support.',           color: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-500/15' },
    { icon: CheckSquare,   title: 'Smart Eligibility Engine', desc: 'Instant eligibility assessment with AI probability scoring based on Indian electoral law.',                 color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/15' },
    { icon: MapPin,        title: 'Polling Intelligence Map', desc: 'Locate nearby polling stations with crowd prediction levels and optimal voting time windows.',              color: 'text-cyan-400',    bg: 'bg-cyan-500/10 border-cyan-500/15' },
    { icon: FileText,      title: 'Document Validator',       desc: 'Verify which of 12 ECI-approved documents you need and receive instant AI validation feedback.',            color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/15' },
    { icon: Clock,         title: 'Live Election Timeline',   desc: 'Real-time countdown to Election Day with color-coded milestones and personalised deadline tracking.',       color: 'text-violet-400',  bg: 'bg-violet-500/10 border-violet-500/15' },
    { icon: MessageCircle, title: 'AI FAQ Engine',            desc: 'Semantic search across curated election FAQs, or ask Gemini AI any civic question instantly.',             color: 'text-rose-400',    bg: 'bg-rose-500/10 border-rose-500/15' },
  ],
  hi: [
    { icon: Bot,           title: 'AI नागरिक गाइड',          desc: 'रीयल-टाइम में द्विभाषी समर्थन के साथ आपके चुनाव संबंधी सवालों के जवाब देने वाला Gemini-संचालित सहायक।',           color: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-500/15' },
    { icon: CheckSquare,   title: 'स्मार्ट पात्रता इंजन',    desc: 'भारतीय चुनाव कानून के आधार पर AI प्रायिकता स्कोरिंग के साथ त्वरित पात्रता मूल्यांकन।',                 color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/15' },
    { icon: MapPin,        title: 'मतदान मानचित्र',          desc: 'भीड़ की भविष्यवाणी और मतदान के इष्टतम समय के साथ आस-पास के मतदान केंद्र खोजें।',              color: 'text-cyan-400',    bg: 'bg-cyan-500/10 border-cyan-500/15' },
    { icon: FileText,      title: 'दस्तावेज़ सत्यापन',       desc: 'सत्यापित करें कि आपको 12 ECI-अनुमोदित दस्तावेज़ों में से किसकी आवश्यकता है और त्वरित प्रतिक्रिया प्राप्त करें।', color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/15' },
    { icon: Clock,         title: 'लाइव चुनाव समयरेखा',     desc: 'रंग-कोडित मील के पत्थर और व्यक्तिगत समय सीमा ट्रैकिंग के साथ चुनाव दिवस की वास्तविक समय की उलटी गिनती।',       color: 'text-violet-400',  bg: 'bg-violet-500/10 border-violet-500/15' },
    { icon: MessageCircle, title: 'AI सामान्य प्रश्न इंजन',  desc: 'चुनाव संबंधी सामान्य प्रश्नों में खोजें, या Gemini AI से कोई भी नागरिक प्रश्न तुरंत पूछें।',             color: 'text-rose-400',    bg: 'bg-rose-500/10 border-rose-500/15' },
  ]
};

const TEXT = {
  en: {
    heroTag: 'Powered by Google Gemini · Firebase · Google Maps',
    hero1: 'Your Intelligent',
    hero2: 'Election Companion',
    heroSub: 'VoteSphere guides every Indian citizen through the electoral process — from awareness to participation — using AI, real-time data, and civic intelligence.',
    btnStart: 'Begin Your Civic Journey',
    btnCheck: 'Check Eligibility',
    featTag: 'Platform Features',
    featTitle: 'Complete Election Intelligence',
    featSub: 'Six AI-powered tools to guide every citizen through the democratic process',
    powerTag: 'Powered By'
  },
  hi: {
    heroTag: 'Google Gemini · Firebase · Google Maps द्वारा संचालित',
    hero1: 'आपका बुद्धिमान',
    hero2: 'चुनाव साथी',
    heroSub: 'VoteSphere AI, रीयल-टाइम डेटा और नागरिक बुद्धिमत्ता का उपयोग करके चुनाव प्रक्रिया - जागरूकता से भागीदारी तक - के माध्यम से हर भारतीय नागरिक का मार्गदर्शन करता है।',
    btnStart: 'अपनी नागरिक यात्रा शुरू करें',
    btnCheck: 'पात्रता जांचें',
    featTag: 'प्लेटफ़ॉर्म सुविधाएँ',
    featTitle: 'संपूर्ण चुनाव बुद्धिमत्ता',
    featSub: 'लोकतांत्रिक प्रक्रिया के माध्यम से हर नागरिक का मार्गदर्शन करने के लिए छह AI-संचालित उपकरण',
    powerTag: 'द्वारा संचालित'
  }
};

export default function HomePage() {
  const { completeStage, unlockBadge, user, language } = useVoteSphereStore();

  useEffect(() => {
    completeStage('awareness');
    unlockBadge({ id: 'awareness_done', name: 'Informed Voter', description: 'Completed Awareness', emoji: '' });
    if (user) unlockBadge({ id: 'first_login', name: 'Civic Pioneer', description: 'Joined VoteSphere', emoji: '' });
  }, [user, completeStage, unlockBadge]);

  const t = TEXT[language];

  return (
    <div className="min-h-screen bg-[#04080f]">
      <Navbar />

      {/* ── HERO ────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-32 pb-20 px-4">
        {/* Background grid */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
        {/* Glow orbs */}
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-600/5 blur-[100px] pointer-events-none animate-float" />
        <div className="absolute top-40 right-1/4 w-[400px] h-[400px] rounded-full bg-violet-600/5 blur-[80px] pointer-events-none animate-float-delayed" />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/25 bg-blue-500/5 text-xs text-blue-400 font-medium mb-6 animate-fade-in-up">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" style={{ animation: 'pulse-dot 2s ease-in-out infinite' }} />
            {t.heroTag}
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6 animate-fade-in-up"
            style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
            <span className="text-gradient-white">{t.hero1}</span>
            <br />
            <span className="text-gradient">{t.hero2}</span>
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed animate-fade-in-up"
            style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            {t.heroSub}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-14 animate-fade-in-up"
            style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            <Link href="/journey" className="btn-primary text-base py-3 px-6">
              {t.btnStart} <ArrowRight size={16} />
            </Link>
            <Link href="/eligibility" className="btn-secondary text-base py-3 px-6">
              {t.btnCheck}
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in-up"
            style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
            {STATS[language].map(({ label, value, icon: Icon }) => (
              <div key={label} className="card p-4 text-center">
                <Icon size={18} className="text-blue-400 mx-auto mb-2 opacity-60" />
                <p className="text-xl font-black text-gradient">{value}</p>
                <p className="text-xs text-slate-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ───────────────────────────────── */}
      <section className="py-16 px-4 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="section-tag mb-2">{t.featTag}</p>
            <h2 className="text-3xl font-bold text-white">{t.featTitle}</h2>
            <p className="text-slate-500 mt-2 text-sm">{t.featSub}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES[language].map(({ icon: Icon, title, desc, color, bg }, i) => (
              <Link
                key={title}
                href={FEATURE_HREFS[i]}
                className="card-hover p-5 block group cursor-pointer"
              >
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${bg}`}>
                  <Icon size={18} className={color} />
                </div>
                <h3 className="font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                <div className="flex items-center gap-1 mt-3 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className={color}>Explore</span>
                  <ArrowRight size={11} className={color} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 pb-24 space-y-6">

        {/* AI Chat (2/3) + Tech Stack (1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AICivicGuide />
          </div>
          <div className="space-y-4">

            {/* Tech stack mini card */}
            <div className="card p-4">
              <p className="section-tag mb-3">{t.powerTag}</p>
              <div className="space-y-2">
                {[
                  { label: 'Google Gemini 1.5', sub: 'AI + semantic search',    color: 'bg-blue-500' },
                  { label: 'Firebase Auth',      sub: 'Google Sign-In',          color: 'bg-orange-500' },
                  { label: 'Cloud Firestore',    sub: 'Real-time database',      color: 'bg-amber-500' },
                  { label: 'Google Maps API',    sub: 'Polling station map',     color: 'bg-emerald-500' },
                  { label: 'Cloud Messaging',    sub: 'Push notifications',      color: 'bg-violet-500' },
                  { label: 'Firebase Analytics', sub: 'Usage intelligence',      color: 'bg-cyan-500' },
                ].map(({ label, sub, color }) => (
                  <div key={label} className="flex items-center gap-2.5">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${color}`} />
                    <div>
                      <p className="text-xs font-medium text-white">{label}</p>
                      <p className="text-[10px] text-slate-600">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FOOTER ──────────────────────────────────────── */}
      <footer className="border-t border-white/[0.04] py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <Vote size={14} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">VoteSphere</p>
              <p className="text-[10px] text-slate-600">Intelligent Election Companion</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 text-center">
            Built for democratic empowerment · Powered by Google Cloud · ECI guidelines compliant
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-700">
            <span className="flex items-center gap-1"><Shield size={10} /> Secure</span>
            <span className="flex items-center gap-1"><Zap size={10} /> Real-time</span>
            <span className="flex items-center gap-1"><Globe size={10} /> Multilingual</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
