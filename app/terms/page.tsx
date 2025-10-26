export const metadata = {
  title: "Terms of Service — My Tools",
  description: "Terms of service for using My Tools online utilities.",
};

export default function TermsPage() {
  return (
    <main>
      <section className="bg-white rounded-lg shadow-sm p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold mb-3">Terms of Service</h1>
          <p className="text-slate-700 mb-3">
            By using My Tools you agree that the service is provided "as-is".
            Use responsibly and ensure you have the right to process any files
            you upload. These Terms govern your use of the website and tools.
          </p>

          <h2 className="text-lg font-semibold mt-4">Acceptable use</h2>
          <p className="text-sm text-slate-700">
            You must not use the service to process content that infringes
            intellectual property rights, is illegal, defamatory, or contains
            malware. We reserve the right to suspend or remove content that
            violates these terms.
          </p>

          <h2 className="text-lg font-semibold mt-4">Limitation of liability</h2>
          <p className="text-sm text-slate-700">
            To the extent permitted by law, the service is provided without
            warranties and we are not liable for indirect or consequential
            damages. Use at your own risk — always keep backup copies of
            important files.
          </p>

          <h2 className="text-lg font-semibold mt-4">DMCA and copyright</h2>
          <p className="text-sm text-slate-700">
            If you believe your copyrighted work has been posted in violation
            of copyright law, contact us with a DMCA takedown notice and we
            will respond promptly.
          </p>

          <h2 className="text-lg font-semibold mt-4">Contact and disputes</h2>
          <p className="text-sm text-slate-700">
            For questions about these Terms, contact support@pdfmakerai.shop.
          </p>
        </div>
      </section>
    </main>
  );
}
