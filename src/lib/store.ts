import { create } from 'zustand';

export type JourneyStage = 'awareness' | 'eligibility' | 'preparation' | 'participation' | 'followup';
export type Language = 'en' | 'hi';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  age?: number;
  region?: string;
  voterId?: string;
  isAdmin?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  language?: Language;
}

export interface JourneyProgress {
  awareness: boolean;
  eligibility: boolean;
  preparation: boolean;
  participation: boolean;
  followup: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlockedAt?: Date;
}

interface VoteSphereStore {
  // Auth
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;

  // Journey
  currentStage: JourneyStage;
  setCurrentStage: (stage: JourneyStage) => void;
  progress: JourneyProgress;
  completeStage: (stage: JourneyStage) => void;

  // Badges
  badges: Badge[];
  unlockBadge: (badge: Badge) => void;

  // Chat
  messages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
  clearMessages: () => void;

  // Language
  language: Language;
  setLanguage: (lang: Language) => void;

  // Accessibility
  highContrast: boolean;
  largeText: boolean;
  theme: 'light' | 'dark';
  toggleHighContrast: () => void;
  toggleLargeText: () => void;
  toggleTheme: () => void;

  // Eligibility
  eligibilityResult: { eligible: boolean; probability: number; reasons: string[] } | null;
  setEligibilityResult: (result: { eligible: boolean; probability: number; reasons: string[] } | null) => void;
}

export const useVoteSphereStore = create<VoteSphereStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  currentStage: 'awareness',
  setCurrentStage: (stage) => set({ currentStage: stage }),
  progress: {
    awareness: false,
    eligibility: false,
    preparation: false,
    participation: false,
    followup: false,
  },
  completeStage: (stage) =>
    set((state) => ({
      progress: { ...state.progress, [stage]: true },
    })),

  badges: [],
  unlockBadge: (badge) =>
    set((state) => ({
      badges: state.badges.find((b) => b.id === badge.id)
        ? state.badges
        : [...state.badges, { ...badge, unlockedAt: new Date() }],
    })),

  messages: [],
  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages.slice(-49), msg],
    })),
  clearMessages: () => set({ messages: [] }),

  language: 'en',
  setLanguage: (lang) => set({ language: lang }),

  highContrast: false,
  largeText: false,
  theme: 'dark',
  toggleHighContrast: () => set((state) => ({ highContrast: !state.highContrast })),
  toggleLargeText: () => set((state) => ({ largeText: !state.largeText })),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

  eligibilityResult: null,
  setEligibilityResult: (result) => set({ eligibilityResult: result }),
}));
