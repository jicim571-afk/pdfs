import Link from "next/link";
import { Link2, Scissors, FileSearch } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-3xl p-12 mb-16">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-pink-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-6xl mx-auto text-center">
        <div className="inline-block mb-6">
          <span className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-indigo-600 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            100% Free • AI-Powered • Privacy First
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
            Your Complete PDF
          </span>
          <br />
          <span className="text-slate-800">Toolkit in One Place</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
          Transform, merge, split, compress and edit PDFs with AI-powered tools. 
          <span className="font-semibold text-slate-800"> No signup required.</span> All processing happens securely in your browser.
        </p>

        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <Link
            href="/pdf-merge"
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all"
          >
            <span className="text-2xl group-hover:rotate-12 transition-transform">
              <Link2 className="w-6 h-6" />
            </span>
            <span>Merge PDF</span>
          </Link>
          
          <Link
            href="/pdf-splitter"
            className="group inline-flex items-center gap-3 bg-white text-slate-700 px-8 py-4 rounded-xl font-semibold border-2 border-slate-200 hover:border-indigo-300 hover:shadow-lg hover:scale-105 transition-all"
          >
            <span className="text-2xl group-hover:rotate-12 transition-transform">
              <Scissors className="w-6 h-6" />
            </span>
            <span>Split PDF</span>
          </Link>
          
          <Link
            href="/ai-ocr"
            className="group inline-flex items-center gap-3 bg-white text-slate-700 px-8 py-4 rounded-xl font-semibold border-2 border-slate-200 hover:border-purple-300 hover:shadow-lg hover:scale-105 transition-all"
          >
            <span className="text-2xl group-hover:rotate-12 transition-transform">
              <FileSearch className="w-6 h-6" />
            </span>
            <span>AI OCR</span>
          </Link>
        </div>

        {/* Feature badges */}
        <div className="flex flex-wrap gap-8 justify-center text-sm">
          <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
            </div>
            <span className="font-medium text-slate-700">No Account Needed</span>
          </div>
          
          <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
              </svg>
            </div>
            <span className="font-medium text-slate-700">Secure & Private</span>
          </div>
          
          <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 7H7v6h6V7z"/>
                <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd"/>
              </svg>
            </div>
            <span className="font-medium text-slate-700">AI-Powered</span>
          </div>
        </div>
      </div>
    </section>
  );
}
