import Link from "next/link";
import { Link2, Scissors, FileSearch } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-violet-900 py-20 mb-16">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-tr from-indigo-500/30 to-violet-500/30 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/10 backdrop-blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Premium Badge */}
        <div className="inline-block mb-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/20">
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-medium text-emerald-400">Live</span>
            </span>
            <span className="w-px h-4 bg-white/20"></span>
            <span className="text-sm font-medium text-white/90">100% Free</span>
            <span className="w-px h-4 bg-white/20"></span>
            <span className="text-sm font-medium text-white/90">Privacy First</span>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-8 leading-none animate-fade-in-up animation-delay-150">
          <span className="inline-block bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Transform Your PDFs
          </span>
          <br />
          <span className="inline-block mt-4 text-white">
            with AI Magic ✨
          </span>
        </h1>
        
        <p className="text-xl sm:text-2xl text-blue-100/90 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-300">
          The most powerful suite of PDF tools, enhanced by artificial intelligence.
          <span className="font-semibold text-white"> No signup required.</span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-6 justify-center mb-16 animate-fade-in-up animation-delay-450">
          <Link
            href="/pdf-merge"
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-indigo-500/25 hover:scale-105 transition-all duration-300"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></span>
            <span className="relative flex items-center gap-3">
              <Link2 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              <span>Merge PDFs Now</span>
            </span>
          </Link>
          
          <Link
            href="/ai-ocr"
            className="group relative inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl text-white px-8 py-4 rounded-2xl font-semibold border border-white/20 hover:bg-white/15 hover:scale-105 transition-all duration-300"
          >
            <FileSearch className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            <span>Try AI OCR</span>
            <span className="absolute -top-1 -right-1 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-violet-500 items-center justify-center text-[10px] font-bold">
                NEW
              </span>
            </span>
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto animate-fade-in-up animation-delay-600">
          <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors duration-300">
            <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 p-2.5 group-hover:scale-110 transition-transform">
              <svg className="w-full h-full text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Lightning Fast</h3>
            <p className="text-blue-100/75 text-sm">Process files instantly with our optimized engine</p>
          </div>
          
          <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors duration-300">
            <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 p-2.5 group-hover:scale-110 transition-transform">
              <svg className="w-full h-full text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Bank-Level Security</h3>
            <p className="text-blue-100/75 text-sm">Your files are encrypted and auto-deleted</p>
          </div>
          
          <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors duration-300">
            <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 p-2.5 group-hover:scale-110 transition-transform">
              <svg className="w-full h-full text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Works Everywhere</h3>
            <p className="text-blue-100/75 text-sm">Compatible with all devices and browsers</p>
          </div>
          
          <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors duration-300">
            <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 p-2.5 group-hover:scale-110 transition-transform">
              <svg className="w-full h-full text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">AI-Powered</h3>
            <p className="text-blue-100/75 text-sm">Advanced features like OCR and analysis</p>
          </div>
        </div>
      </div>
    </section>
  );
}
 
