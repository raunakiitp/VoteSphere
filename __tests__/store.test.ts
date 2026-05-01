/**
 * Comprehensive test suite for VoteSphere State Management
 * Tests all store actions, state transitions, and edge cases
 */

import { act } from 'react';
import { useVoteSphereStore } from '../src/lib/store';

// Reset store between tests
beforeEach(() => {
  useVoteSphereStore.setState({
    user: null,
    currentStage: 'awareness',
    progress: { awareness: false, eligibility: false, preparation: false, participation: false, followup: false },
    badges: [],
    messages: [],
    language: 'en',
    highContrast: false,
    largeText: false,
    theme: 'dark',
    eligibilityResult: null,
  });
});

// ─── Auth ────────────────────────────────────────────────────────────────────
describe('Auth State', () => {
  it('should start with no user', () => {
    const { user } = useVoteSphereStore.getState();
    expect(user).toBeNull();
  });

  it('should set a user', () => {
    const mockUser = { uid: 'abc123', name: 'Raunak', email: 'raunak@test.com' };
    act(() => useVoteSphereStore.getState().setUser(mockUser));
    expect(useVoteSphereStore.getState().user).toEqual(mockUser);
  });

  it('should clear user on sign-out', () => {
    act(() => useVoteSphereStore.getState().setUser({ uid: 'abc', name: 'Test', email: 'test@test.com' }));
    act(() => useVoteSphereStore.getState().setUser(null));
    expect(useVoteSphereStore.getState().user).toBeNull();
  });

  it('should persist admin flag in user profile', () => {
    const adminUser = { uid: 'adm1', name: 'Admin', email: 'admin@votesphere.gov.in', isAdmin: true };
    act(() => useVoteSphereStore.getState().setUser(adminUser));
    expect(useVoteSphereStore.getState().user?.isAdmin).toBe(true);
  });

  it('should support optional user fields', () => {
    const user = { uid: 'u1', name: 'Voter', email: 'v@test.com', photoURL: 'https://example.com/photo.jpg', age: 25, region: 'Maharashtra' };
    act(() => useVoteSphereStore.getState().setUser(user));
    expect(useVoteSphereStore.getState().user?.region).toBe('Maharashtra');
  });
});

// ─── Journey ─────────────────────────────────────────────────────────────────
describe('Journey Progress', () => {
  it('should start at awareness stage', () => {
    expect(useVoteSphereStore.getState().currentStage).toBe('awareness');
  });

  it('should complete a stage and update progress', () => {
    act(() => useVoteSphereStore.getState().completeStage('awareness'));
    expect(useVoteSphereStore.getState().progress.awareness).toBe(true);
  });

  it('should not reset other stages when completing one', () => {
    act(() => useVoteSphereStore.getState().completeStage('awareness'));
    act(() => useVoteSphereStore.getState().completeStage('eligibility'));
    const { progress } = useVoteSphereStore.getState();
    expect(progress.awareness).toBe(true);
    expect(progress.eligibility).toBe(true);
    expect(progress.preparation).toBe(false);
  });

  it('should allow setting current stage directly', () => {
    act(() => useVoteSphereStore.getState().setCurrentStage('participation'));
    expect(useVoteSphereStore.getState().currentStage).toBe('participation');
  });

  it('should handle completing all stages', () => {
    const stages = ['awareness', 'eligibility', 'preparation', 'participation', 'followup'] as const;
    stages.forEach(s => act(() => useVoteSphereStore.getState().completeStage(s)));
    const { progress } = useVoteSphereStore.getState();
    expect(Object.values(progress).every(Boolean)).toBe(true);
  });

  it('should be idempotent when completing same stage twice', () => {
    act(() => useVoteSphereStore.getState().completeStage('awareness'));
    act(() => useVoteSphereStore.getState().completeStage('awareness'));
    expect(useVoteSphereStore.getState().progress.awareness).toBe(true);
  });
});

// ─── Badges ──────────────────────────────────────────────────────────────────
describe('Badge System', () => {
  const badge1 = { id: 'badge1', name: 'Pioneer', description: 'First action', emoji: '🏆' };
  const badge2 = { id: 'badge2', name: 'Voter', description: 'Voted', emoji: '🗳️' };

  it('should start with no badges', () => {
    expect(useVoteSphereStore.getState().badges).toHaveLength(0);
  });

  it('should unlock a badge', () => {
    act(() => useVoteSphereStore.getState().unlockBadge(badge1));
    expect(useVoteSphereStore.getState().badges).toHaveLength(1);
    expect(useVoteSphereStore.getState().badges[0].id).toBe('badge1');
  });

  it('should NOT duplicate a badge with the same id', () => {
    act(() => useVoteSphereStore.getState().unlockBadge(badge1));
    act(() => useVoteSphereStore.getState().unlockBadge(badge1));
    expect(useVoteSphereStore.getState().badges).toHaveLength(1);
  });

  it('should record unlockedAt timestamp', () => {
    const before = new Date();
    act(() => useVoteSphereStore.getState().unlockBadge(badge1));
    const { unlockedAt } = useVoteSphereStore.getState().badges[0];
    expect(unlockedAt).toBeDefined();
    expect(unlockedAt!.getTime()).toBeGreaterThanOrEqual(before.getTime());
  });

  it('should support multiple unique badges', () => {
    act(() => useVoteSphereStore.getState().unlockBadge(badge1));
    act(() => useVoteSphereStore.getState().unlockBadge(badge2));
    expect(useVoteSphereStore.getState().badges).toHaveLength(2);
  });
});

