import React from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import { Language } from '@/types';

interface ChatInputProps {
  input: string;
  setInput: (v: string) => void;
  onSend: () => void;
  onToggleMic: () => void;
  loading: boolean;
  listening: boolean;
  language: Language;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  input, setInput, onSend, onToggleMic, 
  loading, listening, language, inputRef 
}) => (
  <div className="px-4 py-3 border-t border-white/[0.06]">
    <div className="flex items-center gap-2">
      <div className="flex-1 relative">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && onSend()}
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
      <button onClick={onToggleMic}
        className={`flex-shrink-0 w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
          listening
            ? 'border-red-500/50 bg-red-500/10 text-red-400'
            : 'border-white/[0.08] bg-white/[0.04] text-slate-500 hover:text-white hover:border-white/20'
        }`} aria-label={listening ? "Stop listening" : "Start voice input"}>
        {listening ? <MicOff size={15} /> : <Mic size={15} />}
      </button>
      <button onClick={() => onSend()}
        disabled={!input.trim() || loading}
        className="flex-shrink-0 w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all"
        aria-label="Send message">
        <Send size={15} />
      </button>
    </div>
  </div>
);
