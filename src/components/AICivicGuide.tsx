'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useVoteSphereStore } from '@/lib/store';
import { ChatMessage } from '@/types';
import { Bot, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

import { ChatHeader } from './AICivicGuide/ChatHeader';
import { ChatMessageComponent } from './AICivicGuide/ChatMessageComponent';
import { QuickPrompts } from './AICivicGuide/QuickPrompts';
import { ChatInput } from './AICivicGuide/ChatInput';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

const genId = () => Math.random().toString(36).slice(2, 11);

export default function AICivicGuide() {
  const { messages, addMessage, clearMessages, language } = useVoteSphereStore();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [voice, setVoice] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { isListening, toggleListening } = useSpeechRecognition(language, (transcript) => {
    setInput(transcript);
  });

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      addMessage({
        id: genId(),
        role: 'assistant',
        timestamp: new Date(),
        language,
        content: language === 'hi'
          ? 'नमस्ते! मैं VoteSphere का AI सिविक गाइड हूँ। चुनाव से जुड़े किसी भी सवाल में मैं आपकी मदद कर सकता हूँ।'
          : "Hello! I'm VoteSphere's AI Civic Guide, powered by Google Gemini. Ask me anything about elections, voter registration, polling stations, or your rights as a voter.",
      });
    }
  }, [messages.length, addMessage, language]);

  const handleSend = async (text?: string) => {
    const messageContent = (text ?? input).trim();
    if (!messageContent || loading) return;

    setInput('');
    addMessage({ 
      id: genId(), 
      role: 'user', 
      content: messageContent, 
      timestamp: new Date(), 
      language 
    });
    setLoading(true);

    try {
      const history = messages.slice(-6).map(m => ({ role: m.role, content: m.content }));
      
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageContent, language, history }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      
      const { reply } = data;
      if (!reply) throw new Error('Empty response from AI');

      const aiMsg: ChatMessage = { 
        id: genId(), 
        role: 'assistant', 
        content: reply, 
        timestamp: new Date(), 
        language 
      };
      
      addMessage(aiMsg);

      if (voice && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(reply.slice(0, 500));
        utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
        utterance.rate = 0.9;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      }
    } catch (err: unknown) {
      console.error('[Chat Error]', err);
      const msg = err instanceof Error ? err.message : 'AI service unavailable';
      toast.error(msg.includes('503') ? 'AI is busy. Please try again later.' : 'Message failed to send.');
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="card flex flex-col h-[580px] shadow-2xl border-white/[0.05] overflow-hidden">
      <ChatHeader voice={voice} setVoice={setVoice} onClear={clearMessages} />
      <QuickPrompts language={language} onSelect={handleSend} />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto scroll-thin px-4 py-4 space-y-4 bg-slate-900/20">
        {messages.map(m => (
          <ChatMessageComponent key={m.id} message={m} />
        ))}

        {loading && (
          <div className="flex gap-2.5 items-start animate-pulse">
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-white/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5">
              <Bot size={12} className="text-slate-400" />
            </div>
            <div className="bg-[#111827] border border-white/[0.06] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
              <Loader2 size={13} className="animate-spin text-blue-400" />
              <span className="text-xs text-slate-500 font-medium">Gemini is thinking...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <ChatInput 
        input={input}
        setInput={setInput}
        onSend={handleSend}
        onToggleMic={toggleListening}
        loading={loading}
        listening={isListening}
        language={language}
        inputRef={inputRef}
      />
    </div>
  );
}

