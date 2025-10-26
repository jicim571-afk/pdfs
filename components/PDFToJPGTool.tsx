"use client";
import { useState } from "react";

export default function PDFToJPGTool() {
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleConvert() {
    if (!file) return;
    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const typedArray = new Uint8Array(reader.result as ArrayBuffer);
        const pdfjsLib = (await import("pdfjs-dist")) as any;
        pdfjsLib.GlobalWorkerOptions = pdfjsLib.GlobalWorkerOptions || {};
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://unpkg.com/pdfjs-dist@5.4.296/build/pdf.worker.min.js";

        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
        const imgs: string[] = [];

        // convert first few pages (or all) - limit to 5 to avoid heavy work
        const pageCount = Math.min(pdf.numPages, 5);
        for (let i = 1; i <= pageCount; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement("canvas");
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);
          const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

          const renderContext = {
            canvasContext: ctx,
            viewport,
          };
          await page.render(renderContext).promise;
          imgs.push(canvas.toDataURL("image/jpeg", 0.85));
        }

        setImages(imgs);
        setLoading(false);
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error(err);
      alert("Failed to convert PDF to JPG: " + String(err));
      setLoading(false);
    }
  }

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">🖼️ PDF to JPG</h2>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4 block w-full border rounded px-3 py-2"
      />
      <button
        onClick={handleConvert}
        disabled={!file || loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Converting..." : "Convert to JPG"}
      </button>

      {images.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {images.map((src, i) => (
            <div key={i} className="bg-gray-50 p-2 rounded">
              <img src={src} alt={`page-${i + 1}`} className="w-full h-auto" />
              <a href={src} download={`page-${i + 1}.jpg`} className="text-green-600 underline block mt-2">
                📥 Download Page {i + 1}
              </a>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
