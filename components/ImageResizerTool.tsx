"use client";
import { useState, useEffect } from "react";

interface ResizeSettings {
  width: number;
  height: number;
  maintainAspectRatio: boolean;
  quality: number;
  resizeMode: 'dimensions' | 'percentage' | 'maxSize';
  percentage: number;
  maxSize: number;
}

export default function ImageResizerTool() {
  const [file, setFile] = useState<File | null>(null);
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);
  const [settings, setSettings] = useState<ResizeSettings>({
    width: 800,
    height: 600,
    maintainAspectRatio: true,
    quality: 0.8,
    resizeMode: 'dimensions',
    percentage: 50,
    maxSize: 1024,
  });

  function calculateDimensions(img: HTMLImageElement): { width: number; height: number } {
    let width = img.width;
    let height = img.height;
    
    switch (settings.resizeMode) {
      case 'percentage':
        width = Math.round(img.width * settings.percentage / 100);
        height = Math.round(img.height * settings.percentage / 100);
        break;
      case 'maxSize':
        if (Math.max(width, height) > settings.maxSize) {
          if (width > height) {
            height = Math.round(height * (settings.maxSize / width));
            width = settings.maxSize;
          } else {
            width = Math.round(width * (settings.maxSize / height));
            height = settings.maxSize;
          }
        }
        break;
      case 'dimensions':
      default:
        width = settings.width;
        height = settings.maintainAspectRatio 
          ? Math.round(img.height * (settings.width / img.width))
          : settings.height;
    }
    
    return { width, height };
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setResizedUrl(null);
      setError(null);

      // Create preview and get original dimensions
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setPreview(dataUrl);
        img.src = dataUrl;
        img.onload = () => {
          setOriginalDimensions({ width: img.width, height: img.height });
          // Update dimensions if using percentage or maxSize mode
          if (settings.resizeMode !== 'dimensions') {
            const { width, height } = calculateDimensions(img);
            setSettings(s => ({ ...s, width, height }));
          }
        };
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleResize() {
    if (!file) return;
    setLoading(true);
    setError(null);
    
    try {
      const img = new Image();
      const reader = new FileReader();
      
      reader.onload = (e) => {
        img.src = e.target?.result as string;
        img.onload = () => {
          const { width, height } = calculateDimensions(img);
          
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          
          if (ctx) {
            // Enable image smoothing for better quality
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(img, 0, 0, width, height);
          }
          
          // Cleanup previous URL
          if (resizedUrl) {
            URL.revokeObjectURL(resizedUrl);
          }

          canvas.toBlob(
            (blob) => {
              if (blob) {
                setResizedUrl(URL.createObjectURL(blob));
              } else {
                setError("Failed to resize image. Please try again.");
              }
              setLoading(false);
            },
            file.type,
            settings.quality
          );
        };

        img.onerror = () => {
          setError("Failed to load image. Please try a different file.");
          setLoading(false);
        };
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      setError("Error resizing image: " + String(error));
      setLoading(false);
    }
  }

  // Update dimensions when aspect ratio is toggled
  useEffect(() => {
    if (settings.maintainAspectRatio && originalDimensions && settings.resizeMode === 'dimensions') {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      setSettings(s => ({
        ...s,
        height: Math.round(s.width / aspectRatio)
      }));
    }
  }, [settings.maintainAspectRatio, settings.width, originalDimensions]);

  return (
    <section className="bg-white p-6 rounded-lg shadow-lg">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-2">📐 Image Resizer</h2>
        <p className="text-sm text-slate-600">
          Resize your images with precision. Choose between exact dimensions, 
          percentage scaling, or maximum size while maintaining quality.
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
              hover:file:bg-blue-100"
          />
        </div>

        {/* Preview */}
        {preview && (
          <div className="mt-4">
            <p className="text-sm font-medium text-slate-700 mb-2">Original Image:</p>
            <img
              src={preview}
              alt="Preview"
              className="max-w-full h-auto rounded-lg border shadow-sm"
              style={{ maxHeight: "300px" }}
            />
            {originalDimensions && (
              <p className="text-sm text-slate-600 mt-2">
                Original size: {originalDimensions.width} × {originalDimensions.height} pixels
              </p>
            )}
          </div>
        )}

        {/* Resize Mode Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Resize Mode:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {(['dimensions', 'percentage', 'maxSize'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setSettings(s => ({ ...s, resizeMode: mode }))}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${settings.resizeMode === mode
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
              >
                {mode === 'dimensions' ? 'Exact Dimensions' :
                 mode === 'percentage' ? 'Percentage Scale' :
                 'Maximum Size'}
              </button>
            ))}
          </div>
        </div>

        {/* Resize Settings */}
        <div className="space-y-4">
          {settings.resizeMode === 'dimensions' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Width (px):
                </label>
                <input 
                  type="number"
                  min="1"
                  value={settings.width}
                  onChange={(e) => setSettings(s => ({ 
                    ...s, 
                    width: Math.max(1, parseInt(e.target.value) || 1)
                  }))}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Height (px):
                </label>
                <input 
                  type="number"
                  min="1"
                  value={settings.height}
                  onChange={(e) => setSettings(s => ({ 
                    ...s, 
                    height: Math.max(1, parseInt(e.target.value) || 1)
                  }))}
                  disabled={settings.maintainAspectRatio}
                  className="w-full border rounded-lg px-3 py-2 disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>
            </div>
          )}

          {settings.resizeMode === 'percentage' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Scale Percentage: {settings.percentage}%
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={settings.percentage}
                onChange={(e) => setSettings(s => ({ 
                  ...s, 
                  percentage: parseInt(e.target.value)
                }))}
                className="w-full"
              />
            </div>
          )}

          {settings.resizeMode === 'maxSize' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Maximum Size (px): {settings.maxSize}
              </label>
              <input
                type="range"
                min="100"
                max="4096"
                step="100"
                value={settings.maxSize}
                onChange={(e) => setSettings(s => ({ 
                  ...s, 
                  maxSize: parseInt(e.target.value)
                }))}
                className="w-full"
              />
            </div>
          )}

          {/* Quality Setting */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Output Quality: {Math.round(settings.quality * 100)}%
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

          {/* Aspect Ratio Toggle */}
          {settings.resizeMode === 'dimensions' && (
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
                Maintain aspect ratio
              </label>
            </div>
          )}
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

        {/* Resize Button */}
        <button
          onClick={handleResize}
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
              Resizing...
            </div>
          ) : (
            "Resize Image"
          )}
        </button>

        {/* Result Preview */}
        {resizedUrl && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">Resized Image:</p>
              <img
                src={resizedUrl}
                alt="Resized preview"
                className="max-w-full h-auto rounded-lg border shadow-sm"
                style={{ maxHeight: "300px" }}
              />
            </div>
            
            <div className="text-center">
              <a
                href={resizedUrl}
                download={`resized-${file?.name || 'image'}`}
                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-2 
                  rounded-lg hover:bg-green-700 transition-colors"
              >
                <span>📥</span>
                <span>Download Resized Image</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
