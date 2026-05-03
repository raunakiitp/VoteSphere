import { SYSTEM_PROMPTS } from './prompts';

const MAX_RETRIES = 3;
const INITIAL_DELAY = 1000;

async function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Gemini API proxy - server-side only
export async function askGemini(prompt: string, systemContext?: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('Gemini API key not configured');

  const systemInstruction = systemContext || SYSTEM_PROMPTS.chat('en');

  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemInstruction }] },
            contents: [{ parts: [{ text: prompt }], role: 'user' }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
            safetySettings: [
              { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
              { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            ],
          }),
        }
      );

      if (response.status === 429) {
        throw new Error('Rate limit exceeded');
      }

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini API error (${response.status}): ${errText}`);
      }

      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!reply) throw new Error('Unexpected empty response from Gemini');
      
      return reply;
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));
      
      // Don't retry for 400 errors (bad requests)
      if (lastError.message.includes('400')) throw lastError;
      
      // Exponential backoff
      const delay = INITIAL_DELAY * Math.pow(2, attempt);
      console.warn(`[Gemini API] Attempt ${attempt + 1} failed. Retrying in ${delay}ms...`, lastError.message);
      await wait(delay);
    }
  }

  throw lastError || new Error('Max retries reached for Gemini API');
}

export async function translateText(text: string, targetLang: string): Promise<string> {
  const prompt = `Translate the following text to ${targetLang}. Return ONLY the translated text, no explanations:\n\n${text}`;
  return askGemini(prompt, 'You are a professional translator. Translate text accurately.');
}

