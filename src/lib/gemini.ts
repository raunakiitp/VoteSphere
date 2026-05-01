// Gemini API proxy - server-side only
export async function askGemini(prompt: string, systemContext?: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('Gemini API key not configured');

  const systemInstruction = systemContext || `You are VoteSphere's AI Civic Guide — an expert on Indian elections, 
  electoral processes, voter rights, and civic participation. You help citizens understand:
  - Voter registration and eligibility
  - Election procedures and timelines
  - Polling station information
  - Required documents for voting
  - Electoral law and rights
  - How to report violations
  Be concise, accurate, helpful, and speak in a friendly civic-guide tone. 
  Always encourage democratic participation. If asked in Hindi, respond in Hindi.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
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

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error: ${err}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'I could not generate a response. Please try again.';
}

export async function translateText(text: string, targetLang: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return text;

  const prompt = `Translate the following text to ${targetLang}. Return ONLY the translated text, no explanations:\n\n${text}`;
  return askGemini(prompt, 'You are a professional translator. Translate text accurately.');
}
