"use client";
import { useState } from "react";

export default function PDFProtectTool() {
  const [file, setFile] = useState<File | null>(null);

  function handleProtect() {
    alert("PDF password protection requires backend or PDF-lib encryption.");
  }

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">🔐 PDF Protect</h2>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4 block w-full border rounded px-3 py-2"
      />
      <button
        onClick={handleProtect}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Protect PDF
      </button>
    </section>
  );
}
