export const metadata = {
  title: "Privacy Policy — My Tools",
  description: "Privacy policy describing how My Tools handles files, logs and personal data.",
};

export default function PrivacyPage() {
  return (
    <main>
      <section className="bg-white rounded-lg shadow-sm p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold mb-3">Privacy Policy</h1>
          <p className="text-slate-700 mb-3">
            We take privacy seriously. Files you upload are processed
            temporarily and removed shortly after processing. We do not sell
            your data or use it for behavioral targeting. This page outlines
            what we collect, how we use it, and how you can contact us.
          </p>

          <h2 className="text-lg font-semibold mt-4">What we collect</h2>
          <p className="text-sm text-slate-700">
            We may collect non-identifying usage data (page views, errors)
            to improve the service. Files you upload are used only for the
            requested operation and removed afterward. We do not keep
            file contents longer than necessary.
          </p>

          <h2 className="text-lg font-semibold mt-4">Data retention</h2>
          <p className="text-sm text-slate-700">
            Uploaded files are retained only for the time required to perform
            the requested operation and then deleted from our servers.
            Where temporary logs exist for debugging, they are purged regularly.
            For clarity: files uploaded for processing are automatically deleted within 24 hours by default. If you need a different retention policy for business/enterprise needs, contact support@pdfmakerai.shop to discuss options.
          </p>

          <h2 className="text-lg font-semibold mt-4">Cookies and analytics</h2>
          <p className="text-sm text-slate-700">
            We may use minimal analytics to monitor performance. Analytics are
            aggregated and non-identifying. If you prefer not to be tracked,
            you can opt out using browser settings or a privacy extension.
          </p>

          <h2 className="text-lg font-semibold mt-4">Third-party services</h2>
          <p className="text-sm text-slate-700">
            We may use third-party services for hosting, analytics, or
            payments. These services have their own privacy policies. We do
            not share uploaded file contents with third parties except as
            required to perform the requested operation.
          </p>

          <h2 className="text-lg font-semibold mt-4">Ads & advertising partners</h2>
          <p className="text-sm text-slate-700">
            If ads are displayed on the site (e.g. via Google AdSense),
            advertising providers may use cookies to serve ads. See our
            Cookie and Ads section for more details. We do not use personal
            data for ad targeting ourselves.
          </p>

          <h2 className="text-lg font-semibold mt-4">Your rights</h2>
          <p className="text-sm text-slate-700">
            You may contact us to request removal of account data or to ask
            questions about how we process information. For contact, see the
            Contact page.
          </p>

          <p className="text-xs text-slate-500 mt-4">Last updated: 24 Oct 2025</p>
        </div>
      </section>
    </main>
  );
}
