export const metadata = {
  title: "E-Signature — PDFMakerAI",
  description: "Sign and request signatures on PDF documents securely.",
};

export default function ESignaturePage() {
  return (
    <main>
      <section className="bg-white rounded-lg shadow-sm p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold mb-3">E-Signature</h1>
          <p className="text-slate-700 mb-4">
            Add signatures to PDFs, request signatures from others, and
            verify signed documents — built for business workflows.
          </p>

          <div className="mt-6">
            <a href="/e-signature" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md">Open E-Signature</a>
          </div>
        </div>
      </section>
    </main>
  );
}
