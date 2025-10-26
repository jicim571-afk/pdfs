import { NextResponse } from 'next/server';

const OPENAI_KEY = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    if (!text) return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    if (!OPENAI_KEY) return NextResponse.json({ error: 'OPENAI_API_KEY not set on server' }, { status: 500 });

    const systemPrompt = 'You are a helpful assistant that summarizes text concisely.';
    const prompt = `Summarize the following text in 3-6 concise bullet points:\n\n${text.slice(0, 25000)}`;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        max_tokens: 400,
        temperature: 0.2,
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      return NextResponse.json({ error: `OpenAI error: ${res.status} ${txt}` }, { status: 500 });
    }
    const data = await res.json();
    const answer = data.choices?.[0]?.message?.content || '';
    return NextResponse.json({ summary: answer });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
