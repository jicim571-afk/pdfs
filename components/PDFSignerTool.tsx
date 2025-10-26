"use client";
import { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";

export default function PDFSignerTool() {
  const [file, setFile] = useState<File | null>(null);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);

  function startDraw(e: React.MouseEvent) {
    setDrawing(true);
    const rect = (canvasRef.current as HTMLCanvasElement).getBoundingClientRect();
    const ctx = (canvasRef.current as HTMLCanvasElement).getContext("2d");
    if (!ctx) return;
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#111827";
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  }

  function draw(e: React.MouseEvent) {
    if (!drawing) return;
    const rect = (canvasRef.current as HTMLCanvasElement).getBoundingClientRect();
    const ctx = (canvasRef.current as HTMLCanvasElement).getContext("2d");
    if (!ctx) return;
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  }

  function endDraw() {
    setDrawing(false);
  }

  async function handleSign() {
    if (!file) return alert("Please choose a PDF file first.");
    try {
      const bytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes);
      const pages = pdfDoc.getPageCount();

      // Capture signature from canvas
      const canvas = canvasRef.current;
      if (!canvas) return alert("Please draw your signature on the canvas.");
      const sigDataUrl = canvas.toDataURL("image/png");
      const sigBytes = await (await fetch(sigDataUrl)).arrayBuffer();

      const sigImage = await pdfDoc.embedPng(sigBytes);

      // Place signature on last page bottom-right
      const lastPage = pdfDoc.getPage(pages - 1);
      const { width, height } = lastPage.getSize();
      const sigWidth = 150;
      const sigHeight = (sigImage.height / sigImage.width) * sigWidth;
      lastPage.drawImage(sigImage, {
        x: width - sigWidth - 40,
        y: 40,
        width: sigWidth,
        height: sigHeight,
      });

      const out = await pdfDoc.save();
      const blob = new Blob([out as any], { type: "application/pdf" });
      setSignedUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error(err);
      alert("Failed to sign PDF: " + String(err));
    }
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">✍️ PDF Signer</h2>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4 block w-full border rounded px-3 py-2"
      />

      <div className="mb-4">
        <p className="mb-2 text-sm text-slate-600">Draw signature below:</p>
        <canvas
          ref={canvasRef}
          width={500}
          height={150}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          className="border rounded w-full touch-none"
        />
        <div className="mt-2 flex gap-2">
          <button onClick={clearCanvas} className="px-3 py-1 bg-gray-200 rounded">
            Clear
          </button>
          <button onClick={handleSign} className="px-3 py-1 bg-blue-600 text-white rounded">
            Sign PDF
          </button>
        </div>
      </div>

      {signedUrl && (
        <div className="mt-4">
          <a href={signedUrl} download="signed.pdf" className="text-green-600 underline">
            📥 Download Signed PDF
          </a>
        </div>
      )}
    </section>
  );
}
