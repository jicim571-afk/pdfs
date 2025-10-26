export const metadata = {
  title: "Batch Processing — PDFMakerAI",
  description: "Run actions on multiple files at once — convert, compress, watermark and more.",
};

export default function BatchProcessingPage() {
  return (
    <main>
      <section className="bg-white rounded-lg shadow-sm p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold mb-3">Batch Processing</h1>
          <p className="text-slate-700 mb-4">
            Save time by applying operations to many files in one job. Useful
            for large document sets and repetitive workflows.
          </p>

          <div className="mt-6">
            <a href="/batch-processing" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md">Open Batch Processing</a>
          </div>
        </div>
      </section>
    </main>
  );
}
