/**
 * Gemini API Integration Tests
 * Tests the core AI service: input sanitization, error handling, 
 * fallback behavior, and response parsing edge cases.
 */

import { askGemini } from '../src/lib/gemini';

// Mock global fetch
global.fetch = jest.fn();

const mockFetch = global.fetch as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  process.env.GEMINI_API_KEY = 'test-api-key-12345';
});

afterEach(() => {
  delete process.env.GEMINI_API_KEY;
});

// ─── Function Definition ─────────────────────────────────────────────────────
describe('askGemini - definition', () => {
  it('should be a function', () => {
    expect(typeof askGemini).toBe('function');
  });

  it('should return a Promise', () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: 'Test response' }] } }],
      }),
    });
    expect(askGemini('test')).toBeInstanceOf(Promise);
  });
});

// ─── Success path ────────────────────────────────────────────────────────────
describe('askGemini - success', () => {
  it('should return the text from the first candidate', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: 'NOTA means None of the Above.' }] } }],
      }),
    });
    const result = await askGemini('What is NOTA?');
    expect(result).toBe('NOTA means None of the Above.');
  });

  it('should call the Gemini 2.0 Flash endpoint', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ candidates: [{ content: { parts: [{ text: 'ok' }] } }] }),
    });
    await askGemini('Hello');
    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain('gemini-2.0-flash');
    expect(calledUrl).toContain('generateContent');
    expect(calledUrl).toContain('test-api-key-12345');
  });

  it('should include the user prompt in the request body', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ candidates: [{ content: { parts: [{ text: 'ok' }] } }] }),
    });
    await askGemini('How do I vote in India?');
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.contents[0].parts[0].text).toBe('How do I vote in India?');
  });

  it('should pass a custom system context', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ candidates: [{ content: { parts: [{ text: 'ok' }] } }] }),
    });
    await askGemini('test', 'You are a test assistant.');
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.system_instruction.parts[0].text).toContain('You are a test assistant.');
  });

  it('should use a default system context when none provided', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ candidates: [{ content: { parts: [{ text: 'ok' }] } }] }),
    });
    await askGemini('test');
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.system_instruction.parts[0].text).toContain('VoteSphere');
  });
});

// ─── Error Handling ──────────────────────────────────────────────────────────
describe('askGemini - error handling', () => {
  it('should throw if GEMINI_API_KEY is missing', async () => {
    delete process.env.GEMINI_API_KEY;
    await expect(askGemini('test')).rejects.toThrow('Gemini API key not configured');
  });

  it('should throw on non-OK HTTP response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      text: async () => '{"error":"quota exceeded"}',
    });
    await expect(askGemini('test')).rejects.toThrow('Gemini API error');
  });

  it('should return fallback message if candidates array is empty', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ candidates: [] }),
    });
    const result = await askGemini('test');
    expect(result).toContain('could not generate');
  });

  it('should return fallback message if candidates is undefined', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });
    const result = await askGemini('test');
    expect(result).toBeTruthy();
  });

  it('should throw if network request fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));
    await expect(askGemini('test')).rejects.toThrow('Network error');
  });
});

// ─── Generation Config ───────────────────────────────────────────────────────
describe('askGemini - generation config', () => {
  it('should include temperature in the request', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ candidates: [{ content: { parts: [{ text: 'ok' }] } }] }),
    });
    await askGemini('test');
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.generationConfig).toBeDefined();
    expect(body.generationConfig.temperature).toBeDefined();
  });

  it('should include safety settings in the request', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ candidates: [{ content: { parts: [{ text: 'ok' }] } }] }),
    });
    await askGemini('test');
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.safetySettings).toBeDefined();
    expect(Array.isArray(body.safetySettings)).toBe(true);
  });

  it('should set Content-Type to application/json', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ candidates: [{ content: { parts: [{ text: 'ok' }] } }] }),
    });
    await askGemini('test');
    const headers = mockFetch.mock.calls[0][1].headers;
    expect(headers['Content-Type']).toBe('application/json');
  });

  it('should use POST method', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ candidates: [{ content: { parts: [{ text: 'ok' }] } }] }),
    });
    await askGemini('test');
    expect(mockFetch.mock.calls[0][1].method).toBe('POST');
  });
});

// ─── translateText ───────────────────────────────────────────────────────────
import { translateText } from '../src/lib/gemini';

describe('translateText', () => {
  it('should return original text if API key is missing', async () => {
    delete process.env.GEMINI_API_KEY;
    const result = await translateText('Hello', 'hi');
    expect(result).toBe('Hello');
  });

  it('should call askGemini with translation prompt', async () => {
    process.env.GEMINI_API_KEY = 'test';
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ candidates: [{ content: { parts: [{ text: 'नमस्ते' }] } }] }),
    });
    const result = await translateText('Hello', 'Hindi');
    expect(result).toBe('नमस्ते');
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.contents[0].parts[0].text).toContain('Translate the following text to Hindi');
  });
});
