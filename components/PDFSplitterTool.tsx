"use client";
import { useState } from "react";
import { PDFDocument } from "pdf-lib";

export default function PDFSplitterTool() {
  const [file, setFile] = useState<File | null>(null);
  const [splitUrls, setSplitUrls] = useState<string[]>([]);

  async function handleSplit() {
    if (!file) return;
    const bytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(bytes);
    const totalPages = pdfDoc.getPageCount();
    const urls: string[] = [];

    for (let i = 0; i < totalPages; i++) {
      const newPdf = await PDFDocument.create();
      const [page] = await newPdf.copyPages(pdfDoc, [i]);
      newPdf.addPage(page);
      const newBytes = await newPdf.save();
      // Cast to any to satisfy Blob constructor typing
      const blob = new Blob([newBytes as any], { type: "application/pdf" });
      urls.push(URL.createObjectURL(blob));
    }

    setSplitUrls(urls);
  }

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">📄 PDF Splitter</h2>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4 block w-full border rounded px-3 py-2"
      />
      <button
        onClick={handleSplit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Split PDF
      </button>

      {splitUrls.length > 0 && (
        <div className="mt-6 space-y-2">
          <h3 className="font-semibold">Download Split Pages:</h3>
          {splitUrls.map((url, i) => (
            <a
              key={i}
              href={url}
              download={`page-${i + 1}.pdf`}
              className="text-green-600 underline block"
            >
              📥 Page {i + 1}
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
