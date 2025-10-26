"use client";
import { useState } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

interface TextStyle {
  font: "Helvetica" | "Times-Roman" | "Courier";
  size: number;
  color: string;
  align: "left" | "center" | "right";
}

export default function TextToPDFTool() {
  const [text, setText] = useState("");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [style, setStyle] = useState<TextStyle>({
    font: "Helvetica",
    size: 12,
    color: "#000000",
    align: "left",
  });

  async function handleConvert() {
    if (!text.trim()) return;
    setLoading(true);
    setPdfUrl(null);

    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595, 842]); // A4

      const fontName =
        style.font === "Times-Roman"
          ? StandardFonts.TimesRoman
          : style.font === "Courier"
          ? StandardFonts.Courier
          : StandardFonts.Helvetica;

      const font = await pdfDoc.embedFont(fontName);

      const color = style.color.match(/^#([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i);
      const textColor = color
        ? rgb(parseInt(color[1], 16) / 255, parseInt(color[2], 16) / 255, parseInt(color[3], 16) / 255)
        : rgb(0, 0, 0);

      // layout
      const margin = 48;
      const maxWidth = page.getWidth() - margin * 2;
      const words = text.split(/\s+/);
      const lines: string[] = [];
      let currentLine = "";

      words.forEach((word) => {
        const testLine = currentLine ? currentLine + " " + word : word;
        const width = font.widthOfTextAtSize(testLine, style.size);
        if (width <= maxWidth) {
          currentLine = testLine;
        } else {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        }
      });
      if (currentLine) lines.push(currentLine);

      const lineHeight = style.size * 1.5;
      let y = page.getHeight() - margin;
      let currentPage = page;

      for (const line of lines) {
        if (y < margin) {
          currentPage = pdfDoc.addPage([595, 842]);
          y = currentPage.getHeight() - margin;
        }

        const width = font.widthOfTextAtSize(line, style.size);
        let x = margin;
        if (style.align === "center") x = (currentPage.getWidth() - width) / 2;
        if (style.align === "right") x = currentPage.getWidth() - margin - width;

        currentPage.drawText(line, {
          x,
          y,
          size: style.size,
          font,
          color: textColor,
        });

        y -= lineHeight;
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
      setPdfUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error(err);
      alert("Failed to convert text to PDF: " + String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">📝 Text to PDF Converter</h2>

      <div className="mb-6">
        <p className="text-sm text-slate-600">
          Convert your text to a professionally formatted PDF document. Supports multiple fonts, colors, and text alignment.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Font Family:</label>
          <select
            value={style.font}
            onChange={(e) => setStyle({ ...style, font: e.target.value as TextStyle['font'] })}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="Helvetica">Helvetica</option>
            <option value="Times-Roman">Times Roman</option>
            <option value="Courier">Courier</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Font Size:</label>
          <select
            value={style.size}
            onChange={(e) => setStyle({ ...style, size: parseInt(e.target.value) })}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value={10}>10pt</option>
            <option value={12}>12pt</option>
            <option value={14}>14pt</option>
            <option value={16}>16pt</option>
            <option value={18}>18pt</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Text Color:</label>
          <input
            type="color"
            value={style.color}
            onChange={(e) => setStyle({ ...style, color: e.target.value })}
            className="w-full h-10 border rounded-lg px-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Text Alignment:</label>
          <select
            value={style.align}
            onChange={(e) => setStyle({ ...style, align: e.target.value as TextStyle['align'] })}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
      </div>

      <textarea
        rows={10}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your text here..."
        className="w-full border rounded-lg px-4 py-3 mb-4 font-mono text-sm"
      />

      <div className="flex gap-3">
        <button
          onClick={handleConvert}
          disabled={loading || !text.trim()}
          className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white px-6 py-3 rounded-lg font-medium hover:from-primary-700 hover:to-primary-600 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Converting...
            </>
          ) : (
            <>Generate PDF</>
          )}
        </button>

        {pdfUrl && (
          <a href={pdfUrl} download="text.pdf" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700">
            <span className="text-2xl">📥</span>
            Download PDF
          </a>
        )}
      </div>
    </section>
  );
}

