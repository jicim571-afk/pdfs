"use client";
import { useState } from "react";
import { PDFDocument } from "pdf-lib";

interface PDFPermissions {
  printing: boolean;
  modifying: boolean;
  copying: boolean;
  annotating: boolean;
  fillingForms: boolean;
  contentAccessibility: boolean;
  documentAssembly: boolean;
}

interface UnlockResult {
  success: boolean;
  isEncrypted: boolean;
  permissions: PDFPermissions | null;
  error?: string;
}

export default function PDFUnlockTool() {
  const [file, setFile] = useState<File | null>(null);
  const [unlockedUrl, setUnlockedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState<string>("");
  const [pdfInfo, setPdfInfo] = useState<UnlockResult | null>(null);

  async function analyzePDF(bytes: ArrayBuffer): Promise<UnlockResult> {
    try {
      // First try to load without password
      const pdfDoc = await PDFDocument.load(bytes, { 
        ignoreEncryption: false,
        updateMetadata: false
      }).catch(() => null);

      if (!pdfDoc) {
        return {
          success: false,
          isEncrypted: true,
          permissions: null,
          error: "This PDF is password protected. Please enter the password."
        };
      }

      const permissions: PDFPermissions = {
        printing: pdfDoc.isEncrypted ? pdfDoc.canPrint() : true,
        modifying: pdfDoc.isEncrypted ? pdfDoc.canModify() : true,
        copying: pdfDoc.isEncrypted ? pdfDoc.canCopy() : true,
        annotating: pdfDoc.isEncrypted ? pdfDoc.canAnnotate() : true,
        fillingForms: pdfDoc.isEncrypted ? pdfDoc.canFillForms() : true,
        contentAccessibility: pdfDoc.isEncrypted ? pdfDoc.canAccessContent() : true,
        documentAssembly: pdfDoc.isEncrypted ? pdfDoc.canAssembleDocument() : true
      };

      return {
        success: true,
        isEncrypted: pdfDoc.isEncrypted,
        permissions
      };
    } catch (err) {
      return {
        success: false,
        isEncrypted: true,
        permissions: null,
        error: String(err)
      };
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newFile = e.target.files?.[0];
    if (newFile) {
      setFile(newFile);
      setUnlockedUrl(null);
      setError(null);
      setPdfInfo(null);
      setPassword("");
      setAnalyzing(true);

      try {
        const bytes = await newFile.arrayBuffer();
        const info = await analyzePDF(bytes);
        setPdfInfo(info);
        
        if (info.error) {
          setError(info.error);
        }
      } catch (err) {
        setError("Failed to analyze PDF: " + String(err));
      } finally {
        setAnalyzing(false);
      }
    }
  }

  async function handleUnlock() {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const bytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes, {
        ignoreEncryption: false,
        updateMetadata: false,
        ...(password ? { password } : {})
      });

      // Create a new document to remove all restrictions
      const newPdfDoc = await PDFDocument.create();
      
      // Copy all pages from the original document
      const pages = await newPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
      pages.forEach(page => newPdfDoc.addPage(page));
      
      // Copy document metadata
      if (pdfDoc.getTitle()) newPdfDoc.setTitle(pdfDoc.getTitle());
      if (pdfDoc.getAuthor()) newPdfDoc.setAuthor(pdfDoc.getAuthor());
      if (pdfDoc.getSubject()) newPdfDoc.setSubject(pdfDoc.getSubject());
      if (pdfDoc.getKeywords()) newPdfDoc.setKeywords(pdfDoc.getKeywords());
      if (pdfDoc.getCreator()) newPdfDoc.setCreator(pdfDoc.getCreator());
      if (pdfDoc.getProducer()) newPdfDoc.setProducer(pdfDoc.getProducer());
      if (pdfDoc.getCreationDate()) newPdfDoc.setCreationDate(pdfDoc.getCreationDate());
      if (pdfDoc.getModificationDate()) newPdfDoc.setModificationDate(pdfDoc.getModificationDate());

      const unlockedBytes = await newPdfDoc.save({
        addDefaultPage: false,
        updateMetadata: true
      });

      // Cleanup previous URL
      if (unlockedUrl) {
        URL.revokeObjectURL(unlockedUrl);
      }

      const blob = new Blob([unlockedBytes], { type: "application/pdf" });
      setUnlockedUrl(URL.createObjectURL(blob));

      // Update PDF info after successful unlock
      setPdfInfo({
        success: true,
        isEncrypted: false,
        permissions: {
          printing: true,
          modifying: true,
          copying: true,
          annotating: true,
          fillingForms: true,
          contentAccessibility: true,
          documentAssembly: true
        }
      });
    } catch (err) {
      let errorMsg = String(err);
      if (errorMsg.includes("password")) {
        errorMsg = "Incorrect password. Please try again.";
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-white p-6 rounded-lg shadow-lg">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-2">🔓 PDF Unlock Tool</h2>
        <p className="text-sm text-slate-600">
          Remove restrictions from PDFs and unlock password-protected documents.
          Preserves document content and metadata while removing security constraints.
        </p>
      </div>

      <div className="space-y-6">
        {/* File Upload */}
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-purple-400 transition">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-purple-50 file:text-purple-700
              hover:file:bg-purple-100"
          />
        </div>

        {/* Analysis Loading */}
        {analyzing && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <svg className="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              <p className="text-sm text-blue-700">Analyzing PDF...</p>
            </div>
          </div>
        )}

        {/* PDF Info */}
        {pdfInfo && !analyzing && (
          <div className="bg-slate-50 rounded-xl p-4">
            <h3 className="font-medium text-slate-800 mb-3">PDF Security Status:</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className={`text-lg ${pdfInfo.isEncrypted ? 'text-red-500' : 'text-green-500'}`}>
                  {pdfInfo.isEncrypted ? '🔒' : '🔓'}
                </span>
                <span className="text-sm">
                  {pdfInfo.isEncrypted 
                    ? 'This PDF is encrypted/password-protected'
                    : 'This PDF has no password protection'}
                </span>
              </div>

              {pdfInfo.permissions && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  {Object.entries(pdfInfo.permissions).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <span className={value ? 'text-green-500' : 'text-red-500'}>
                        {value ? '✓' : '✕'}
                      </span>
                      <span className="text-slate-600">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Password Input */}
        {pdfInfo?.isEncrypted && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              PDF Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        )}

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

        {/* Unlock Button */}
        <button
          onClick={handleUnlock}
          disabled={!file || loading || analyzing}
          className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Unlocking PDF...
            </div>
          ) : (
            `Unlock ${pdfInfo?.isEncrypted ? "& Remove Password" : "PDF"}`
          )}
        </button>

        {/* Download Button */}
        {unlockedUrl && (
          <div className="text-center">
            <a
              href={unlockedUrl}
              download={`unlocked-${file?.name || 'document'}.pdf`}
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-2 
                rounded-lg hover:bg-green-700 transition-colors"
            >
              <span>📥</span>
              <span>Download Unlocked PDF</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
