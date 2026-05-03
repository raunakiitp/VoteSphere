import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { askGemini } from '@/lib/gemini';
import { SYSTEM_PROMPTS } from '@/lib/prompts';
import { handleApiError } from '@/lib/error-handler';

// Rate limiting (simple in-memory) - In production, use Redis or similar
const requestLog = new Map<string, number[]>();
const RATE_LIMIT = 20; // requests per minute

const chatSchema = z.object({
  message: z.string().min(1).max(1000),
  language: z.enum(['en', 'hi']).default('en'),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).optional().default([])
});

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const requests = (requestLog.get(ip) || []).filter((t) => now - t < windowMs);
  if (requests.length >= RATE_LIMIT) return false;
  requestLog.set(ip, [...requests, now]);
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Rate limit exceeded. Please wait.' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { message, language, history } = chatSchema.parse(body);

    const historyContext = history.length
      ? `\n\nConversation history:\n${history.map(h => `${h.role}: ${h.content}`).join('\n')}\n\nCurrent question:`
      : '';

    const systemContext = SYSTEM_PROMPTS.chat(language);
    const reply = await askGemini(historyContext ? `${historyContext} ${message}` : message, systemContext);

    return NextResponse.json({ reply });
  } catch (err: unknown) {
    return handleApiError(err, 'Chat API');
  }
}
