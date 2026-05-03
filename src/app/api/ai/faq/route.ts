import { NextRequest, NextResponse } from 'next/server';
import { askGemini } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();
    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'Invalid question' }, { status: 400 });
    }

    const sanitized = question.trim().substring(0, 500);

    const systemContext = `You are an FAQ answering system for VoteSphere, India's civic-tech election platform.
Answer questions about Indian elections, voting procedures, ECI guidelines, voter rights, and electoral processes.
Keep answers concise (2-4 sentences), factual, and cite relevant laws or ECI guidelines where applicable.
Format: Start with a direct answer, then provide brief supporting detail.`;

    const answer = await askGemini(
      `FAQ Question: ${sanitized}\n\nProvide a clear, factual answer about Indian elections and voting.`,
      systemContext
    );

    return NextResponse.json({ answer });
  } catch (err: unknown) {
    console.error('[FAQ API] Error:', err);
    return NextResponse.json({ error: 'AI service unavailable' }, { status: 503 });
  }
}
