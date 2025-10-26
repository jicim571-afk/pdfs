"use client";
import { useState } from "react";
// Use the legacy build entry which is compatible with bundlers and set
// the worker URL explicitly to avoid webpack trying to resolve a missing
// local worker entry. We pin the CDN worker to the installed pdfjs-dist
// version from package.json (5.4.296).
// Defer loading pdfjs-dist to runtime inside the client event handler so
// the module (which expects browser APIs like DOMMatrix) is never
// evaluated during server-side prerendering. We'll dynamically import it
// when the user reads a PDF.

export default function PDFReaderTool() {
  const [file, setFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState<string>("");

  async function handleRead() {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const typedArray = new Uint8Array(reader.result as ArrayBuffer);
      // Import pdfjs on-demand (client only) and configure workerSrc.
      const pdfjsLib = (await import("pdfjs-dist")) as any;
      pdfjsLib.GlobalWorkerOptions = pdfjsLib.GlobalWorkerOptions || {};
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://unpkg.com/pdfjs-dist@5.4.296/build/pdf.worker.min.js";

      const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((item: any) => item.str);
        fullText += strings.join(" ") + "\n\n";
      }

      setTextContent(fullText);
    };
    reader.readAsArrayBuffer(file);
  }

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">📖 PDF Reader</h2>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4 block w-full border rounded px-3 py-2"
      />
      <button
        onClick={handleRead}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Read PDF
      </button>

      {textContent && (
        <div className="mt-6 bg-gray-100 p-4 rounded whitespace-pre-wrap max-h-[500px] overflow-y-auto">
          <h3 className="font-semibold mb-2">Extracted Text:</h3>
          <p>{textContent}</p>
        </div>
      )}
    </section>
  );
}
