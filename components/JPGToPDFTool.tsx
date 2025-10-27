"use client";
import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";

interface ImageFile {
  file: File;
  preview: string;
  order: number;
}

interface PageSettings {
  pageSize: 'A4' | 'letter' | 'legal' | 'fit';
  orientation: 'portrait' | 'landscape';
  margin: number;
  quality: number;
}

const PAGE_SIZES = {
  A4: { width: 595.276, height: 841.890 },
  letter: { width: 612, height: 792 },
  legal: { width: 612, height: 1008 }
};

export default function JPGToPDFTool() {
  const [files, setFiles] = useState<ImageFile[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<PageSettings>({
    pageSize: 'A4',
    orientation: 'portrait',
    margin: 20,
    quality: 0.8
  });

  const createPreview = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newFiles = Array.from(e.target.files || []);
    setError(null);
    setPdfUrl(null);

    try {
      const imageFiles: ImageFile[] = await Promise.all(
        newFiles.map(async (file, index) => ({
          file,
          preview: await createPreview(file),
          order: index
        }))
      );
      setFiles(imageFiles);
    } catch (err) {
      setError("Failed to load image previews. Please try again.");
    }
  }

  const reorderFiles = (dragIndex: number, dropIndex: number) => {
    setFiles(files => {
      const newFiles = [...files];
      const [draggedItem] = newFiles.splice(dragIndex, 1);
      newFiles.splice(dropIndex, 0, draggedItem);
      return newFiles.map((file, index) => ({ ...file, order: index }));
    });
  };

  async function handleConvert() {
    if (files.length === 0) return;
    setLoading(true);
    setError(null);

    try {
      const pdfDoc = await PDFDocument.create();
      
      for (const { file } of files) {
        const imgBytes = await file.arrayBuffer();
        const img = await pdfDoc.embedJpg(imgBytes);
        
        let pageWidth, pageHeight;
        
        if (settings.pageSize === 'fit') {
          pageWidth = img.width;
          pageHeight = img.height;
        } else {
          const size = PAGE_SIZES[settings.pageSize];
          if (settings.orientation === 'portrait') {
            pageWidth = size.width;
            pageHeight = size.height;
          } else {
            pageWidth = size.height;
            pageHeight = size.width;
          }
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);
        
        // Calculate image dimensions to fit within margins
        const availableWidth = pageWidth - (settings.margin * 2);
        const availableHeight = pageHeight - (settings.margin * 2);
        const aspectRatio = img.width / img.height;
        
        let finalWidth = availableWidth;
        let finalHeight = availableWidth / aspectRatio;
        
        if (finalHeight > availableHeight) {
          finalHeight = availableHeight;
          finalWidth = availableHeight * aspectRatio;
        }
        
        // Center the image on the page
        const x = (pageWidth - finalWidth) / 2;
        const y = (pageHeight - finalHeight) / 2;
        
        page.drawImage(img, {
          x,
          y,
          width: finalWidth,
          height: finalHeight,
          opacity: settings.quality
        });
      }

  const pdfBytes = await pdfDoc.save();
  // pdfBytes is a Uint8Array - cast to any to satisfy Blob typing in TS
  const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      
      // Cleanup previous URL
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
      
      setPdfUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError("Failed to convert images to PDF: " + String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-white p-6 rounded-lg shadow-lg">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-2">🖼️ JPG to PDF Converter</h2>
        <p className="text-sm text-slate-600">
          Convert multiple JPG images to a single PDF. Customize page size, orientation,
          and quality settings. Drag and drop to reorder pages.
        </p>
      </div>

      <div className="space-y-6">
        {/* File Upload */}
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-blue-400 transition">
          <input
            type="file"
            accept="image/jpeg"
            multiple
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        {/* Settings */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Page Size:
            </label>
            <select
              value={settings.pageSize}
              onChange={(e) => setSettings(s => ({ 
                ...s, 
                pageSize: e.target.value as PageSettings['pageSize']
              }))}
              className="w-full border rounded-lg px-3 py-2 bg-white"
            >
              <option value="A4">A4</option>
              <option value="letter">Letter</option>
              <option value="legal">Legal</option>
              <option value="fit">Fit to Image</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Orientation:
            </label>
            <select
              value={settings.orientation}
              onChange={(e) => setSettings(s => ({ 
                ...s, 
                orientation: e.target.value as PageSettings['orientation']
              }))}
              className="w-full border rounded-lg px-3 py-2 bg-white"
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Margin (points): {settings.margin}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.margin}
              onChange={(e) => setSettings(s => ({ 
                ...s, 
                margin: parseInt(e.target.value)
              }))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Quality: {Math.round(settings.quality * 100)}%
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={settings.quality}
              onChange={(e) => setSettings(s => ({ 
                ...s, 
                quality: parseFloat(e.target.value)
              }))}
              className="w-full"
            />
          </div>
        </div>

        {/* Image Previews */}
        {files.length > 0 && (
          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">
              Selected Images ({files.length}):
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="relative group border rounded-lg p-2 bg-slate-50"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', String(index))}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
                    reorderFiles(dragIndex, index);
                  }}
                >
                  <img
                    src={file.preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded"
                  />
                  <button
                    onClick={() => setFiles(files.filter((_, i) => i !== index))}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full 
                      opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                  <p className="text-center text-sm text-slate-600 mt-1">
                    Page {index + 1}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-red-500 text-xl">⚠️</span>
              <div>
                <p className="font-semibold text-red-800">Error</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Convert Button */}
        <button
          onClick={handleConvert}
          disabled={files.length === 0 || loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Converting...
            </div>
          ) : (
            "Convert to PDF"
          )}
        </button>

        {/* Download Button */}
        {pdfUrl && (
          <div className="text-center">
            <a
              href={pdfUrl}
              download="converted.pdf"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-2 
                rounded-lg hover:bg-green-700 transition-colors"
            >
              <span>📥</span>
              <span>Download PDF</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
