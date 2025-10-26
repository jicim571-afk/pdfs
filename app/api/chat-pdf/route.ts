import { NextResponse } from "next/server";
// Use pdf-parse for server-side PDF text extraction
let pdfParse: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  pdfParse = require("pdf-parse");
} catch (err) {
  pdfParse = null;
}

const OPENAI_KEY = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;

async function extractTextFromPdfBuffer(buffer: ArrayBuffer) {
  if (!pdfParse) throw new Error("pdf-parse not available");
  const data = await pdfParse(Buffer.from(buffer));
  return data?.text || "";
}

async function askOpenAI(systemPrompt: string, prompt: string) {
  if (!OPENAI_KEY) {
    throw new Error("OPENAI_API_KEY not set in environment. Set it to use Chat with PDF.");
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      max_tokens: 800,
      temperature: 0.1,
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`OpenAI error: ${res.status} ${txt}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as any;
    const question = String(form.get("question") || "Summarize the document.");

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const buf = await file.arrayBuffer();
    // Prefer direct text extraction (works with digital PDFs)
    const text = await extractTextFromPdfBuffer(buf);

    // Build a concise prompt: include small context then question
    const systemPrompt = "You are a helpful assistant. Use the document content provided to answer user questions concisely and cite page numbers when helpful.";

    // If document is very long, truncate and inform user
    const context = text.length > 25000 ? text.slice(0, 25000) : text;
    const prompt = `Document content:\n${context}\n\nUser question:\n${question}`;

    const answer = await askOpenAI(systemPrompt, prompt);
    return NextResponse.json({ answer });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
