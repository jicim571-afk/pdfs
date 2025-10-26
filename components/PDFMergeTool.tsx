"use client";
import { useState } from "react";
import { PDFDocument } from "pdf-lib";

export default function PDFMergeTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [mergedUrl, setMergedUrl] = useState<string | null>(null);

  async function handleMerge() {
    const mergedPdf = await PDFDocument.create();
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((page) => mergedPdf.addPage(page));
    }
    const mergedBytes = await mergedPdf.save();
    // Cast to any to satisfy Blob constructor typing
    const blob = new Blob([mergedBytes as any], { type: "application/pdf" });
    setMergedUrl(URL.createObjectURL(blob));
  }

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">🔗 Merge PDF</h2>
      <input
        type="file"
        accept="application/pdf"
        multiple
        onChange={(e) => setFiles(Array.from(e.target.files || []))}
        className="mb-4 block w-full border rounded px-3 py-2"
      />
      <button
        onClick={handleMerge}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Merge PDFs
      </button>

      {mergedUrl && (
        <div className="mt-6">
          <a
            href={mergedUrl}
            download="merged.pdf"
            className="text-green-600 underline"
          >
            📥 Download Merged PDF
          </a>
        </div>
      )}
    </section>
  );
}
