/**
 * Eligibility Logic Tests
 * Tests the core Indian electoral eligibility rules:
 * age, citizenship, existing voter ID, and state-specific rules.
 */

// ─── Pure eligibility logic (extracted for testability) ──────────────────────
export interface EligibilityInput {
  age: number;
  isCitizen: boolean;
  state: string;
  hasVoterId: boolean;
}

export interface EligibilityOutput {
  eligible: boolean;
  probability: number;
  reasons: string[];
}

export function checkEligibility(input: EligibilityInput): EligibilityOutput {
  const reasons: string[] = [];
  let probability = 100;

  // Rule 1: Must be 18+
  if (input.age < 18) {
    reasons.push('Must be at least 18 years old to vote in India.');
    probability -= 60;
  } else if (input.age >= 18) {
    reasons.push('Age requirement (18+) satisfied.');
  }

  // Rule 2: Must be Indian citizen
  if (!input.isCitizen) {
    reasons.push('Must be an Indian citizen to register as a voter.');
    probability -= 40;
  } else {
    reasons.push('Indian citizenship confirmed.');
  }

  // Rule 3: Already has voter ID – still eligible, just already registered
  if (input.hasVoterId) {
    reasons.push('Voter ID already exists — you are already registered.');
  }

  // Rule 4: Valid state
  if (!input.state || input.state.trim() === '') {
    reasons.push('State/UT selection is required.');
    probability = Math.max(probability - 10, 0);
  }

  const eligible = probability >= 60 && input.age >= 18 && input.isCitizen;
  return { eligible, probability: Math.max(0, Math.min(100, probability)), reasons };
}

// ─── Tests ───────────────────────────────────────────────────────────────────
describe('Eligibility Logic', () => {

  describe('Age validation', () => {
    it('should be eligible at age 18', () => {
      const result = checkEligibility({ age: 18, isCitizen: true, state: 'Delhi', hasVoterId: false });
      expect(result.eligible).toBe(true);
    });

    it('should be eligible at age 25', () => {
      const result = checkEligibility({ age: 25, isCitizen: true, state: 'Maharashtra', hasVoterId: false });
      expect(result.eligible).toBe(true);
      expect(result.probability).toBeGreaterThanOrEqual(90);
    });

    it('should NOT be eligible at age 17', () => {
      const result = checkEligibility({ age: 17, isCitizen: true, state: 'Delhi', hasVoterId: false });
      expect(result.eligible).toBe(false);
    });

    it('should NOT be eligible at age 0', () => {
      const result = checkEligibility({ age: 0, isCitizen: true, state: 'Delhi', hasVoterId: false });
      expect(result.eligible).toBe(false);
    });

    it('should be eligible at age 80+', () => {
      const result = checkEligibility({ age: 85, isCitizen: true, state: 'Kerala', hasVoterId: true });
      expect(result.eligible).toBe(true);
    });

    it('should include age reason in output', () => {
      const result = checkEligibility({ age: 16, isCitizen: true, state: 'UP', hasVoterId: false });
      expect(result.reasons.some(r => r.includes('18'))).toBe(true);
    });
  });

  describe('Citizenship validation', () => {
    it('should NOT be eligible for non-citizens', () => {
      const result = checkEligibility({ age: 25, isCitizen: false, state: 'Delhi', hasVoterId: false });
      expect(result.eligible).toBe(false);
    });

    it('should include citizenship reason for non-citizens', () => {
      const result = checkEligibility({ age: 25, isCitizen: false, state: 'Delhi', hasVoterId: false });
      expect(result.reasons.some(r => r.toLowerCase().includes('citizen'))).toBe(true);
    });

    it('should have reduced probability for non-citizens', () => {
      const result = checkEligibility({ age: 25, isCitizen: false, state: 'Delhi', hasVoterId: false });
      expect(result.probability).toBeLessThan(70);
    });
  });

  describe('Voter ID status', () => {
    it('should mark existing voter as eligible (already registered)', () => {
      const result = checkEligibility({ age: 25, isCitizen: true, state: 'Bihar', hasVoterId: true });
      expect(result.eligible).toBe(true);
    });

    it('should mention voter ID in reasons', () => {
      const result = checkEligibility({ age: 25, isCitizen: true, state: 'Bihar', hasVoterId: true });
      expect(result.reasons.some(r => r.toLowerCase().includes('voter id'))).toBe(true);
    });
  });

  describe('State validation', () => {
    it('should work for all major Indian states', () => {
      const states = ['Delhi', 'Maharashtra', 'UP', 'Bihar', 'Tamil Nadu', 'Karnataka', 'Kerala', 'Rajasthan'];
      states.forEach(state => {
        const result = checkEligibility({ age: 21, isCitizen: true, state, hasVoterId: false });
        expect(result.eligible).toBe(true);
      });
    });

    it('should flag empty state', () => {
      const result = checkEligibility({ age: 21, isCitizen: true, state: '', hasVoterId: false });
      expect(result.reasons.some(r => r.includes('State'))).toBe(true);
    });
  });

  describe('Output structure', () => {
    it('should always return eligible, probability, and reasons', () => {
      const result = checkEligibility({ age: 22, isCitizen: true, state: 'Delhi', hasVoterId: false });
      expect(result).toHaveProperty('eligible');
      expect(result).toHaveProperty('probability');
      expect(result).toHaveProperty('reasons');
      expect(Array.isArray(result.reasons)).toBe(true);
    });

    it('should cap probability at 100', () => {
      const result = checkEligibility({ age: 25, isCitizen: true, state: 'Delhi', hasVoterId: false });
      expect(result.probability).toBeLessThanOrEqual(100);
    });

    it('should floor probability at 0', () => {
      const result = checkEligibility({ age: 5, isCitizen: false, state: '', hasVoterId: false });
      expect(result.probability).toBeGreaterThanOrEqual(0);
    });

    it('should have at least one reason in output', () => {
      const result = checkEligibility({ age: 22, isCitizen: true, state: 'Delhi', hasVoterId: false });
      expect(result.reasons.length).toBeGreaterThan(0);
    });
  });

  describe('Combined ineligibility', () => {
    it('should be fully ineligible for young non-citizen', () => {
      const result = checkEligibility({ age: 15, isCitizen: false, state: 'Delhi', hasVoterId: false });
      expect(result.eligible).toBe(false);
      expect(result.probability).toBeLessThan(30);
    });
  });
});
