"use client";
import { useState } from "react";
import { PDFDocument, rgb, degrees } from "pdf-lib";

interface WatermarkStyle {
  text: string;
  color: string;
  opacity: number;
  fontSize: number;
  rotation: number;
  repeat: boolean;
}

export default function PDFWatermarkTool() {
  const [file, setFile] = useState<File | null>(null);
  const [watermarkedUrl, setWatermarkedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [style, setStyle] = useState<WatermarkStyle>({
    text: "CONFIDENTIAL",
    color: "#ff0000",
    opacity: 0.3,
    fontSize: 48,
    rotation: 45,
    repeat: true
  });

  async function handleWatermark() {
    if (!file || !style.text.trim()) return;
    
    setLoading(true);
    setWatermarkedUrl(null);
    
    try {
      const bytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes);
      const pages = pdfDoc.getPages();
      
      // Parse color
      const color = style.color.match(/^#([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i);
      const watermarkColor = color ? 
        rgb(parseInt(color[1], 16) / 255, parseInt(color[2], 16) / 255, parseInt(color[3], 16) / 255) :
        rgb(1, 0, 0);
      
      pages.forEach((page) => {
        const { width, height } = page.getSize();
        
        if (style.repeat) {
          // Create repeating pattern
          const xCount = Math.ceil(width / (style.fontSize * 5));
          const yCount = Math.ceil(height / (style.fontSize * 2));
          const xGap = width / xCount;
          const yGap = height / yCount;
          
          for (let x = 0; x <= xCount; x++) {
            for (let y = 0; y <= yCount; y++) {
              page.drawText(style.text, {
                x: x * xGap,
                y: y * yGap,
                size: style.fontSize,
                color: watermarkColor,
                opacity: style.opacity,
                rotate: degrees(style.rotation),
              });
            }
          }
        } else {
          // Single centered watermark
          const textWidth = style.text.length * (style.fontSize * 0.5);
          const x = (width - textWidth) / 2;
          const y = height / 2;
          
          page.drawText(style.text, {
            x,
            y,
            size: style.fontSize,
            color: watermarkColor,
            opacity: style.opacity,
            rotate: degrees(style.rotation),
          });
        }
      });
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
      setWatermarkedUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error("Failed to add watermark:", err);
      alert("Failed to add watermark: " + String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">💧 PDF Watermark Tool</h2>
      
      <div className="mb-6">
        <p className="text-sm text-slate-600">
          Add text watermarks to your PDF documents. Customize text, color, opacity, and placement.
          Everything happens in your browser - no data is sent to any server.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Watermark Text:
          </label>
          <input
            type="text"
            value={style.text}
            onChange={(e) => setStyle({ ...style, text: e.target.value })}
            placeholder="e.g., CONFIDENTIAL"
            className="w-full border rounded-lg px-3 py-2"
            maxLength={50}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Font Size:
          </label>
          <select
            value={style.fontSize}
            onChange={(e) => setStyle({ ...style, fontSize: parseInt(e.target.value) })}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="24">Small (24pt)</option>
            <option value="48">Medium (48pt)</option>
            <option value="72">Large (72pt)</option>
            <option value="96">Extra Large (96pt)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Color:
          </label>
          <input
            type="color"
            value={style.color}
            onChange={(e) => setStyle({ ...style, color: e.target.value })}
            className="w-full h-10 border rounded-lg"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Opacity:
          </label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={style.opacity}
            onChange={(e) => setStyle({ ...style, opacity: parseFloat(e.target.value) })}
            className="w-full"
          />
          <div className="text-xs text-slate-500 mt-1">
            {Math.round(style.opacity * 100)}% opacity
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rotation:
          </label>
          <input
            type="range"
            min="0"
            max="360"
            step="15"
            value={style.rotation}
            onChange={(e) => setStyle({ ...style, rotation: parseInt(e.target.value) })}
            className="w-full"
          />
          <div className="text-xs text-slate-500 mt-1">
            {style.rotation}° rotation
          </div>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="repeat"
            checked={style.repeat}
            onChange={(e) => setStyle({ ...style, repeat: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 mr-2"
          />
          <label htmlFor="repeat" className="text-sm text-gray-700">
            Repeat watermark across page
          </label>
        </div>
      </div>
      
      <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-blue-400 transition mb-6">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => {
            setFile(e.target.files?.[0] || null);
            setWatermarkedUrl(null);
          }}
          className="block w-full text-sm text-slate-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
          disabled={loading}
        />
      </div>
      
      <div className="flex justify-center gap-4">
        <button
          onClick={handleWatermark}
          disabled={!file || !style.text.trim() || loading}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Adding Watermark...
            </>
          ) : (
            <>Add Watermark</>
          )}
        </button>
        
        {watermarkedUrl && (
          <a
            href={watermarkedUrl}
            download="watermarked.pdf"
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
