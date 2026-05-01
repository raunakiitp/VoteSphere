'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useVoteSphereStore } from '@/lib/store';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import {
  Vote, Menu, X, Globe, Contrast, Type,
  LogIn, LogOut, ChevronRight, Shield, Sun, Moon, Bell
} from 'lucide-react';
import toast from 'react-hot-toast';

const NAV_LINKS = {
  en: [
    { label: 'Journey',    href: '/journey' },
    { label: 'Check Eligibility', href: '/eligibility' },
    { label: 'Polling Map', href: '/map' },
    { label: 'Documents',  href: '/documents' },
    { label: 'Timeline',   href: '/timeline' },
    { label: 'FAQ',        href: '/faq' },
  ],
  hi: [
    { label: 'यात्रा',    href: '/journey' },
    { label: 'पात्रता जांचें', href: '/eligibility' },
    { label: 'मतदान मानचित्र', href: '/map' },
    { label: 'दस्तावेज़',  href: '/documents' },
    { label: 'समय-सीमा',   href: '/timeline' },
    { label: 'सामान्य प्रश्न',        href: '/faq' },
  ]
};

export default function Navbar() {
  const { user, setUser, language, setLanguage, toggleHighContrast, toggleLargeText, highContrast, largeText, theme, toggleTheme } = useVoteSphereStore();
  const [open, setOpen] = useState(false);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success(language === 'hi' ? 'आपका स्वागत है!' : 'Welcome to VoteSphere!');
    } catch (e: any) {
      if (e.code !== 'auth/popup-closed-by-user') toast.error(language === 'hi' ? 'लॉगिन विफल' : 'Sign in failed.');
    }
  };

  const links = NAV_LINKS[language];

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.06] bg-[#04080f]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-14 gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Vote size={16} className="text-white" />
          </div>
          <span className="font-bold text-white text-sm tracking-tight">VoteSphere</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1 ml-4">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className="px-3 py-1.5 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.05] transition-all">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {/* Theme Toggle */}
          <button onClick={toggleTheme}
            className="btn-ghost hidden sm:flex text-xs font-semibold text-slate-400 hover:text-white"
            title="Toggle Day/Night">
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {/* Language */}
          <button onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="btn-ghost hidden sm:flex text-xs font-semibold"
            title="Toggle language">
            <Globe size={14} />
            {language === 'en' ? 'हिं' : 'EN'}
          </button>

          {/* Accessibility */}
          <button onClick={toggleHighContrast}
            className={`btn-ghost hidden sm:flex ${highContrast ? 'text-yellow-400 bg-yellow-400/10' : ''}`}
            title="High contrast">
            <Contrast size={14} />
          </button>
          <button onClick={toggleLargeText}
            className={`btn-ghost hidden sm:flex ${largeText ? 'text-blue-400 bg-blue-400/10' : ''}`}
            title="Large text">
            <Type size={14} />
          </button>

          {/* Admin link */}
          {user && (
            <Link href="/admin"
              className="hidden lg:flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 px-2.5 py-1.5 rounded-lg hover:bg-amber-400/10 transition-all font-medium">
              <Shield size={12} />Admin
            </Link>
          )}

          {/* Notifications */}
          <button className="btn-ghost relative text-slate-400 hover:text-white" title="Notifications">
            <Bell size={14} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
          </button>

          {/* Auth */}
          {user ? (
            <div className="flex items-center gap-2">
              {user.photoURL && (
                <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full ring-2 ring-blue-500/30" />
              )}
              <button onClick={() => {
                if (user.uid === 'mock-uid') { setUser(null); toast.success('Signed out'); return; }
                signOut(auth).then(() => toast.success('Signed out'))
              }}
                className="btn-ghost hidden sm:flex text-xs">
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button onClick={handleSignIn} className="btn-primary text-xs py-2 px-3">
              <LogIn size={13} /> {language === 'hi' ? 'साइन इन करें' : 'Sign in'}
            </button>
          )}

          {/* Mobile menu toggle */}
          <button onClick={() => setOpen(!open)}
            className="lg:hidden btn-ghost ml-1">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-white/[0.06] bg-[#04080f] px-4 py-3 space-y-0.5">
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/[0.05] rounded-lg transition-all">
              {l.label}
              <ChevronRight size={14} className="text-slate-600" />
            </Link>
          ))}
          <div className="flex gap-2 pt-2 mt-1 border-t border-white/[0.06]">
            <button onClick={toggleTheme}
              className="flex-1 btn-secondary text-xs justify-center">
              {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />} {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
            <button onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex-1 btn-secondary text-xs justify-center">
              <Globe size={13} /> {language === 'en' ? 'हिंदी' : 'English'}
            </button>
            <button onClick={toggleHighContrast}
              className={`btn-secondary text-xs px-3 ${highContrast ? 'border-yellow-500/40 text-yellow-400' : ''}`}>
              <Contrast size={14} />
            </button>
            <button onClick={toggleLargeText}
              className={`btn-secondary text-xs px-3 ${largeText ? 'border-blue-500/40 text-blue-400' : ''}`}>
              <Type size={14} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
