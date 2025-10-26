export const metadata = {
  title: "Contact Us — PDF Maker AI",
  description: "Get in touch with PDF Maker AI for support, feedback, partnerships, or any questions. We're here to help!",
};

export default function ContactPage() {
  return (
    <main className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
            Get in Touch
          </span>
        </h1>
        <p className="text-xl text-slate-600">
          Have questions or feedback? We'd love to hear from you!
        </p>
      </section>

      {/* Contact Methods */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Email Support */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:shadow-lg transition">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-3 text-slate-800">Email Support</h2>
          <p className="text-slate-600 mb-4">
            For technical support, bug reports, or general inquiries, reach out to our support team.
          </p>
          <a 
            href="mailto:support@pdfmakerai.shop" 
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-purple-600 font-semibold"
          >
            support@pdfmakerai.shop
            <span>→</span>
          </a>
          <div className="mt-4 pt-4 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              ⏱️ Response time: Usually within 24 hours
            </p>
          </div>
        </div>

        {/* Business Inquiries */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:shadow-lg transition">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-3 text-slate-800">Business Inquiries</h2>
          <p className="text-slate-600 mb-4">
            Interested in partnerships, API access, or enterprise solutions? Let's talk.
          </p>
          <a 
            href="mailto:business@pdfmakerai.shop" 
            className="inline-flex items-center gap-2 text-purple-600 hover:text-pink-600 font-semibold"
          >
            business@pdfmakerai.shop
            <span>→</span>
          </a>
          <div className="mt-4 pt-4 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              💼 We're open to collaboration
            </p>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <section className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-8 mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">Send us a Message</h2>
        <form className="max-w-2xl mx-auto space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
              placeholder="How can we help you?"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition resize-none"
              placeholder="Tell us more about your inquiry..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
          >
            Send Message
          </button>
        </form>
      </section>

      {/* FAQ Section */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg text-slate-800 mb-2">
              How quickly will I receive a response?
            </h3>
            <p className="text-slate-600">
              We aim to respond to all inquiries within 24 hours during business days. For urgent technical issues, 
              we prioritize support tickets and typically respond within a few hours.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-slate-800 mb-2">
              Do you offer enterprise or API solutions?
            </h3>
            <p className="text-slate-600">
              Yes! We provide custom API access and enterprise plans for businesses with high-volume needs. 
              Contact us at business@pdfmakerai.shop to discuss your requirements.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-slate-800 mb-2">
              Can I report a bug or request a feature?
            </h3>
            <p className="text-slate-600">
              Absolutely! We welcome bug reports and feature suggestions. Please email support@pdfmakerai.shop 
              with detailed information, and we'll review your feedback carefully.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-slate-800 mb-2">
              Are you hiring or accepting contributors?
            </h3>
            <p className="text-slate-600">
              We're always interested in talented developers and designers who share our passion for creating 
              great tools. Send your portfolio or resume to business@pdfmakerai.shop.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
