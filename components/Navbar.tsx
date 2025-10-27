"use client";
import { useState } from "react";
import Link from "next/link";
import { tools } from "@/lib/tools";
import { type LucideIcon } from "lucide-react";

interface Tool {
  name: string;
  description: string;
  category: string;
  route: string;
  icon: string | LucideIcon;
}

function groupByCategory() {
  const map: Record<string, Tool[]> = {};
  for (const t of tools as Tool[]) {
    const cat = t.category || "Other";
    if (!map[cat]) map[cat] = [];
    map[cat].push(t);
  }
  return map;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const categories = groupByCategory();

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" legacyBehavior>
            <a className="flex items-center gap-2">
              <img src="/logo.svg" alt="PDF Maker AI" className="w-10 h-10 logo-hover" />
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                  PDF Maker AI
                </span>
                <span className="text-[10px] text-slate-500 -mt-1">
                  Smart PDF Solutions
                </span>
              </div>
            </a>
          </Link>

          {/* Main Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="relative group">
              <button className="text-sm font-medium text-slate-700 hover:text-indigo-600 transition py-2 flex items-center gap-1">
                All PDF tools
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className="absolute left-0 top-full mt-2 w-screen max-w-4xl bg-white shadow-2xl rounded-2xl border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-8">
                <div className="grid grid-cols-3 gap-8">
                  {Object.entries(categories).map(([cat, tools]) => (
                    <div key={cat}>
                      <div className="text-xs font-bold text-indigo-600 mb-4 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-8 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></span>
                        {cat}
                      </div>
                      <ul className="space-y-3">
                        {tools.slice(0, 5).map((tool) => {
                          const Icon = tool.icon as LucideIcon;

                          return (
                            <li key={tool.route}>
                              <Link href={tool.route} legacyBehavior>
                                <a className="flex items-center gap-3 text-sm text-slate-700 hover:text-indigo-600 transition group/item">
                                  <span className="text-xl group-hover/item:scale-110 transition">
                                    {typeof Icon !== "string" ? <Icon className="w-5 h-5" /> : Icon}
                                  </span>
                                  <span>{tool.name}</span>
                                </a>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <Link href="/tools" legacyBehavior>
                    <a className="text-sm text-indigo-600 hover:text-purple-600 font-semibold inline-flex items-center gap-2">
                      View all {tools.length}+ tools <span>→</span>
                    </a>
                  </Link>
                </div>
              </div>
            </div>

            <Link href="/blog" legacyBehavior>
              <a className="text-sm font-medium text-slate-700 hover:text-indigo-600 transition">Blog</a>
            </Link>
            <Link href="/about" legacyBehavior>
              <a className="text-sm font-medium text-slate-700 hover:text-indigo-600 transition">About</a>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/tools" legacyBehavior>
              <a className="hidden md:inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:scale-105 transition-all text-sm font-semibold">
                Get Started Free
              </a>
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="lg:hidden text-slate-700 p-2 hover:bg-slate-100 rounded-lg transition"
            >
              {!open ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile slide-over menu */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}
        aria-hidden={!open}
      >
        {/* backdrop */}
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/40 ${open ? "opacity-100" : "opacity-0 pointer-events-none"} transition-opacity`}
        />

        <aside className={`absolute right-0 top-0 h-full w-[320px] bg-white shadow-2xl p-6 overflow-auto`}> 
          <div className="flex items-center justify-between mb-6">
            <Link href="/" legacyBehavior>
              <a className="flex items-center gap-3" onClick={() => setOpen(false)}>
                <img src="/logo.svg" alt="PDF Maker AI" className="w-10 h-10" />
                <div>
                  <div className="font-bold text-sm">PDF Maker AI</div>
                  <div className="text-xs text-slate-500">Smart PDF Solutions</div>
                </div>
              </a>
            </Link>
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="p-2 rounded-md text-slate-600 hover:bg-slate-100">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="space-y-4">
            <Link href="/tools" legacyBehavior>
              <a onClick={() => setOpen(false)} className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-slate-50 font-medium bg-gradient-to-r from-indigo-600 to-pink-500 text-white">
                <span>🧰</span>
                Tools
              </a>
            </Link>

            <Link href="/blog" legacyBehavior>
              <a onClick={() => setOpen(false)} className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-slate-50">
                <span>📰</span>
                Blog
              </a>
            </Link>

            <Link href="/about" legacyBehavior>
              <a onClick={() => setOpen(false)} className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-slate-50">
                <span>ℹ️</span>
                About
              </a>
            </Link>

            <div className="pt-4 border-t border-slate-200">
              <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Popular tools</div>
              <ul className="space-y-2">
                {tools.slice(0, 8).map((t) => {
                  const Icon = t.icon as LucideIcon | string;
                  return (
                    <li key={t.route}>
                      <Link href={t.route} legacyBehavior>
                        <a onClick={() => setOpen(false)} className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-slate-50">
                          <span className="w-6 h-6 flex items-center justify-center text-lg">
                            {typeof Icon === "string" ? Icon : <Icon className="w-5 h-5 text-slate-600" />}
                          </span>
                          <span className="text-sm font-medium text-slate-700">{t.name}</span>
                        </a>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>
        </aside>
      </div>
    </header>
  );
}
