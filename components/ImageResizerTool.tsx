"use client";
import { useState } from "react";

export default function ImageResizerTool() {
  const [file, setFile] = useState<File | null>(null);
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);

  async function handleResize() {
    if (!file) return;
    setLoading(true);
    try {
      const img = new Image();
      const reader = new FileReader();
      
      reader.onload = (e) => {
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            if (blob) {
              setResizedUrl(URL.createObjectURL(blob));
            }
            setLoading(false);
          }, file.type);
        };
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      alert("Error resizing image: " + error);
      setLoading(false);
    }
  }

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">📐 Image Resizer</h2>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          setFile(e.target.files?.[0] || null);
          setResizedUrl(null);
        }}
        className="mb-4 block w-full border rounded px-3 py-2"
      />
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">Width (px):</label>
          <input 
            type="number" 
            value={width} 
            onChange={(e) => setWidth(Number(e.target.value))}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Height (px):</label>
          <input 
            type="number" 
            value={height} 
            onChange={(e) => setHeight(Number(e.target.value))}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
      </div>
      
      <button
        onClick={handleResize}
        disabled={!file || loading}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "Resizing..." : "Resize Image"}
      </button>

      {resizedUrl && (
        <div className="mt-6">
          <img src={resizedUrl} alt="Resized preview" className="max-w-xs border rounded mb-2" />
          <a
            href={resizedUrl}
            download="resized-image.png"
            className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            📥 Download Resized Image
          </a>
        </div>
      )}
    </section>
  );
}
