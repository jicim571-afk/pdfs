import { notFound } from "next/navigation";
import { tools } from "@/lib/tools";
import { LucideIcon } from "lucide-react"; // Add this import if needed

export async function generateMetadata({ params }: any) {
  const slug = params.slug as string;
  const tool = tools.find((t) => t.route.replace(/^\//, "") === slug);
  if (!tool) return { title: "Tool" };
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pdfmakerai.shop";
  const url = `${siteUrl}/${slug}`.replace(/([^:]?)\/\/+/g, "$1/");

  return {
    title: `${tool.name} — PDF Maker AI`,
    description: tool.longDescription || tool.description,
    openGraph: {
      title: `${tool.name} — PDF Maker AI`,
      description: tool.longDescription || tool.description,
      url,
      images: [`${siteUrl}/og-image.svg`],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tool.name} — PDF Maker AI`,
      description: tool.longDescription || tool.description,
      images: [`${siteUrl}/og-image.svg`],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default function ToolDescription({ params }: any) {
  const slug = params.slug as string;
  const tool = tools.find((t) => t.route.replace(/^\//, "") === slug);
  if (!tool) return notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pdfmakerai.shop";
  const toolUrl = `${siteUrl}${tool.route}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.longDescription || tool.description,
    applicationCategory: tool.category || "WebApplication",
    url: toolUrl,
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://pdfmakerai.shop/"},
      {"@type": "ListItem", "position": 2, "name": "Tools", "item": "https://pdfmakerai.shop/tools"},
      {"@type": "ListItem", "position": 3, "name": tool.name, "item": toolUrl}
    ]
  };

  // ✅ Convert icon to JSX element
  const Icon = tool.icon as LucideIcon;

  return (
    <main>
      <section className="bg-white rounded-lg shadow-sm p-8 mb-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-4xl mb-2">
            <Icon className="w-10 h-10 text-blue-600" /> {/* Render as JSX element */}
          </div>
          <h1 className="text-3xl font-extrabold mb-2">{tool.name}</h1>
          <p className="text-slate-600 mb-4">{tool.description}</p>
          {tool.longDescription && (
            <p className="text-slate-700 mb-4">{tool.longDescription}</p>
          )}

          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">How to use</h2>
            <p className="text-sm text-slate-700">
              Open the tool and follow the on-screen instructions. You can also
              access the tool directly here:
              <a href={tool.route} className="text-blue-600 underline ml-2">
                {tool.name}
              </a>
            </p>
          </div>

          <div className="mt-6">
            <h3 className="text-md font-semibold">Benefits</h3>
            <ul className="list-disc ml-5 text-sm text-slate-700">
              <li>Fast, browser-based — no upload delays.</li>
              <li>Privacy-focused: files are processed temporarily.</li>
              <li>Free to use for basic tasks.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* JSON-LD structured data for the tool */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
    </main>
  );
}
