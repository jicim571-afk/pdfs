import { NextResponse } from "next/server";
// Use pdf-parse for server-side PDF text extraction (more compatible with bundlers)
let pdfParse: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  pdfParse = require("pdf-parse");
} catch (err) {
  pdfParse = null;
}

// Try to import tesseract dynamically if available
let Tesseract: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Tesseract = require("tesseract.js");
} catch (err) {
  // tesseract not installed or not available in environment
  Tesseract = null;
}

async function extractTextFromPdf(buffer: ArrayBuffer) {
  if (!pdfParse) throw new Error("pdf-parse not available");
  const data = await pdfParse(Buffer.from(buffer));
  return data?.text || "";
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as any;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const buf = await file.arrayBuffer();
    const type = file.type || file.name?.split(".").pop();

    // If PDF, try text extraction via pdfjs
    if (file.type === "application/pdf" || file.name?.endsWith(".pdf")) {
      const text = await extractTextFromPdf(buf);
      return NextResponse.json({ text });
    }

    // For images, fall back to Tesseract if available
    if (Tesseract) {
      const worker = await Tesseract.createWorker("eng");
      const { data } = await worker.recognize(Buffer.from(buf));
      await worker.terminate();
      return NextResponse.json({ text: data.text });
    }

    return NextResponse.json({ error: "OCR not available (tesseract.js missing) and file is not a PDF." }, { status: 501 });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
