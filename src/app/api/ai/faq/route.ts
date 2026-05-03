import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { askGemini } from '@/lib/gemini';
import { SYSTEM_PROMPTS } from '@/lib/prompts';
import { handleApiError } from '@/lib/error-handler';

const faqSchema = z.object({
  question: z.string().min(1).max(500)
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question } = faqSchema.parse(body);

    const answer = await askGemini(
      `FAQ Question: ${question}\n\nProvide a clear, factual answer about Indian elections and voting.`,
      SYSTEM_PROMPTS.faq
    );

    return NextResponse.json({ answer });
  } catch (err: unknown) {
    return handleApiError(err, 'FAQ API');
  }
}
