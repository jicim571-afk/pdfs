export const metadata = {
  title: "About Us — PDF Maker AI",
  description: "Learn about PDF Maker AI's mission to provide free, AI-powered PDF tools for everyone. Discover our story, values, and commitment to privacy.",
};

export default function AboutPage() {
  return (
    <main className="max-w-5xl mx-auto">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <div className="inline-block mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl mx-auto">
            <span className="text-white text-4xl">📄</span>
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
            About PDF Maker AI
          </span>
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Empowering everyone with free, intelligent PDF tools that respect your privacy
        </p>
      </section>

      {/* Mission Section */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
        <div className="flex items-start gap-6">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">🎯</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4 text-slate-800">Our Mission</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              At PDF Maker AI, we believe that powerful document tools shouldn't come with a price tag or compromise your privacy. 
              Our mission is to democratize PDF manipulation by providing professional-grade tools that are completely free, 
              easy to use, and powered by cutting-edge AI technology.
            </p>
            <p className="text-slate-600 leading-relaxed">
              We're committed to making document work faster, simpler, and more accessible for students, professionals, 
              small businesses, and anyone who works with PDFs daily.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 mb-8">
        <div className="flex items-start gap-6">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-2xl">📖</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4 text-slate-800">Our Story</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              PDF Maker AI was born from a simple frustration: existing PDF tools were either expensive, 
              required account signups, or lacked essential features. We envisioned a platform where anyone 
              could access premium PDF tools instantly, without barriers.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              What started as a basic PDF merger has evolved into a comprehensive suite of 25+ tools, 
              enhanced with AI capabilities like OCR and intelligent document analysis. Today, thousands 
              of users worldwide trust PDF Maker AI for their daily document needs.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center text-slate-800">Our Core Values</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-800">Privacy First</h3>
            <p className="text-slate-600 leading-relaxed">
              Your documents are your business. We process files securely and delete them immediately after. 
              No storage, no tracking, no compromises.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-800">Speed & Simplicity</h3>
            <p className="text-slate-600 leading-relaxed">
              No learning curve, no complex interfaces. Get your work done in seconds with intuitive tools 
              designed for efficiency.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🤝</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-800">Accessibility</h3>
            <p className="text-slate-600 leading-relaxed">
              Professional tools shouldn't be locked behind paywalls. We're committed to keeping our core 
              features free forever.
            </p>
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
        <div className="flex items-start gap-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">🤖</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4 text-slate-800">Powered by AI</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We leverage the latest in artificial intelligence and machine learning to provide features like:
            </p>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start gap-3">
                <span className="text-indigo-600 mt-1">→</span>
                <span><strong>AI OCR:</strong> Extract text from scanned documents with industry-leading accuracy</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600 mt-1">→</span>
                <span><strong>Smart Compression:</strong> Reduce file sizes while maintaining visual quality</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-pink-600 mt-1">→</span>
                <span><strong>Intelligent Splitting:</strong> Automatically detect logical document sections</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-600 mt-1">→</span>
                <span><strong>Chat with PDF:</strong> Ask questions about your documents using natural language</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-8 mb-8 text-white">
        <h2 className="text-3xl font-bold mb-8 text-center">By the Numbers</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl font-extrabold mb-2">25+</div>
            <div className="text-indigo-100">PDF Tools</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-extrabold mb-2">100%</div>
            <div className="text-purple-100">Free Forever</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-extrabold mb-2">0</div>
            <div className="text-pink-100">Signup Required</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-extrabold mb-2">24/7</div>
            <div className="text-indigo-100">Available</div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="text-center bg-slate-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-4 text-slate-800">Get in Touch</h2>
        <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
          Have questions, suggestions, or partnership inquiries? We'd love to hear from you.
        </p>
        <a 
          href="/contact"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
        >
          Contact Us
          <span>→</span>
        </a>
      </section>
    </main>
  );
}
