export const metadata = {
  title: "Conversion Suite — PDFMakerAI",
  description: "Convert PDFs to Word/Excel/PPT and back with layout preservation options.",
};

export default function ConversionSuitePage() {
  return (
    <main>
      <section className="bg-white rounded-lg shadow-sm p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold mb-3">Conversion Suite</h1>
          <p className="text-slate-700 mb-4">
            A professional-grade conversion toolkit: export PDFs to editable
            Word, Excel, or PowerPoint files, and convert those formats back
            to PDF while preserving layout.
          </p>

          <div className="mt-6">
            <a href="/conversion-suite" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md">Open Conversion Suite</a>
          </div>
        </div>
      </section>
    </main>
  );
}
