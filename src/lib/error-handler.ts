import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export function handleApiError(err: unknown, context: string) {
  console.error(`[${context}] Error:`, err);

  if (err instanceof ZodError) {
    return NextResponse.json({ 
      error: 'Validation failed', 
      details: err.errors.map(e => ({ path: e.path, message: e.message })) 
    }, { status: 400 });
  }

  const message = err instanceof Error ? err.message : String(err);
  
  if (message.includes('rate limit') || message.includes('429')) {
    return NextResponse.json({ error: 'Too many requests. Please slow down.' }, { status: 429 });
  }

  if (message.includes('API key')) {
    return NextResponse.json({ error: 'Service configuration error' }, { status: 500 });
  }

  return NextResponse.json({ 
    error: 'An internal service error occurred. Please try again later.' 
  }, { status: 503 });
}
