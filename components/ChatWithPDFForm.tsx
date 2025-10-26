"use client";
import { useState, useRef } from "react";
import { Document } from "flexsearch";
import * as stringSimilarity from "string-similarity";

interface TextChunk {
  text: string;
  pageNum: number;
}

interface SearchResult {
  id: number;
  doc: {
    text: string;
    pageNum: number;
  };
}

interface ChunkSimilarity {
  chunk: TextChunk;
  score: number;
}

declare module 'string-similarity' {
  export function compareTwoStrings(str1: string, str2: string): number;
  export function findBestMatch(mainString: string, targetStrings: string[]): { 
    ratings: Array<{ target: string; rating: number }>;
    bestMatch: { target: string; rating: number };
  };
}

export default function ChatWithPDFForm() {
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [progress, setProgress] = useState<string>("");
  const searchIndex = useRef<any>(null);
  const chunks = useRef<TextChunk[]>([]);

  async function extractTextFromPDF(file: File) {
    const pdfjsLib = (await import('pdfjs-dist')) as any;
    pdfjsLib.GlobalWorkerOptions.workerSrc = 
      'https://unpkg.com/pdfjs-dist@5.4.296/build/pdf.worker.min.js';

    const data = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(data).promise;
    const numPages = pdf.numPages;
    
    // Extract text from each page
    const textChunks: TextChunk[] = [];
    for (let i = 1; i <= numPages; i++) {
      setProgress(`Reading page ${i} of ${numPages}...`);
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const text = content.items.map((item: any) => item.str).join(' ');
      
      // Split into smaller chunks
      const words = text.split(/\s+/);
      for (let j = 0; j < words.length; j += 100) {
        const chunk = words.slice(j, j + 100).join(' ');
        if (chunk.trim()) {
          textChunks.push({ text: chunk, pageNum: i });
        }
      }
    }
    return textChunks;
  }

  function initializeSearch(textChunks: TextChunk[]) {
    // Create search index
    const index = new Document({
      document: {
        id: "id",
        index: ["text"],
        store: ["text", "pageNum"]
      }
    });

    // Add chunks to index
    textChunks.forEach((chunk, i) => {
      index.add(i, {
        text: chunk.text,
        pageNum: chunk.pageNum
      });
    });

    return index;
  }

  function answerQuestion(question: string, chunks: TextChunk[], index: any): string {
    // Common questions patterns
    if (question.toLowerCase().includes('how many pages')) {
      const pages = new Set(chunks.map(c => c.pageNum)).size;
      return `The document has ${pages} page${pages === 1 ? '' : 's'}.`;
    }

    if (question.toLowerCase().includes('summarize') || question.toLowerCase().includes('summary')) {
      const firstChunk = chunks[0].text;
      const lastChunk = chunks[chunks.length - 1].text;
      return `Here's a brief overview:\n\nThe document begins with: "${firstChunk.slice(0, 200)}..."\n\nAnd concludes with: "${lastChunk.slice(-200)}"`;
    }

    // Search for relevant chunks
    const searchResults = index.search(question, { limit: 5 });
    if (!searchResults.length) {
      return "I couldn't find any relevant information in the document to answer your question.";
    }

    // Get best matching chunks
    const relevantChunks = searchResults.map((result: any) => chunks[result.id]);
    
    // Find best matching chunk using string similarity
    const similarities: ChunkSimilarity[] = relevantChunks.map((chunk: TextChunk) => ({
      chunk,
      score: stringSimilarity.compareTwoStrings(question.toLowerCase(), chunk.text.toLowerCase())
    }));
    
    similarities.sort((a: ChunkSimilarity, b: ChunkSimilarity) => b.score - a.score);
    const bestMatch = similarities[0].chunk;
    
    // Format answer
    return `Based on the content from page ${bestMatch.pageNum}, here's what I found:\n\n${bestMatch.text}`;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAnswer(null);
    setError(null);
    setProgress("");
    
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement;
    const questionInput = form.elements.namedItem("question") as HTMLInputElement;
    
    if (!fileInput?.files?.[0]) {
      setError("Please select a PDF file");
      return;
    }
    
    if (!questionInput?.value?.trim()) {
      setError("Please enter a question");
      return;
    }
    
    setLoading(true);
    try {
      // Extract text if not already done
      if (!searchIndex.current) {
        setProgress("Processing PDF...");
        chunks.current = await extractTextFromPDF(fileInput.files[0]);
        setProgress("Building search index...");
        searchIndex.current = initializeSearch(chunks.current);
      }

      // Generate answer
      setProgress("Finding relevant information...");
      const response = answerQuestion(
        questionInput.value,
        chunks.current,
        searchIndex.current
      );
      
      setAnswer(response);
    } catch (err: any) {
      console.error("PDF processing error:", err);
      setError("Failed to process PDF: " + String(err));
    } finally {
      setLoading(false);
      setProgress("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-indigo-900 mb-2">
          💬 Chat with PDF
        </h2>
        <p className="text-sm text-slate-600">
          Have a conversation with your PDF document. Ask questions, get summaries, and extract information.
          Everything runs directly in your browser - no data is sent to any servers.
        </p>
      </div>

      <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-purple-400 transition">
        <input 
          type="file" 
          name="file" 
          accept="application/pdf"
          className="block w-full text-sm text-slate-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-purple-50 file:text-purple-700
            hover:file:bg-purple-100"
          onChange={(e) => {
            setFileName(e.target.files?.[0]?.name || "");
            searchIndex.current = null; // Reset index when file changes
          }}
          disabled={loading}
        />
        {fileName && (
          <p className="mt-2 text-xs text-slate-600">
            Selected file: {fileName}
          </p>
        )}
        {!fileName && (
          <p className="mt-2 text-xs text-slate-500">
            Upload a PDF document to start chatting with it
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-slate-700">
          Your Question
        </label>
        <textarea 
          name="question" 
          rows={3}
          className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition" 
          placeholder="Ask anything about the document... (e.g., 'How many pages?' or 'What are the main topics?')"
          defaultValue="Summarize the document."
          disabled={loading}
        />
        <p className="mt-2 text-xs text-slate-500">
          Tip: Try asking about specific topics, requesting summaries, or inquiring about document details
        </p>
      </div>

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

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            {progress || "Processing..."}
          </span>
        ) : "Ask Question"}
      </button>

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

      {answer && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-purple-800 flex items-center gap-2">
              <span>💡</span>
              Answer
            </h3>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(answer)}
              className="text-sm bg-white px-3 py-1 rounded-lg border border-purple-300 hover:bg-purple-50 transition"
            >
              📋 Copy
            </button>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{answer}</p>
          </div>
        </div>
      )}
    </form>
  );
}
