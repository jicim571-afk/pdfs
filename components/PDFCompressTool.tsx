"use client";
import { useState } from "react";
import { PDFDocument } from "pdf-lib";

export default function PDFCompressTool() {
  const [file, setFile] = useState<File | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);

  async function handleCompress() {
    if (!file) return;
    setLoading(true);
    try {
      const bytes = await file.arrayBuffer();
      setOriginalSize(bytes.byteLength);
      
      const pdfDoc = await PDFDocument.load(bytes);
      
      // Save with compression options
      const compressedBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });
      
      setCompressedSize(compressedBytes.byteLength);
      const blob = new Blob([compressedBytes as any], { type: "application/pdf" });
      setCompressedUrl(URL.createObjectURL(blob));
    } catch (error) {
      alert("Error compressing PDF: " + error);
    } finally {
      setLoading(false);
    }
  }

  function formatSize(bytes: number) {
    return (bytes / 1024 / 1024).toFixed(2) + " MB";
  }

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">🗜️ Compress PDF</h2>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => {
          const f = e.target.files?.[0] || null;
          setFile(f);
          setCompressedUrl(null);
        }}
        className="mb-4 block w-full border rounded px-3 py-2"
      />
      <button
        onClick={handleCompress}
        disabled={!file || loading}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "Compressing..." : "Compress PDF"}
      </button>

      {compressedUrl && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-slate-700 mb-2">
            Original: {formatSize(originalSize)} → Compressed: {formatSize(compressedSize)}
            <span className="font-semibold text-green-600">
              {" "}({Math.round((1 - compressedSize / originalSize) * 100)}% reduced)
            </span>
          </p>
          <a
            href={compressedUrl}
            download="compressed.pdf"
            className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            📥 Download Compressed PDF
          </a>
        </div>
      )}
    </section>
  );
}
