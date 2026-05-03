import { NextRequest, NextResponse } from 'next/server';
import { askGemini } from '@/lib/gemini';

// Rate limiting (simple in-memory)
const requestLog = new Map<string, number[]>();
const RATE_LIMIT = 20; // requests per minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const requests = (requestLog.get(ip) || []).filter((t) => now - t < windowMs);
  if (requests.length >= RATE_LIMIT) return false;
  requestLog.set(ip, [...requests, now]);
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Rate limit exceeded. Please wait.' }, { status: 429 });
  }

  try {
    const { message, language, history } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
    }

    const sanitized = message.trim().substring(0, 1000);

    const historyContext = history?.length
      ? `\n\nConversation history:\n${history.map((h: { role: string; content: string }) => `${h.role}: ${h.content}`).join('\n')}\n\nCurrent question:`
      : '';

    const systemContext = `You are VoteSphere's AI Civic Guide — India's premier election assistance AI powered by Google Gemini.
You are an expert on:
- Indian electoral system and Election Commission of India (ECI)
- Voter registration, EPIC cards, and electoral rolls
- Polling procedures, EVMs, and VVPATs
- Candidate eligibility and party systems
- Voter rights and Model Code of Conduct
- State and General election processes
- How to file complaints and report violations

Communication style:
- Be concise, accurate, and encouraging
- If language is "hi", respond in Hindi (Devanagari script)
- Always promote civic participation
- For sensitive topics (candidates, parties), remain neutral
- Format responses with bullet points for clarity when listing items
- End with an encouraging civic message when appropriate

${language === 'hi' ? 'User prefers Hindi. Respond in Hindi.' : 'Respond in English.'}`;

    const reply = await askGemini(historyContext ? `${historyContext} ${sanitized}` : sanitized, systemContext);

    return NextResponse.json({ reply });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[Chat API] Gemini error:', msg);
    return NextResponse.json(
      { error: msg.includes('API key') ? 'API key error' : 'AI service unavailable' },
      { status: 503 }
    );
  }
}
