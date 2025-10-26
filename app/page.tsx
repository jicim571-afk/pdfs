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
    <main className="bg-gray-50">
      <Hero />

      {/* Featured Tools */}
      <section className="max-w-7xl mx-auto px-4 mb-16 pt-8">
        <h2 className="text-3xl font-extrabold mb-8 text-gray-800 border-b-2 border-blue-500 pb-2">
          Most Popular Tools ⚡
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {featuredTools.map((tool) => {
            const Icon = tool.icon as LucideIcon;
            return (
              <Link
                key={tool.route}
                href={tool.route}
                className="group bg-white rounded-2xl p-6 text-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.03] border border-gray-100"
              >
                <div className="text-4xl mb-3 mx-auto p-2 w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-8 h-8" />
                </div>
                <div className="text-base font-bold text-gray-700 group-hover:text-blue-600 transition">
                  {tool.name}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Tools by Category */}
      {categories.map(([cat, categoryTools]) => (
        <section key={cat} className="max-w-7xl mx-auto px-4 mb-16">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <h2 className="text-2xl font-extrabold mb-6 text-blue-700 border-b border-gray-200 pb-3">
              {cat} Tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {categoryTools.map((tool) => {
                const Icon = tool.icon as LucideIcon;
                return (
                  <Link
                    key={tool.route}
                    href={tool.route}
                    className="group flex items-center gap-4 p-4 rounded-xl hover:bg-blue-50 transition border border-transparent hover:border-blue-200 focus:ring-2 focus:ring-blue-300"
                  >
                    <div className="text-4xl text-blue-600 group-hover:scale-105 transition-transform flex-shrink-0 w-10">
                      <Icon className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="font-semibold text-base text-slate-800 group-hover:text-blue-700 transition">
                        {tool.name}
                      </div>
                      <div className="text-xs text-slate-600 line-clamp-1">{tool.description}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      ))}

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-10 shadow-xl">
          <h2 className="text-3xl font-bold mb-10 text-center text-gray-800">Why Choose PDF Maker AI?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4 shadow-lg">
                ⚡
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Fast & Easy</h3>
              <p className="text-sm text-slate-600">
                Process your files in seconds with our intuitive interface. No learning curve required.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4 shadow-lg">
                🔒
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Secure & Private</h3>
              <p className="text-sm text-slate-600">
                Your files are automatically deleted after processing. We respect your privacy.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4 shadow-lg">
                🧠
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">AI-Powered Solution</h3>
              <p className="text-sm text-slate-600">
                Everything you need for PDFs, including advanced AI tools like OCR and Chat with PDF.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
