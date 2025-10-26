"use client";
import { useState } from "react";
import { PDFDocument, degrees } from "pdf-lib";

export default function PDFRotateTool() {
  const [file, setFile] = useState<File | null>(null);
  const [rotatedUrl, setRotatedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rotation, setRotation] = useState(90);

  async function handleRotate() {
    if (!file) return;
    setLoading(true);
    try {
      const bytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes);
      const pages = pdfDoc.getPages();
      
      pages.forEach((page) => {
        page.setRotation(degrees(rotation));
      });
      
      const rotatedBytes = await pdfDoc.save();
      const blob = new Blob([rotatedBytes as any], { type: "application/pdf" });
      setRotatedUrl(URL.createObjectURL(blob));
    } catch (error) {
      alert("Error rotating PDF: " + error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">🔄 Rotate PDF</h2>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => {
          setFile(e.target.files?.[0] || null);
          setRotatedUrl(null);
        }}
        className="mb-4 block w-full border rounded px-3 py-2"
      />
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Rotation Angle:</label>
        <select 
          value={rotation} 
          onChange={(e) => setRotation(Number(e.target.value))}
          className="border rounded px-3 py-2"
        >
          <option value={90}>90° Clockwise</option>
          <option value={180}>180°</option>
          <option value={270}>270° (90° Counter-clockwise)</option>
        </select>
      </div>
      
      <button
        onClick={handleRotate}
        disabled={!file || loading}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "Rotating..." : "Rotate PDF"}
      </button>

      {rotatedUrl && (
        <div className="mt-6">
          <a
            href={rotatedUrl}
            download="rotated.pdf"
            className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            📥 Download Rotated PDF
          </a>
        </div>
      )}
    </section>
  );
}
