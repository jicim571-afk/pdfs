"use client";
import { useState, useCallback } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import mammoth from "mammoth";

interface ConversionSettings {
  fontName: typeof StandardFonts[keyof typeof StandardFonts];
  fontSize: number;
  preserveImages: boolean;
  imageQuality: number;
  marginSize: number;
  lineSpacing: number;
  textColor: [number, number, number];
}

interface ConversionStats {
  textLength: number;
  pageCount: number;
  imageCount: number;
  conversionTime: number;
}

export default function WordToPDFTool() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ConversionStats | null>(null);
  const [settings, setSettings] = useState<ConversionSettings>({
    fontName: StandardFonts.TimesRoman,
    fontSize: 12,
    preserveImages: true,
    imageQuality: 0.95,
    marginSize: 50,
    lineSpacing: 1.5,
    textColor: [0, 0, 0]
  });
  
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFile(file);
    setPdfUrl(null);
    setError(null);
    setStats(null);
    
    try {
      // Generate preview
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      setPreview(result.value);
    } catch (err) {
      setError("Failed to read document: " + String(err));
    }
  }, []);

  async function convertImagesToPDF(images: HTMLImageElement[], pdfDoc: PDFDocument) {
    for (const img of images) {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) continue;
      
      ctx.drawImage(img, 0, 0);
      const imgData = canvas.toDataURL('image/jpeg', settings.imageQuality);
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
    
    const startTime = performance.now();
    
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
      
      if (settings.preserveImages && imageElements.length > 0) {
        setProgress(`Processing ${imageElements.length} images...`);
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
      const font = await pdfDoc.embedFont(settings.fontName);
      
      // Convert text content
      const textContent = container.innerText;
      const lines = textContent.split('\n').filter(line => line.trim());
      
      let currentPage = pdfDoc.addPage([595, 842]); // A4
      let y = currentPage.getHeight() - settings.marginSize;
      const lineHeight = settings.fontSize * settings.lineSpacing;
      
      for (const line of lines) {
        if (y < settings.marginSize) {
          currentPage = pdfDoc.addPage([595, 842]);
          y = currentPage.getHeight() - settings.marginSize;
        }
        
        currentPage.drawText(line, {
          x: settings.marginSize,
          y,
          size: settings.fontSize,
          font,
          color: rgb(...settings.textColor),
        });
        
        y -= lineHeight;
      }
      
      // Add images if enabled
      if (settings.preserveImages && images.length > 0) {
        await convertImagesToPDF(images, pdfDoc);
      }
      
      const pdfBytes = await pdfDoc.save();
      
      // Cleanup previous URL
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }

      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      setPdfUrl(URL.createObjectURL(blob));
      
      // Update statistics
      setStats({
        textLength: textContent.length,
        pageCount: pdfDoc.getPageCount(),
        imageCount: images.length,
        conversionTime: Math.round(performance.now() - startTime)
      });
      
    } catch (err) {
      console.error('Word to PDF conversion failed:', err);
      setError(String(err));
    } finally {
      setLoading(false);
      setProgress("");
    }
  }

  return (
    <section className="bg-white p-6 rounded-lg shadow-lg">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-2">📝 Word to PDF Converter</h2>
        <p className="text-sm text-slate-600">
          Convert Word documents (.docx) to PDF format with customizable settings.
          Preserves text formatting and images. All processing happens in your browser.
        </p>
      </div>

      <div className="space-y-6">
        {/* File Upload */}
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-blue-400 transition">
          <input
            type="file"
            accept=".docx"
            onChange={handleFileChange}
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

        {/* Preview */}
        {preview && (
          <div className="bg-slate-50 rounded-xl p-4">
            <h3 className="font-medium text-slate-800 mb-2">Document Preview:</h3>
            <div 
              className="prose prose-sm max-h-60 overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: preview }}
            />
          </div>
        )}

        {/* Conversion Settings */}
        {file && (
          <div className="space-y-4">
            <h3 className="font-medium text-slate-800">Conversion Settings:</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Font Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Font:
                </label>
                <select
                  value={settings.fontName}
                  onChange={(e) => setSettings(s => ({
                    ...s,
                    fontName: e.target.value as typeof settings.fontName
                  }))}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  {Object.values(StandardFonts).map(font => (
                    <option key={font} value={font}>
                      {font.replace(/([A-Z])/g, ' $1').trim()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Font Size */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Font Size: {settings.fontSize}pt
                </label>
                <input
                  type="range"
                  min="8"
                  max="24"
                  value={settings.fontSize}
                  onChange={(e) => setSettings(s => ({
                    ...s,
                    fontSize: parseInt(e.target.value)
                  }))}
                  className="w-full"
                />
              </div>

              {/* Line Spacing */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Line Spacing: {settings.lineSpacing}x
                </label>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={settings.lineSpacing}
                  onChange={(e) => setSettings(s => ({
                    ...s,
                    lineSpacing: parseFloat(e.target.value)
                  }))}
                  className="w-full"
                />
              </div>

              {/* Margin Size */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Margin Size: {settings.marginSize}pt
                </label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={settings.marginSize}
                  onChange={(e) => setSettings(s => ({
                    ...s,
                    marginSize: parseInt(e.target.value)
                  }))}
                  className="w-full"
                />
              </div>
            </div>

            {/* Image Settings */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.preserveImages}
                  onChange={(e) => setSettings(s => ({
                    ...s,
                    preserveImages: e.target.checked
                  }))}
                  className="rounded border-slate-300 text-blue-600"
                />
                <label className="text-sm text-slate-700">
                  Preserve Images
                </label>
              </div>

              {settings.preserveImages && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Image Quality: {Math.round(settings.imageQuality * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={settings.imageQuality}
                    onChange={(e) => setSettings(s => ({
                      ...s,
                      imageQuality: parseFloat(e.target.value)
                    }))}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        {progress && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <svg className="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              <p className="text-sm text-blue-700">{progress}</p>
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
          disabled={!file || loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 
            rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 
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

        {/* Results */}
        {stats && pdfUrl && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-slate-500">Pages</p>
                <p className="font-medium">{stats.pageCount}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Text Length</p>
                <p className="font-medium">{stats.textLength.toLocaleString()} chars</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Images</p>
                <p className="font-medium">{stats.imageCount}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Processing Time</p>
                <p className="font-medium">{(stats.conversionTime / 1000).toFixed(1)}s</p>
              </div>
            </div>
            
            <div className="text-center">
              <a
                href={pdfUrl}
                download={file?.name.replace(/\.docx?$/, '') + '.pdf'}
                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-2 
                  rounded-lg hover:bg-green-700 transition-colors"
              >
                <span>📥</span>
                <span>Download PDF</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
