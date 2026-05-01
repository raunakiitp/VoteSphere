'use client';

import { useState, useRef, useEffect } from 'react';
import { useVoteSphereStore, type ChatMessage } from '@/lib/store';
import {
  Send, Mic, MicOff, Volume2, VolumeX,
  Bot, Loader2, User, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

function genId() { return Math.random().toString(36).slice(2, 11); }

const QUICK = {
  en: ['How to register to vote?', 'What documents do I need?', 'Where is my polling station?', 'What is NOTA?'],
  hi: ['मतदाता पंजीकरण कैसे करें?', 'कौन से दस्तावेज़ चाहिए?', 'मतदान केंद्र कैसे खोजें?', 'NOTA क्या है?'],
};

export default function AICivicGuide() {
  const { messages, addMessage, clearMessages, language } = useVoteSphereStore();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [voice, setVoice] = useState(false);
  const [listening, setListening] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const recRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Welcome message
  useEffect(() => {
    if (messages.length === 0) {
      addMessage({
        id: genId(), role: 'assistant', timestamp: new Date(), language,
        content: language === 'hi'
          ? 'नमस्ते! मैं VoteSphere का AI सिविक गाइड हूँ। चुनाव से जुड़े किसी भी सवाल में मैं आपकी मदद कर सकता हूँ।'
          : "Hello! I'm VoteSphere's AI Civic Guide, powered by Google Gemini. Ask me anything about elections, voter registration, polling stations, or your rights as a voter.",
      });
    }
  }, []);

  const send = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput('');

    addMessage({ id: genId(), role: 'user', content: msg, timestamp: new Date(), language });
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, language, history: messages.slice(-6).map(m => ({ role: m.role, content: m.content })) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      const { reply } = data;
      if (!reply) throw new Error('Empty response from AI');
      const aiMsg: ChatMessage = { id: genId(), role: 'assistant', content: reply, timestamp: new Date(), language };
      addMessage(aiMsg);
      if (voice && 'speechSynthesis' in window) {
        const utt = new SpeechSynthesisUtterance(reply.slice(0, 500));
        utt.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
        utt.rate = 0.9;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utt);
      }
    } catch (err: any) {
      console.error('[AI Chat Error]', err);
      toast.error(err.message?.includes('503') || err.message?.includes('unavailable')
        ? 'AI service is temporarily busy. Please try again in a moment.'
        : 'Could not get a response. Please try again.');
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const toggleMic = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { toast.error('Speech recognition not supported.'); return; }
    if (listening) { recRef.current?.stop(); setListening(false); return; }
    const r = new SR();
    r.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    r.onresult = (e: any) => { setInput(e.results[0][0].transcript); setListening(false); };
    r.onerror = r.onend = () => setListening(false);
    recRef.current = r;
    r.start(); setListening(true);
  };

  return (
    <div className="card flex flex-col h-[580px]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
            <Bot size={18} className="text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">AI Civic Guide</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: 'pulse-dot 2s ease-in-out infinite' }} />
              <span className="text-xs text-emerald-400">Gemini-powered</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setVoice(!voice)}
            className={`btn-ghost ${voice ? 'text-blue-400' : 'text-slate-500'}`} title="Toggle voice">
            {voice ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>
          <button onClick={() => { clearMessages(); }} className="btn-ghost text-slate-500" title="Clear chat">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Quick prompts */}
      <div className="flex gap-2 px-4 py-2.5 border-b border-white/[0.06] overflow-x-auto scroll-thin flex-shrink-0">
        {QUICK[language].map(p => (
          <button key={p} onClick={() => send(p)}
            className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full border border-white/[0.08] text-slate-400 hover:text-white hover:border-blue-500/40 hover:bg-blue-500/5 transition-all whitespace-nowrap">
            {p}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scroll-thin px-4 py-4 space-y-4">
        {messages.map(m => (
          <div key={m.id} className={`flex gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Avatar */}
            <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5 ${
              m.role === 'user'
                ? 'bg-blue-600/20 border border-blue-500/30'
                : 'bg-slate-800 border border-white/[0.06]'}`}>
              {m.role === 'user'
                ? <User size={12} className="text-blue-400" />
                : <Bot size={12} className="text-slate-400" />}
            </div>
            {/* Bubble */}
            <div className={`max-w-[78%] ${m.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
              <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-sm'
                  : 'bg-[#111827] border border-white/[0.06] text-slate-200 rounded-tl-sm'}`}>
                <p className="whitespace-pre-wrap">{m.content}</p>
              </div>
              <span className="text-[10px] text-slate-600 px-1">
                {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2.5 items-start">
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-white/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5">
              <Bot size={12} className="text-slate-400" />
            </div>
            <div className="bg-[#111827] border border-white/[0.06] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
              <Loader2 size={13} className="anim-spin text-blue-400" />
              <span className="text-xs text-slate-500">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder={language === 'hi' ? 'अपना प्रश्न लिखें...' : 'Ask about elections, voting, your rights...'}
              className="input pr-10 text-sm"
              disabled={loading}
              aria-label="Chat message"
            />
            {listening && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                {[0,1,2].map(i => (
                  <div key={i} className="w-0.5 bg-blue-400 rounded-full animate-bounce"
                    style={{ height: '12px', animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
            )}
          </div>
          <button onClick={toggleMic}
            className={`flex-shrink-0 w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
              listening
                ? 'border-red-500/50 bg-red-500/10 text-red-400'
                : 'border-white/[0.08] bg-white/[0.04] text-slate-500 hover:text-white hover:border-white/20'
            }`} aria-label="Voice input">
            {listening ? <MicOff size={15} /> : <Mic size={15} />}
          </button>
          <button onClick={() => send()}
            disabled={!input.trim() || loading}
            className="flex-shrink-0 w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all"
            aria-label="Send">
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
