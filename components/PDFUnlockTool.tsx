"use client";
import { useState } from "react";
import { PDFDocument } from "pdf-lib";

export default function PDFUnlockTool() {
  const [file, setFile] = useState<File | null>(null);
  const [unlockedUrl, setUnlockedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleUnlock() {
    if (!file) return;
    setLoading(true);
    try {
      const bytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      
      const unlockedBytes = await pdfDoc.save();
      const blob = new Blob([unlockedBytes as any], { type: "application/pdf" });
      setUnlockedUrl(URL.createObjectURL(blob));
    } catch (error) {
      alert("Error unlocking PDF. The PDF may be password-protected: " + error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">🔓 Unlock PDF</h2>
      <p className="text-sm text-slate-600 mb-4">Remove restrictions from PDFs (does not work with password-protected files)</p>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => {
          setFile(e.target.files?.[0] || null);
          setUnlockedUrl(null);
        }}
        className="mb-4 block w-full border rounded px-3 py-2"
      />
      
      <button
        onClick={handleUnlock}
        disabled={!file || loading}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "Unlocking..." : "Unlock PDF"}
      </button>

      {unlockedUrl && (
        <div className="mt-6">
          <a
            href={unlockedUrl}
            download="unlocked.pdf"
            className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            📥 Download Unlocked PDF
          </a>
        </div>
      )}
    </section>
  );
}
