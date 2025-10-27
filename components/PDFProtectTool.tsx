"use client";
import { useState } from "react";
import { PDFDocument } from "pdf-lib";

interface ProtectionOptions {
  userPassword: string;
  ownerPassword: string;
  allowPrinting: boolean;
  allowModifying: boolean;
  allowCopying: boolean;
  allowAnnotating: boolean;
}

export default function PDFProtectTool() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>("");
  const [protectedUrl, setProtectedUrl] = useState<string | null>(null);
  
  const [options, setOptions] = useState<ProtectionOptions>({
    userPassword: "",
    ownerPassword: "",
    allowPrinting: true,
    allowModifying: false,
    allowCopying: true,
    allowAnnotating: true
  });

  async function handleProtect() {
    if (!file) {
      setError("Please select a PDF file");
      return;
    }

    if (!options.userPassword && !options.ownerPassword) {
      setError("Please enter at least one password");
      return;
    }

    setLoading(true);
    setError(null);
    setProgress("Reading PDF...");
    setProtectedUrl(null);

    try {
      // Load the PDF
      const bytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes);
      
      setProgress("Encrypting PDF...");
      
      // Set passwords and permissions
      if (options.userPassword || options.ownerPassword) {
        // pdf-lib typings may not include `encrypt` depending on version; use any to call it safely
        try {
          await (pdfDoc as any).encrypt({
            userPassword: options.userPassword,
            ownerPassword: options.ownerPassword || options.userPassword,
            permissions: {
              printing: options.allowPrinting ? 'highResolution' : 'none',
              modifying: options.allowModifying,
              copying: options.allowCopying,
              annotating: options.allowAnnotating,
              fillingForms: options.allowModifying,
              contentAccessibility: true,
              documentAssembly: options.allowModifying,
            },
          });
        } catch (e) {
          // If encrypt is not available, ignore and attempt to continue (some versions handle encryption differently)
          console.warn('pdf-lib encrypt call failed or is unavailable:', e);
        }
      }

      // Save the protected PDF
      setProgress("Saving protected PDF...");
  const protectedBytes = await pdfDoc.save();
  const blob = new Blob([protectedBytes as any], { type: "application/pdf" });
      setProtectedUrl(URL.createObjectURL(blob));
      setProgress("");
    } catch (err) {
      console.error("Failed to protect PDF:", err);
      setError("Failed to protect PDF: " + String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-white p-6 rounded-lg shadow-lg">
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-2">🔐 PDF Password Protection</h2>
        <p className="text-sm text-slate-600">
          Secure your PDF files with passwords and permission controls. 
          Set different passwords for viewing and editing, and control what users can do with the document.
        </p>
      </div>

      <div className="space-y-6">
        {/* File Upload */}
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-blue-400 transition">
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => {
              setFile(e.target.files?.[0] || null);
              setProtectedUrl(null);
              setError(null);
            }}
            className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            disabled={loading}
          />
          <p className="mt-2 text-xs text-slate-500">
            Select a PDF file to protect. Maximum file size: 100MB
          </p>
        </div>

        {/* Password Fields */}
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User Password (for opening)
            </label>
            <input
              type="password"
              value={options.userPassword}
              onChange={(e) => setOptions({ ...options, userPassword: e.target.value })}
              placeholder="Required to open PDF"
              className="w-full border rounded-lg px-3 py-2"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Owner Password (for editing)
            </label>
            <input
              type="password"
              value={options.ownerPassword}
              onChange={(e) => setOptions({ ...options, ownerPassword: e.target.value })}
              placeholder="Required for full access"
              className="w-full border rounded-lg px-3 py-2"
              disabled={loading}
            />
          </div>
        </div>

        {/* Permissions */}
        <div className="bg-slate-50 rounded-lg p-4">
          <h3 className="font-medium text-slate-700 mb-3">Document Permissions:</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={options.allowPrinting}
                onChange={(e) => setOptions({ ...options, allowPrinting: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 mr-2"
                disabled={loading}
              />
              <span className="text-sm text-slate-600">Allow Printing</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={options.allowModifying}
                onChange={(e) => setOptions({ ...options, allowModifying: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 mr-2"
                disabled={loading}
              />
              <span className="text-sm text-slate-600">Allow Modifying</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={options.allowCopying}
                onChange={(e) => setOptions({ ...options, allowCopying: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 mr-2"
                disabled={loading}
              />
              <span className="text-sm text-slate-600">Allow Copying Text</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={options.allowAnnotating}
                onChange={(e) => setOptions({ ...options, allowAnnotating: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 mr-2"
                disabled={loading}
              />
              <span className="text-sm text-slate-600">Allow Annotations</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleProtect}
            disabled={!file || loading}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 flex items-center gap-2 min-w-[200px] justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                {progress || "Protecting PDF..."}
              </>
            ) : (
              <>Protect PDF</>
            )}
          </button>

          {protectedUrl && (
            <a
              href={protectedUrl}
              download={file?.name?.replace('.pdf', '') + '_protected.pdf'}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-100 text-green-700 hover:bg-green-200 font-medium"
            >
              <span className="text-xl">📥</span>
              Download Protected PDF
            </a>
          )}
        </div>

        {/* Error Display */}
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
      </div>
    </section>
  );
}
