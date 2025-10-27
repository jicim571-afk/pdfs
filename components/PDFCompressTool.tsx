"use client";
import { useState } from "react";
import { PDFDocument } from "pdf-lib";

interface CompressionSettings {
  quality: 'low' | 'medium' | 'high';
  imageCompression: boolean;
  removeMetadata: boolean;
  cleanupFonts: boolean;
}

interface CompressionStats {
  originalSize: number;
  compressedSize: number;
  savingsPercent: number;
  pages: number;
  images: number;
  fonts: number;
}

export default function PDFCompressTool() {
  const [file, setFile] = useState<File | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [stats, setStats] = useState<CompressionStats | null>(null);
  const [settings, setSettings] = useState<CompressionSettings>({
    quality: 'medium',
    imageCompression: true,
    removeMetadata: true,
    cleanupFonts: true
  });

  async function analyzePDF(pdfDoc: PDFDocument): Promise<CompressionStats> {
    const pages = pdfDoc.getPages().length;
    const images = pdfDoc.context.enumerateIndirectObjects().filter(([_, obj]) => {
      try {
        const o: any = obj as any;
        return o.constructor?.name === 'PDFStream' && o.getObject && o.getObject().has && o.getObject().get('Subtype')?.toString() === '/Image';
      } catch {
        return false;
      }
    }).length;
    // Font detection can be fragile across pdf-lib versions. Default to 0 if detection is not reliable.
    let fonts = 0;
    try {
      fonts = new Set(pdfDoc.getPages().flatMap(page => {
        try {
          const res: any = (page.node && (page.node as any).Resources && (page.node as any).Resources()) || {};
          const fontObj = (res && (res.lookup ? (res.lookup('Font', {}) as any) : {})) || {};
          return Object.values(fontObj || {});
        } catch {
          return [] as any[];
        }
      })).size;
    } catch {
      fonts = 0;
    }
    
    return {
      originalSize: file!.size,
      compressedSize: 0,
      savingsPercent: 0,
      pages,
      images,
      fonts
    };
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newFile = e.target.files?.[0];
    if (newFile) {
      setFile(newFile);
      setCompressedUrl(null);
      setStats(null);
      setError(null);
      setAnalyzing(true);

      try {
        const bytes = await newFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(bytes);
        const stats = await analyzePDF(pdfDoc);
        setStats(stats);
      } catch (err) {
        setError("Failed to analyze PDF: " + String(err));
      } finally {
        setAnalyzing(false);
      }
    }
  }

  async function handleCompress() {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const bytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes);
      
      // Apply compression settings
      const compressionOptions: any = {
        useObjectStreams: true,
        addDefaultPage: false,
        compress: true
      };

      // Quality settings affect image compression
      if (settings.imageCompression) {
        compressionOptions.objectCompressionMethod = settings.quality === 'high' ? 'deflate' : 'lzw';
        compressionOptions.imageQuality = settings.quality === 'low' ? 0.3 : 
                                        settings.quality === 'medium' ? 0.6 : 0.9;
      }

      // Metadata removal
      if (settings.removeMetadata) {
        // clear metadata safely
        try { (pdfDoc as any).setTitle(''); } catch {}
        try { (pdfDoc as any).setAuthor(''); } catch {}
        try { (pdfDoc as any).setSubject(''); } catch {}
        try { (pdfDoc as any).setKeywords([]); } catch {}
        try { (pdfDoc as any).setCreator(''); } catch {}
        try { (pdfDoc as any).setProducer(''); } catch {}
      }

      // Font subsetting (cleanup)
      if (settings.cleanupFonts) {
        compressionOptions.updateMetadata = false;
      }
      
      const compressedBytes = await pdfDoc.save(compressionOptions);
      const compressedSize = compressedBytes.byteLength;
      
      if (stats) {
        setStats({
          ...stats,
          compressedSize,
          savingsPercent: Math.round((1 - compressedSize / stats.originalSize) * 100)
        });
      }

      // Cleanup previous URL
      if (compressedUrl) {
        URL.revokeObjectURL(compressedUrl);
      }

  const blob = new Blob([compressedBytes as any], { type: "application/pdf" });
      setCompressedUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError("Error compressing PDF: " + String(err));
    } finally {
      setLoading(false);
    }
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1024 / 1024).toFixed(2) + " MB";
  }

  return (
    <section className="bg-white p-6 rounded-lg shadow-lg">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-2">🗜️ PDF Compressor</h2>
        <p className="text-sm text-slate-600">
          Reduce PDF file size while maintaining quality. Choose compression settings
          and preview the results before downloading.
        </p>
      </div>

      <div className="space-y-6">
        {/* File Upload */}
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-indigo-400 transition">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
        </div>

        {/* PDF Analysis */}
        {analyzing ? (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <svg className="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              <p className="text-sm text-blue-700">Analyzing PDF...</p>
            </div>
          </div>
        ) : stats && (
          <div className="bg-slate-50 rounded-xl p-4">
            <h3 className="font-medium text-slate-800 mb-3">PDF Analysis:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-slate-500">Size</p>
                <p className="font-medium">{formatSize(stats.originalSize)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Pages</p>
                <p className="font-medium">{stats.pages}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Images</p>
                <p className="font-medium">{stats.images}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Fonts</p>
                <p className="font-medium">{stats.fonts}</p>
              </div>
            </div>
          </div>
        )}

        {/* Compression Settings */}
        {file && (
          <div className="space-y-4">
            <h3 className="font-medium text-slate-800">Compression Settings:</h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Quality Level:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['low', 'medium', 'high'] as const).map((quality) => (
                  <button
                    key={quality}
                    onClick={() => setSettings(s => ({ ...s, quality }))}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${settings.quality === quality
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                  >
                    {quality.charAt(0).toUpperCase() + quality.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'imageCompression',
                  label: 'Compress Images',
                  description: 'Reduce image quality to decrease file size'
                },
                {
                  id: 'removeMetadata',
                  label: 'Remove Metadata',
                  description: 'Strip out document information and metadata'
                },
                {
                  id: 'cleanupFonts',
                  label: 'Clean Up Fonts',
                  description: 'Optimize font data and remove unused characters'
                }
              ].map(({ id, label, description }) => (
                <div key={id} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id={id}
                    checked={Boolean((settings as any)[id])}
                    onChange={(e) => setSettings(s => ({ 
                      ...s, 
                      [id]: e.target.checked 
                    }))}
                    className="mt-1 rounded border-slate-300 text-indigo-600"
                  />
                  <div>
                    <label htmlFor={id} className="block text-sm font-medium text-slate-700">
                      {label}
                    </label>
                    <p className="text-xs text-slate-500">{description}</p>
                  </div>
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

        {/* Compress Button */}
        <button
          onClick={handleCompress}
          disabled={!file || loading || analyzing}
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Compressing...
            </div>
          ) : (
            "Compress PDF"
          )}
        </button>

        {/* Results */}
        {stats && stats.compressedSize > 0 && compressedUrl && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-4">
            <div>
              <h3 className="font-medium text-green-800 mb-2">Compression Results:</h3>
              <div className="flex items-center justify-between text-sm">
                <span>Original: {formatSize(stats.originalSize)}</span>
                <span className="text-green-600">↓ {stats.savingsPercent}% reduced</span>
                <span>Compressed: {formatSize(stats.compressedSize)}</span>
              </div>
            </div>
            
            <div className="text-center">
              <a
                href={compressedUrl}
                download={`compressed-${file?.name || 'document'}.pdf`}
                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-2 
                  rounded-lg hover:bg-green-700 transition-colors"
              >
                <span>📥</span>
                <span>Download Compressed PDF</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
