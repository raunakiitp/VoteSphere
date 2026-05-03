/**
 * @jest-environment node
 *
 * Chat API Route Integration Tests
 * Tests the /api/ai/chat endpoint: rate limiting, input validation,
 * response format, and error scenarios.
 */

// Mock the Gemini module
jest.mock('../src/lib/gemini', () => ({
  askGemini: jest.fn(),
}));

import { POST } from '../src/app/api/ai/chat/route';
import { askGemini } from '../src/lib/gemini';
import { NextRequest } from 'next/server';

const mockAskGemini = askGemini as jest.Mock;

function makeRequest(body: object, ip = '127.0.0.1'): NextRequest {
  return new NextRequest('http://localhost/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  mockAskGemini.mockResolvedValue('Mocked AI response about Indian elections.');
});

// ─── Valid requests ──────────────────────────────────────────────────────────
describe('POST /api/ai/chat - valid', () => {
  it('should return 200 with a reply for a valid English message', async () => {
    const req = makeRequest({ message: 'What is NOTA?', language: 'en', history: [] });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.reply).toBeDefined();
    expect(typeof json.reply).toBe('string');
  });

  it('should return 200 with a reply for a valid Hindi message', async () => {
    const req = makeRequest({ message: 'NOTA क्या है?', language: 'hi', history: [] });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.reply).toBeTruthy();
  });

  it('should pass conversation history to Gemini', async () => {
    const history = [
      { role: 'user', content: 'How to register?' },
      { role: 'assistant', content: 'Visit voterportal.eci.gov.in' },
    ];
    const req = makeRequest({ message: 'Tell me more', language: 'en', history });
    await POST(req);
    const calledPrompt = mockAskGemini.mock.calls[0][0] as string;
    expect(calledPrompt).toContain('How to register?');
  });

  it('should call askGemini with a system context', async () => {
    const req = makeRequest({ message: 'Hello', language: 'en', history: [] });
    await POST(req);
    expect(mockAskGemini).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining('VoteSphere')
    );
  });

  it('should trim whitespace from message', async () => {
    const req = makeRequest({ message: '   What is NOTA?   ', language: 'en', history: [] });
    const res = await POST(req);
    expect(res.status).toBe(200);
  });
});

// ─── Input validation ────────────────────────────────────────────────────────
describe('POST /api/ai/chat - validation', () => {
  it('should return 400 for missing message', async () => {
    const req = makeRequest({ language: 'en', history: [] });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('should return 400 for empty string message', async () => {
    const req = makeRequest({ message: '', language: 'en', history: [] });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('should return 400 for non-string message', async () => {
    const req = makeRequest({ message: 12345, language: 'en', history: [] });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('should return 400 for null message', async () => {
    const req = makeRequest({ message: null, language: 'en', history: [] });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('should accept message without history field', async () => {
    const req = makeRequest({ message: 'Valid query', language: 'en' });
    const res = await POST(req);
    expect(res.status).toBe(200);
  });
});

// ─── Error handling ──────────────────────────────────────────────────────────
describe('POST /api/ai/chat - errors', () => {
  it('should return 503 when Gemini throws', async () => {
    mockAskGemini.mockRejectedValueOnce(new Error('Gemini API error'));
    const req = makeRequest({ message: 'Test', language: 'en', history: [] });
    const res = await POST(req);
    expect(res.status).toBe(503);
    const data = await res.json();
    expect(data.error).toBeDefined();
  });

  it('should return 503 when Gemini is unreachable', async () => {
    mockAskGemini.mockRejectedValueOnce(new Error('Network timeout'));
    const req = makeRequest({ message: 'Test', language: 'en', history: [] });
    const res = await POST(req);
    expect(res.status).toBe(503);
  });

  it('should return JSON even on error', async () => {
    mockAskGemini.mockRejectedValueOnce(new Error('fail'));
    const req = makeRequest({ message: 'Test', language: 'en', history: [] });
    const res = await POST(req);
    const data = await res.json();
    expect(data).toHaveProperty('error');
  });
});

// ─── Rate limiting ───────────────────────────────────────────────────────────
describe('POST /api/ai/chat - rate limiting', () => {
  it('should return 429 when rate limit is exceeded', async () => {
    const ip = '1.2.3.4';
    // Rate limit is 20 per minute. Send 20 requests.
    for (let i = 0; i < 20; i++) {
      const req = makeRequest({ message: 'Test', language: 'en' }, ip);
      const res = await POST(req);
      expect(res.status).toBe(200);
    }
    // 21st request should be blocked
    const req = makeRequest({ message: 'Test', language: 'en' }, ip);
    const res = await POST(req);
    expect(res.status).toBe(429);
  });
});
