import { tools } from "@/lib/tools";
import Hero from "@/components/Hero";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

export const metadata = {
  title: "PDF Maker AI — Every tool you need to work with PDFs",
  description:
    "PDF Maker AI is an online service to work with PDF files completely free and easy to use. Merge PDF, split PDF, compress PDF, convert images and documents, and more!",
};

// Categories ko order me dikhane ke liye
const CATEGORY_ORDER = ['AI', 'Productivity', 'PDF', 'Document', 'Image', 'Utilities', 'UX'];

// ✅ Function yaha page me define karo
function groupByCategoryAndOrder() {
  const map: Record<string, typeof tools> = {};
  for (const t of tools) {
    const cat = t.category || "Other";
    if (!map[cat]) map[cat] = [];
    map[cat].push(t);
  }
  // Categories ko order ke mutabik sort karo
  return Object.entries(map).sort(([catA], [catB]) => {
    const indexA = CATEGORY_ORDER.indexOf(catA) === -1 ? 999 : CATEGORY_ORDER.indexOf(catA);
    const indexB = CATEGORY_ORDER.indexOf(catB) === -1 ? 999 : CATEGORY_ORDER.indexOf(catB);
    return indexA - indexB;
  });
}

export default function Home() {
  const categories = groupByCategoryAndOrder(); // function ab guaranteed exist karega
  const featuredTools = tools.filter(t =>
    ['PDF Merge', 'PDF Splitter', 'Compress PDF', 'JPG to PDF', 'PDF to JPG', 'PDF to Word'].includes(t.name)
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Hero />

      {/* Featured Tools */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 pt-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
            Most Popular Tools
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Our most-used tools to help you work with PDFs efficiently
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
          {featuredTools.slice(0, 6).map((tool) => {
            const Icon = tool.icon as LucideIcon;
            return (
              <Link
                key={tool.route}
                href={tool.route}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-100 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-slate-600 text-sm line-clamp-2">
                    {tool.description}
                  </p>
                  <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                    Try Now
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Tools by Category */}
      {categories.map(([cat, categoryTools]) => (
        <section key={cat} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white opacity-50" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  {cat} Tools
                </h2>
                <div className="h-1 w-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryTools.map((tool) => {
                  const Icon = tool.icon as LucideIcon;
                  return (
                    <Link
                      key={tool.route}
                      href={tool.route}
                      className="group flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-all duration-300 border border-transparent hover:border-slate-200"
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                          {tool.name}
                        </h3>
                        <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                          {tool.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 mix-blend-multiply" />
          </div>
          
          <div className="relative px-8 py-16 sm:px-12 sm:py-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                Why Choose PDF Maker AI?
              </h2>
              <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                Experience the perfect blend of power and simplicity
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
              <div className="relative group">
                <div className="absolute inset-0 bg-white rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                <div className="relative text-center px-6 py-8">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/10 flex items-center justify-center text-2xl backdrop-blur-sm group-hover:scale-110 transition-transform">
                    ⚡
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">Lightning Fast</h3>
                  <p className="text-blue-100">
                    Process your files instantly with our optimized cloud infrastructure
                  </p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-white rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                <div className="relative text-center px-6 py-8">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/10 flex items-center justify-center text-2xl backdrop-blur-sm group-hover:scale-110 transition-transform">
                    🔒
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">Bank-Level Security</h3>
                  <p className="text-blue-100">
                    Your files are encrypted and automatically deleted after processing
                  </p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-white rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                <div className="relative text-center px-6 py-8">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/10 flex items-center justify-center text-2xl backdrop-blur-sm group-hover:scale-110 transition-transform">
                    🧠
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">AI-Powered Magic</h3>
                  <p className="text-blue-100">
                    Advanced AI tools for OCR, summarization, and document analysis
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">1M+</div>
            <div className="text-sm text-slate-600">Files Processed</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
            <div className="text-sm text-slate-600">Daily Users</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">99.9%</div>
            <div className="text-sm text-slate-600">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
            <div className="text-sm text-slate-600">Support</div>
          </div>
        </div>
      </section>
    </main>
  );
}
