"use client";
import { useState } from "react";

interface ConversionSettings {
  format: string;
  quality: number;
  maxWidth?: number;
  maxHeight?: number;
  maintainAspectRatio: boolean;
}

export default function ImageConverterTool() {
  const [file, setFile] = useState<File | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [settings, setSettings] = useState<ConversionSettings>({
    format: "png",
    quality: 0.8,
    maintainAspectRatio: true,
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setConvertedUrl(null);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleConvert() {
    if (!file) return;
    setLoading(true);
    setError(null);
    
    try {
      const img = new Image();
      const reader = new FileReader();
      
      reader.onload = (e) => {
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Apply size constraints if specified
          if (settings.maxWidth || settings.maxHeight) {
            const aspectRatio = width / height;

            if (settings.maxWidth && width > settings.maxWidth) {
              width = settings.maxWidth;
              height = settings.maintainAspectRatio ? width / aspectRatio : height;
            }

            if (settings.maxHeight && height > settings.maxHeight) {
              height = settings.maxHeight;
              width = settings.maintainAspectRatio ? height * aspectRatio : width;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          
          // Enable image smoothing for better quality
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(img, 0, 0, width, height);
          }
          
          const quality = settings.format === "png" ? undefined : settings.quality;
          canvas.toBlob(
            (blob) => {
              if (blob) {
                // Revoke previous URL to prevent memory leaks
                if (convertedUrl) {
                  URL.revokeObjectURL(convertedUrl);
                }
                setConvertedUrl(URL.createObjectURL(blob));
              } else {
                setError("Failed to convert image. Please try again.");
              }
              setLoading(false);
            },
            `image/${settings.format}`,
            quality
          );
        };

        img.onerror = () => {
          setError("Failed to load image. Please try a different file.");
          setLoading(false);
        };
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      setError("Error converting image: " + String(error));
      setLoading(false);
    }
  }

  return (
    <section className="bg-white p-6 rounded-lg shadow-lg">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-2">🖼️ Image Converter</h2>
        <p className="text-sm text-slate-600">
          Convert your images between different formats with custom quality settings.
          Supports PNG, JPEG, and WebP formats.
        </p>
      </div>

      <div className="space-y-6">
        {/* File Upload */}
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-indigo-400 transition">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
        </div>

        {/* Preview */}
        {preview && (
          <div className="mt-4">
            <p className="text-sm font-medium text-slate-700 mb-2">Preview:</p>
            <img
              src={preview}
              alt="Preview"
              className="max-w-full h-auto rounded-lg border shadow-sm"
              style={{ maxHeight: "300px" }}
            />
          </div>
        )}

        {/* Settings */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Output Format:
            </label>
            <select 
              value={settings.format}
              onChange={(e) => setSettings(s => ({ ...s, format: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 bg-white"
            >
              <option value="png">PNG</option>
              <option value="jpeg">JPEG</option>
              <option value="webp">WebP</option>
            </select>
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
              onChange={(e) => setSettings(s => ({ ...s, quality: parseFloat(e.target.value) }))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Max Width (optional):
            </label>
            <input
              type="number"
              value={settings.maxWidth || ""}
              onChange={(e) => setSettings(s => ({ 
                ...s, 
                maxWidth: e.target.value ? parseInt(e.target.value) : undefined 
              }))}
              placeholder="Original width"
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Max Height (optional):
            </label>
            <input
              type="number"
              value={settings.maxHeight || ""}
              onChange={(e) => setSettings(s => ({ 
                ...s, 
                maxHeight: e.target.value ? parseInt(e.target.value) : undefined 
              }))}
              placeholder="Original height"
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.maintainAspectRatio}
            onChange={(e) => setSettings(s => ({ 
              ...s, 
              maintainAspectRatio: e.target.checked 
            }))}
            className="rounded border-slate-300 text-indigo-600"
          />
          <label className="text-sm text-slate-700">
            Maintain aspect ratio when resizing
          </label>
        </div>

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
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 
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
            "Convert Image"
          )}
        </button>

        {/* Download Button */}
        {convertedUrl && (
          <div className="mt-6 text-center">
            <a
              href={convertedUrl}
              download={`converted.${settings.format}`}
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-2 
                rounded-lg hover:bg-green-700 transition-colors"
            >
              <span>📥</span>
              <span>Download {settings.format.toUpperCase()}</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}