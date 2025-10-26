"use client";
import { useState } from "react";

export default function CaseConverterTool() {
  const [text, setText] = useState("");

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">🔠 Case Converter</h2>
      <textarea
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text..."
        className="w-full border rounded px-3 py-2 mb-4"
      />
      <div className="space-y-2">
        <p><strong>UPPERCASE:</strong> {text.toUpperCase()}</p>
        <p><strong>lowercase:</strong> {text.toLowerCase()}</p>
        <p><strong>Capitalized:</strong> {text.replace(/\b\w/g, c => c.toUpperCase())}</p>
      </div>
    </section>
  );
}