// ─── Chat Messages ───────────────────────────────────────────────────────────
describe('Chat Messages', () => {
  const makeMsg = (role: 'user' | 'assistant', content: string) => ({
    id: Math.random().toString(36).slice(2),
    role,
    content,
    timestamp: new Date(),
    language: 'en' as const,
  });

  it('should start with empty messages', () => {
    expect(useVoteSphereStore.getState().messages).toHaveLength(0);
  });

  it('should add a user message', () => {
    act(() => useVoteSphereStore.getState().addMessage(makeMsg('user', 'Hello')));
    expect(useVoteSphereStore.getState().messages).toHaveLength(1);
    expect(useVoteSphereStore.getState().messages[0].role).toBe('user');
  });

  it('should add an assistant message', () => {
    act(() => useVoteSphereStore.getState().addMessage(makeMsg('assistant', 'NOTA stands for...')));
    expect(useVoteSphereStore.getState().messages[0].content).toContain('NOTA');
  });

  it('should keep a maximum of 50 messages (ring buffer)', () => {
    for (let i = 0; i < 60; i++) {
      act(() => useVoteSphereStore.getState().addMessage(makeMsg('user', `msg ${i}`)));
    }
    expect(useVoteSphereStore.getState().messages.length).toBeLessThanOrEqual(50);
  });

  it('should clear all messages', () => {
    act(() => useVoteSphereStore.getState().addMessage(makeMsg('user', 'test')));
    act(() => useVoteSphereStore.getState().clearMessages());
    expect(useVoteSphereStore.getState().messages).toHaveLength(0);
  });

  it('should preserve message order', () => {
    const msgs = ['first', 'second', 'third'];
    msgs.forEach(c => act(() => useVoteSphereStore.getState().addMessage(makeMsg('user', c))));
    const stored = useVoteSphereStore.getState().messages.map(m => m.content);
    expect(stored).toEqual(msgs);
  });
});

// ─── Language ────────────────────────────────────────────────────────────────
describe('Language', () => {
  it('should default to English', () => {
    expect(useVoteSphereStore.getState().language).toBe('en');
  });

  it('should switch to Hindi', () => {
    act(() => useVoteSphereStore.getState().setLanguage('hi'));
    expect(useVoteSphereStore.getState().language).toBe('hi');
  });

  it('should switch back to English', () => {
    act(() => useVoteSphereStore.getState().setLanguage('hi'));
    act(() => useVoteSphereStore.getState().setLanguage('en'));
    expect(useVoteSphereStore.getState().language).toBe('en');
  });
});

// ─── Accessibility / Theme ───────────────────────────────────────────────────
describe('Accessibility Settings', () => {
  it('should toggle high contrast', () => {
    expect(useVoteSphereStore.getState().highContrast).toBe(false);
    act(() => useVoteSphereStore.getState().toggleHighContrast());
    expect(useVoteSphereStore.getState().highContrast).toBe(true);
    act(() => useVoteSphereStore.getState().toggleHighContrast());
    expect(useVoteSphereStore.getState().highContrast).toBe(false);
  });

  it('should toggle large text', () => {
    expect(useVoteSphereStore.getState().largeText).toBe(false);
    act(() => useVoteSphereStore.getState().toggleLargeText());
    expect(useVoteSphereStore.getState().largeText).toBe(true);
  });

  it('should toggle theme between dark and light', () => {
    expect(useVoteSphereStore.getState().theme).toBe('dark');
    act(() => useVoteSphereStore.getState().toggleTheme());
    expect(useVoteSphereStore.getState().theme).toBe('light');
    act(() => useVoteSphereStore.getState().toggleTheme());
    expect(useVoteSphereStore.getState().theme).toBe('dark');
  });
});

// ─── Eligibility ─────────────────────────────────────────────────────────────
describe('Eligibility Result', () => {
  it('should start with null eligibility result', () => {
    expect(useVoteSphereStore.getState().eligibilityResult).toBeNull();
  });

  it('should store eligible result', () => {
    const result = { eligible: true, probability: 95, reasons: ['Age verified', 'Citizen'] };
    act(() => useVoteSphereStore.getState().setEligibilityResult(result));
    expect(useVoteSphereStore.getState().eligibilityResult?.eligible).toBe(true);
    expect(useVoteSphereStore.getState().eligibilityResult?.probability).toBe(95);
  });

  it('should store ineligible result with reasons', () => {
    const result = { eligible: false, probability: 10, reasons: ['Age < 18'] };
    act(() => useVoteSphereStore.getState().setEligibilityResult(result));
    expect(useVoteSphereStore.getState().eligibilityResult?.eligible).toBe(false);
    expect(useVoteSphereStore.getState().eligibilityResult?.reasons).toContain('Age < 18');
  });

  it('should clear eligibility result', () => {
    act(() => useVoteSphereStore.getState().setEligibilityResult({ eligible: true, probability: 90, reasons: [] }));
    act(() => useVoteSphereStore.getState().setEligibilityResult(null));
    expect(useVoteSphereStore.getState().eligibilityResult).toBeNull();
  });
});
