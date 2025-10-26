"use client";
import { useState } from "react";

interface Sentence {
  text: string;
  score: number;
  position: number;
}

export default function AISummarizerTool() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [summaryLength, setSummaryLength] = useState<"short" | "medium" | "long">("medium");

  function splitIntoSentences(text: string): string[] {
    return text
      .replace(/([.!?])\s+/g, "$1|")
      .split("|")
      .map(s => s.trim())
      .filter(s => s.length > 10);
  }

  function calculateSentenceScores(sentences: string[]): Sentence[] {
    // Create word frequency map
    const wordFreq: { [key: string]: number } = {};
    const allWords = sentences
      .join(" ")
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    allWords.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });

    return sentences.map((text, position) => {
      const words = text.toLowerCase().split(/\s+/).filter(word => word.length > 3);
      
      // Calculate various scores
      const wordScore = words.reduce((sum, word) => sum + (wordFreq[word] || 0), 0) / words.length;
      const positionScore = position === 0 ? 1 : position === sentences.length - 1 ? 0.8 : 1 - Math.abs(0.5 - position / sentences.length);
      const lengthScore = Math.min(1, text.length / 150);
      const hasNumbers = /\d/.test(text) ? 1.2 : 1;
      const hasQuotes = text.includes('"') ? 1.3 : 1;
      
      // Combine scores with weights
      const score = (
        (wordScore * 0.4) + 
        (positionScore * 0.3) + 
        (lengthScore * 0.2)
      ) * hasNumbers * hasQuotes;
      
      return { text, score, position };
    });
  }

  async function handleSummarize() {
    if (!text.trim()) return;
    setLoading(true);
    setSummary("");
    
    try {
      // Split text into sentences
      const sentences = splitIntoSentences(text);
      
      if (sentences.length < 2) {
        setSummary(text); // Text is too short to summarize
        return;
      }

      // Calculate target summary length
      const targetLength = {
        short: Math.max(2, Math.ceil(sentences.length * 0.2)),
        medium: Math.max(3, Math.ceil(sentences.length * 0.3)),
        long: Math.max(4, Math.ceil(sentences.length * 0.4))
      }[summaryLength];

      // Score and select sentences
      const scoredSentences = calculateSentenceScores(sentences);
      const selectedSentences = scoredSentences
        .sort((a, b) => b.score - a.score)
        .slice(0, targetLength)
        .sort((a, b) => a.position - b.position);

      // Create summary
      const summaryText = selectedSentences.map(s => s.text).join(" ");
      setSummary(summaryText);
    } catch (err: any) {
      console.error(err);
      setSummary("Error generating summary: " + String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">📝 Text Summarizer</h2>
      
      <div className="mb-6">
        <p className="text-sm text-slate-600">
          Automatically generate concise summaries of your text. Uses advanced algorithms to identify
          key sentences. Works entirely in your browser - no data is sent to servers.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Text to Summarize:
          </label>
          <textarea
            rows={8}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your text here (minimum 2-3 sentences for best results)..."
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="block text-sm font-medium text-gray-700">
            Summary Length:
          </label>
          <select
            value={summaryLength}
            onChange={(e) => setSummaryLength(e.target.value as "short" | "medium" | "long")}
            className="rounded border-gray-300 text-sm focus:ring-blue-500"
            disabled={loading}
          >
            <option value="short">Short (20%)</option>
            <option value="medium">Medium (30%)</option>
            <option value="long">Long (40%)</option>
          </select>
        </div>

        <button
          onClick={handleSummarize}
          disabled={!text.trim() || loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Summarizing...
            </>
          ) : (
            <>Generate Summary</>
          )}
        </button>

        {summary && (
          <div className="mt-6 bg-gradient-to-br from-slate-50 to-blue-50 border border-blue-100 rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-800">Generated Summary:</h3>
              <button
                onClick={() => navigator.clipboard.writeText(summary)}
                className="text-sm bg-white px-3 py-1 rounded-lg border border-blue-200 hover:bg-blue-50 transition"
              >
                📋 Copy
              </button>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-slate-700 whitespace-pre-wrap">{summary}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
