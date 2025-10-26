"use client";
import { useState } from "react";

export default function WordCounterTool() {
  const [text, setText] = useState("");

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">🔢 Word Counter</h2>
      <textarea
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your text here..."
        className="w-full border rounded px-3 py-2 mb-4"
      />
      <p className="text-lg font-medium">Words: {wordCount}</p>
    </section>
  );
}
