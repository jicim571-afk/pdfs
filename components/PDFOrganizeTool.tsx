"use client";
import { useState } from "react";
import { PDFDocument } from "pdf-lib";

export default function PDFOrganizeTool() {
  const [file, setFile] = useState<File | null>(null);
  const [organizedUrl, setOrganizedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pageOrder, setPageOrder] = useState("");

  async function handleOrganize() {
    if (!file || !pageOrder.trim()) return;
    setLoading(true);
    try {
      const bytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes);
      const totalPages = pdfDoc.getPageCount();
      
      const pages = pageOrder.split(',').map(p => p.trim());
      const pageIndices: number[] = [];
      
      for (const p of pages) {
        if (p.includes('-')) {
          const [start, end] = p.split('-').map(n => parseInt(n.trim()));
          for (let i = start; i <= end; i++) {
            if (i >= 1 && i <= totalPages) pageIndices.push(i - 1);
          }
        } else {
          const num = parseInt(p);
          if (num >= 1 && num <= totalPages) pageIndices.push(num - 1);
        }
      }
      
      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
      copiedPages.forEach(page => newPdf.addPage(page));
      
      const organizedBytes = await newPdf.save();
      const blob = new Blob([organizedBytes as any], { type: "application/pdf" });
      setOrganizedUrl(URL.createObjectURL(blob));
    } catch (error) {
      alert("Error organizing PDF: " + error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">📑 Organize PDF Pages</h2>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => {
          setFile(e.target.files?.[0] || null);
          setOrganizedUrl(null);
        }}
        className="mb-4 block w-full border rounded px-3 py-2"
      />
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Page Order:</label>
        <input 
          type="text" 
          value={pageOrder}
          onChange={(e) => setPageOrder(e.target.value)}
          placeholder="e.g., 1,3,2 or 1-3,5,7-9"
          className="border rounded px-3 py-2 w-full"
        />
        <p className="text-xs text-slate-500 mt-1">Enter page numbers separated by commas. Use dashes for ranges.</p>
      </div>
      
      <button
        onClick={handleOrganize}
        disabled={!file || !pageOrder.trim() || loading}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "Organizing..." : "Organize Pages"}
      </button>

      {organizedUrl && (
        <div className="mt-6">
          <a
            href={organizedUrl}
            download="organized.pdf"
            className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            📥 Download Organized PDF
          </a>
        </div>
      )}
    </section>
  );
}
