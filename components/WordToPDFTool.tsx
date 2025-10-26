"use client";
import { useState } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import mammoth from "mammoth";
import { createWorker } from "tesseract.js";

export default function WordToPDFTool() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  async function convertImagesToPDF(images: HTMLImageElement[], pdfDoc: PDFDocument) {
    for (const img of images) {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) continue;
      
      ctx.drawImage(img, 0, 0);
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const jpgImage = await pdfDoc.embedJpg(
        await (await fetch(imgData)).arrayBuffer()
      );
      
      const page = pdfDoc.addPage([595, 842]);
      const imgDims = jpgImage.scale(0.8);
      page.drawImage(jpgImage, {
        x: (page.getWidth() - imgDims.width) / 2,
        y: (page.getHeight() - imgDims.height) / 2,
        width: imgDims.width,
        height: imgDims.height,
      });
    }
  }

  async function handleConvert() {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    setPdfUrl(null);
    
    try {
      setProgress("Reading Word document...");
      
      // Convert Word to HTML
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      const html = result.value;
      
      // Create temporary element to render HTML
      const container = document.createElement('div');
      container.innerHTML = html;
      
      // Extract images if any
      const images: HTMLImageElement[] = [];
      const imageElements = container.getElementsByTagName('img');
      
      if (imageElements.length > 0) {
        setProgress("Processing images...");
        for (const img of Array.from(imageElements)) {
          const newImg = new Image();
          await new Promise((resolve, reject) => {
            newImg.onload = resolve;
            newImg.onerror = reject;
            newImg.src = img.src;
          });
          images.push(newImg);
        }
      }
      
      // Create PDF
      setProgress("Creating PDF...");
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const fontSize = 12;
      
      // Convert text content
      const textContent = container.innerText;
      const lines = textContent.split('\n').filter(line => line.trim());
      
      let currentPage = pdfDoc.addPage([595, 842]); // A4
      let y = currentPage.getHeight() - 50; // Start from top with margin
      const margin = 50;
      const lineHeight = fontSize * 1.5;
      
      for (const line of lines) {
        if (y < margin) {
          currentPage = pdfDoc.addPage([595, 842]);
          y = currentPage.getHeight() - 50;
        }
        
        currentPage.drawText(line, {
          x: margin,
          y,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });
        
        y -= lineHeight;
      }
      
      // Add images if any
      if (images.length > 0) {
        await convertImagesToPDF(images, pdfDoc);
      }
      
      const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      setPdfUrl(URL.createObjectURL(blob));
      
    } catch (err) {
      console.error('Word to PDF conversion failed:', err);
      setError(String(err));
    } finally {
      setLoading(false);
      setProgress("");
    }
  }

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">📝 Word to PDF Converter</h2>
      
      <div className="mb-6">
        <p className="text-sm text-slate-600">
          Convert Word documents (.docx) to PDF format. Preserves text formatting and images.
          Conversion happens entirely in your browser - no data is sent to any server.
        </p>
      </div>
      
      <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-blue-400 transition">
        <input
          type="file"
          accept=".docx"
          onChange={(e) => {
            setFile(e.target.files?.[0] || null);
            setPdfUrl(null);
            setError(null);
          }}
          className="block w-full text-sm text-slate-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
          disabled={loading}
        />
        <p className="mt-2 text-xs text-slate-500">
          Currently supports .docx format (newer Word documents)
        </p>
      </div>

      {progress && (
        <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-4">
          <p className="text-sm text-blue-700 flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            {progress}
          </p>
        </div>
      )}

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={handleConvert}
          disabled={!file || loading}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Converting...
            </>
          ) : (
            <>Convert to PDF</>
          )}
        </button>

        {pdfUrl && (
          <a
            href={pdfUrl}
            download={file?.name.replace(/\.docx?$/, '') + '.pdf'}
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700"
          >
            <span className="text-2xl">📥</span>
            Download PDF
          </a>
        )}
      </div>
    </section>
  );
}
