"use client";
import { useState, useRef, useEffect } from "react";
// Dynamic import of pdfjs-dist to avoid server-side issues
let pdfjsLib: any = null;

interface PageContent {
  text: string;
  pageNum: number;
}

export default function PDFReaderTool() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.5);
  const [searchQuery, setSearchQuery] = useState("");
  const [textContent, setTextContent] = useState<PageContent[]>([]);
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pdfDocRef = useRef<any>(null);

  useEffect(() => {
    // Dynamic import of pdfjs-dist
    import("pdfjs-dist").then((pdfjs) => {
      pdfjsLib = pdfjs;
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://unpkg.com/pdfjs-dist@5.4.296/build/pdf.worker.min.js";
    });

    return () => {
      // Cleanup
      if (pdfDocRef.current) {
        pdfDocRef.current.destroy();
      }
    };
  }, []);

  async function loadPDF(file: File) {
    if (!pdfjsLib) {
      setError("PDF library not loaded yet. Please try again.");
      return;
    }

    setLoading(true);
    setError(null);
    setProgress("Loading PDF...");
    setTextContent([]);
    
    try {
      const data = await file.arrayBuffer();
      pdfDocRef.current = await pdfjsLib.getDocument({ data }).promise;
      setTotalPages(pdfDocRef.current.numPages);
      
      // Extract text content from all pages
      const content: PageContent[] = [];
      for (let i = 1; i <= pdfDocRef.current.numPages; i++) {
        setProgress(`Extracting text from page ${i}/${pdfDocRef.current.numPages}...`);
        const page = await pdfDocRef.current.getPage(i);
        const textContent = await page.getTextContent();
        content.push({
          text: textContent.items.map((item: any) => item.str).join(" "),
          pageNum: i
        });
      }
      setTextContent(content);
      
      // Render first page
      await renderPage(1);
    } catch (err) {
      console.error("Failed to load PDF:", err);
      setError("Failed to load PDF: " + String(err));
    } finally {
      setLoading(false);
      setProgress("");
    }
  }

  async function renderPage(pageNum: number) {
    if (!pdfDocRef.current) return;
    
    try {
      const page = await pdfDocRef.current.getPage(pageNum);
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const context = canvas?.getContext('2d');
      
      if (canvas && context) {
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;
      }
    } catch (err) {
      console.error("Failed to render page:", err);
      setError("Failed to render page: " + String(err));
    }
  }

  function handleSearch() {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    const results = textContent
      .filter(content => 
        content.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map(content => content.pageNum);
    
    setSearchResults(results);
    
    if (results.length > 0) {
      setCurrentPage(results[0]);
      renderPage(results[0]);
    }
  }

  async function handlePageChange(newPage: number) {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    await renderPage(newPage);
  }

  return (
    <section className="bg-white p-6 rounded-lg shadow-lg">
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-2">📚 PDF Reader</h2>
        <p className="text-sm text-slate-600">
          Read and search through PDF documents directly in your browser. 
          Extract text, navigate pages, and search for specific content.
        </p>
      </div>

      <div className="space-y-6">
        {/* File Upload */}
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-blue-400 transition">
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setFile(file);
                loadPDF(file);
              }
            }}
            className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            disabled={loading}
          />
        </div>

        {loading && progress && (
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

        {pdfDocRef.current && (
          <div className="space-y-4">
            {/* Controls */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-50"
                >
                  ←
                </button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-50"
                >
                  →
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setScale(s => Math.max(0.5, s - 0.25))}
                  className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200"
                >
                  -
                </button>
                <span className="text-sm">{Math.round(scale * 100)}%</span>
                <button
                  onClick={() => setScale(s => Math.min(3, s + 0.25))}
                  className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200"
                >
                  +
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search in document..."
                className="flex-1 border rounded-lg px-3 py-2"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Search
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  Found matches on pages: {searchResults.join(", ")}
                </p>
              </div>
            )}

            {/* PDF Viewer */}
            <div className="max-w-full overflow-x-auto">
              <canvas
                ref={canvasRef}
                className="border rounded-lg shadow-sm mx-auto"
              />
            </div>

            {/* Text Content */}
            {textContent[currentPage - 1] && (
              <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                <h3 className="font-medium mb-2">Page {currentPage} Text Content:</h3>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">
                  {textContent[currentPage - 1].text}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
