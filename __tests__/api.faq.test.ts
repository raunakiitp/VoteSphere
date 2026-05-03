/** @jest-environment node */
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/ai/faq/route';
import { askGemini } from '@/lib/gemini';

jest.mock('@/lib/gemini');
const mockedAskGemini = askGemini as jest.MockedFunction<typeof askGemini>;

describe('FAQ API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 400 for invalid question', async () => {
    const req = new NextRequest('http://localhost/api/ai/faq', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 200 and answer for valid question', async () => {
    mockedAskGemini.mockResolvedValue('This is an answer.');
    const req = new NextRequest('http://localhost/api/ai/faq', {
      method: 'POST',
      body: JSON.stringify({ question: 'What is EPIC?' }),
    });
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.answer).toBe('This is an answer.');
  });

  it('returns 503 if AI service fails', async () => {
    mockedAskGemini.mockRejectedValue(new Error('AI fail'));
    const req = new NextRequest('http://localhost/api/ai/faq', {
      method: 'POST',
      body: JSON.stringify({ question: 'What is EPIC?' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(503);
  });
});
