export const metadata = {
  title: "Cloud Integration — PDFMakerAI",
  description: "Connect Google Drive and Dropbox to import and export files seamlessly.",
};

export default function CloudIntegrationPage() {
  return (
    <main>
      <section className="bg-white rounded-lg shadow-sm p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold mb-3">Cloud Integration</h1>
          <p className="text-slate-700 mb-4">
            Connect your Google Drive or Dropbox account to import files
            directly and export processed files back to cloud storage.
          </p>

          <div className="mt-6">
            <a href="/cloud-integration" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md">Connect cloud</a>
          </div>
        </div>
      </section>
    </main>
  );
}
