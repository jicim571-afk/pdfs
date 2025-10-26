"use client";
import { useState, useRef } from "react";
import { PDFDocument } from "pdf-lib";
import html2canvas from "html2canvas";

export default function HTMLToPDFTool() {
  const [html, setHtml] = useState("");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleConvert() {
    if (!html.trim()) {
      setError("Please enter some HTML content first");
      return;
    }
    
    setLoading(true);
    setError(null);
    setPdfUrl(null);
    
    try {
      // Create a temporary div to render HTML
      const previewDiv = previewRef.current;
      if (!previewDiv) throw new Error("Preview element not found");
      
      // Set the HTML content
      previewDiv.innerHTML = html;
      
      // Convert to canvas
      const canvas = await html2canvas(previewDiv, {
        scale: 2.0, // Higher quality
        useCORS: true, // Allow loading external images
        logging: false,
        backgroundColor: "#ffffff"
      });

      // Create PDF
      const pdfDoc = await PDFDocument.create();
      
      // Calculate dimensions
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const imgBytes = await (await fetch(imgData)).arrayBuffer();
      const img = await pdfDoc.embedJpg(imgBytes);
      
      // Add page with proper dimensions
      const scaleFactor = Math.min(
        595 / canvas.width,  // A4 width in points
        842 / canvas.height  // A4 height in points
      );
      
      const page = pdfDoc.addPage([595, 842]); // A4 size
      page.drawImage(img, {
        x: 0,
        y: 0,
        width: canvas.width * scaleFactor,
        height: canvas.height * scaleFactor
      });

      // Generate PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err) {
      console.error("HTML to PDF conversion failed:", err);
      setError("Failed to convert HTML to PDF: " + String(err));
    } finally {
      setLoading(false);
      if (previewRef.current) {
        previewRef.current.innerHTML = '';
      }
    }
  }

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">🌐 HTML to PDF Converter</h2>
      
      <div className="mb-6">
        <p className="text-sm text-slate-600">
          Convert HTML code to PDF. Supports basic styling, images, and layouts.
          The conversion happens entirely in your browser - no data is sent to any server.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Input Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter HTML Code:
          </label>
          <textarea
            rows={12}
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            placeholder="<div style='color: blue;'>\n  <h1>Hello World</h1>\n  <p>This is a test</p>\n</div>"
            className="w-full font-mono text-sm border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        {/* Preview Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Live Preview:
          </label>
          <div
            className="w-full h-[300px] border rounded-lg p-4 overflow-auto bg-white"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>

      {/* Hidden render div */}
      <div ref={previewRef} className="hidden" />

      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={handleConvert}
          disabled={loading || !html.trim()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Converting...
            </>
          ) : "Generate PDF"}
        </button>

        {pdfUrl && (
          <a
            href={pdfUrl}
            download="converted.pdf"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700"
          >
            <span className="text-2xl">📥</span>
            Download PDF
          </a>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </section>
  );
}
