import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-tr from-primary-900 to-primary-700 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">📄</span>
              </div>
              <span className="text-lg font-bold">PDF Maker AI</span>
            </div>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              Your complete PDF toolkit powered by AI. Free, fast, and privacy-focused tools for all your document needs.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 bg-primary-800 hover:bg-primary-700 rounded-lg flex items-center justify-center transition">
                <span className="text-sm">𝕏</span>
              </a>
              <a href="#" className="w-8 h-8 bg-primary-800 hover:bg-primary-700 rounded-lg flex items-center justify-center transition">
                <span className="text-sm">in</span>
              </a>
            </div>
          </div>

          {/* Popular Tools */}
          <div>
              <h3 className="font-semibold mb-4 text-white">Popular Tools</h3>
            <ul className="space-y-2.5 text-sm text-slate-200">
              <li><Link href="/pdf-merge" className="hover:text-indigo-400 transition">Merge PDF</Link></li>
              <li><Link href="/pdf-splitter" className="hover:text-indigo-400 transition">Split PDF</Link></li>
              <li><Link href="/pdf-compress" className="hover:text-indigo-400 transition">Compress PDF</Link></li>
              <li><Link href="/jpg-to-pdf" className="hover:text-indigo-400 transition">JPG to PDF</Link></li>
              <li><Link href="/pdf-to-word" className="hover:text-indigo-400 transition">PDF to Word</Link></li>
            </ul>
          </div>

          {/* AI Solutions */}
          <div>
            <h3 className="font-semibold mb-4 text-white">AI Solutions</h3>
            <ul className="space-y-2.5 text-sm text-slate-200">
              <li><Link href="/ai-ocr" className="hover:text-primary-300 transition">AI OCR</Link></li>
              <li><Link href="/chat-with-pdf" className="hover:text-primary-300 transition">Chat with PDF</Link></li>
              <li><Link href="/ai-summarizer" className="hover:text-primary-300 transition">AI Summarizer</Link></li>
              <li><Link href="/tools" className="hover:text-primary-300 transition">All Tools</Link></li>
              <li><Link href="/blog" className="hover:text-primary-300 transition">Blog</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Company</h3>
            <ul className="space-y-2.5 text-sm text-slate-200">
              <li><Link href="/about" className="hover:text-primary-300 transition">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary-300 transition">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-primary-300 transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary-300 transition">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-slate-400">
              © {new Date().getFullYear()} PDF Maker AI. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                All systems operational
              </span>
              <span>•</span>
              <span>Made with 💜 for PDF lovers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
