"use client";
import { useState } from "react";

export default function ImageConverterTool() {
  const [file, setFile] = useState<File | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [format, setFormat] = useState("png");

  async function handleConvert() {
    if (!file) return;
    setLoading(true);
    try {
      const img = new Image();
      const reader = new FileReader();
      
      reader.onload = (e) => {
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0);
          
          canvas.toBlob((blob) => {
            if (blob) {
              setConvertedUrl(URL.createObjectURL(blob));
            }
            setLoading(false);
          }, `image/${format}`);
        };
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      alert("Error converting image: " + error);
      setLoading(false);
    }
  }

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">🖼️ Image Converter</h2>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          setFile(e.target.files?.[0] || null);
          setConvertedUrl(null);
        }}
        className="mb-4 block w-full border rounded px-3 py-2"
      />
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Convert to:</label>
        <select 
          value={format} 
          onChange={(e) => setFormat(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="png">PNG</option>
          <option value="jpeg">JPEG</option>
          <option value="webp">WebP</option>
        </select>
      </div>
      
      <button
        onClick={handleConvert}
        disabled={!file || loading}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "Converting..." : "Convert Image"}
      </button>

      {convertedUrl && (
        <div className="mt-6">
          <a
            href={convertedUrl}
            download={`converted.${format}`}
            className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            📥 Download {format.toUpperCase()}
          </a>
        </div>
      )}
    </section>
  );
}