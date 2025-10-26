"use client";
import { useState } from "react";
import { PDFDocument } from "pdf-lib";

export default function JPGToPDFTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  async function handleConvert() {
    const pdfDoc = await PDFDocument.create();
    for (const file of files) {
      const imgBytes = await file.arrayBuffer();
      const img = await pdfDoc.embedJpg(imgBytes);
      const page = pdfDoc.addPage([img.width, img.height]);
      page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
    }
    const pdfBytes = await pdfDoc.save();
    // Cast to any to satisfy Blob constructor typing (pdf-lib returns a
    // Uint8Array-like that can have an ArrayBufferLike buffer in some
    // environments). This is safe at runtime.
    const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
    setPdfUrl(URL.createObjectURL(blob));
  }

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">🖼️ JPG to PDF Converter</h2>
      <input
        type="file"
        accept="image/jpeg"
        multiple
        onChange={(e) => setFiles(Array.from(e.target.files || []))}
        className="mb-4 block w-full border rounded px-3 py-2"
      />
      <button
        onClick={handleConvert}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Convert to PDF
      </button>

      {pdfUrl && (
        <div className="mt-6">
          <a
            href={pdfUrl}
            download="converted.pdf"
            className="text-green-600 font-medium underline"
          >
            📥 Download PDF
          </a>
        </div>
      )}
    </section>
  );
}
