"use client";
import { useState } from "react";
import { Document, Packer, Paragraph, TextRun, ImageRun } from "docx";

interface PageContent {
  text: string;
  image?: string; // base64 image data
}

export default function PDFToWordTool() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');

  async function extractPageContent(pdfDoc: any, pageNum: number): Promise<PageContent> {
    const page = await pdfDoc.getPage(pageNum);
    
    // Get text content
    const textContent = await page.getTextContent();
    const text = textContent.items.map((item: any) => item.str).join(' ');

    // Render page to image
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise;

    return {
      text,
      image: canvas.toDataURL('image/jpeg', 0.75)
    };
  }

  async function handleConvert() {
    if (!file) return;
    setLoading(true);
    setProgress('Loading PDF...');
    
    try {
      // Load PDF using pdf.js
      const pdfjsLib = (await import('pdfjs-dist')) as any;
      pdfjsLib.GlobalWorkerOptions.workerSrc = 
        'https://unpkg.com/pdfjs-dist@5.4.296/build/pdf.worker.min.js';

      const data = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(data).promise;
      const numPages = pdf.numPages;

      // Process each page
      const pages: PageContent[] = [];
      for (let i = 1; i <= numPages; i++) {
        setProgress(`Processing page ${i} of ${numPages}...`);
        const content = await extractPageContent(pdf, i);
        pages.push(content);
      }

      // Create Word document
      setProgress('Generating Word document...');
      const doc = new Document({
        sections: [{
          properties: {},
          children: pages.flatMap((page, i) => {
            const elements = [];
            
            // Add text
            if (page.text) {
              elements.push(new Paragraph({
                children: [new TextRun(page.text)]
              }));
            }

            // Add image if available
            if (page.image) {
              // Convert base64 image data to Uint8Array for docx ImageRun
              const base64 = page.image.split(',')[1];
              const u8 = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
              elements.push(new Paragraph({
                children: [
                  new ImageRun({
                    data: u8,
                    transformation: {
                      width: 600,
                      height: 800
                    },
                    type: 'jpg'
                  })
                ]
              }));
            }

            // Add page break except for last page
            if (i < pages.length - 1) {
              elements.push(new Paragraph({
                children: [new TextRun({ break: 1 })]
              }));
            }

            return elements;
          })
        }]
      });

      // Generate and download
      setProgress('Preparing download...');
      const docBlob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(docBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace('.pdf', '') + '.docx';
      a.click();
      URL.revokeObjectURL(url);
      
      setProgress('');
    } catch (err) {
      console.error(err);
      alert('Error converting file: ' + err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">📄 PDF to Word</h2>
      <div className="mb-6">
        <p className="text-sm text-slate-600 mb-2">
          Convert PDF to Word document. Text and images will be preserved.
          Large files may take a few moments to process.
        </p>
      </div>
      
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
        {loading ? 'Converting...' : 'Convert to Word'}
      </button>

      {progress && (
        <div className="mt-4 text-sm text-slate-600">{progress}</div>
      )}
    </section>
  );
}
