import { tools } from "@/lib/tools";
import { notFound } from "next/navigation";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { promises as fs } from 'fs';
import path from 'path';

function slugFromRoute(route: string) {
  return route.replace(/^\//, "");
}

function generateArticle(tool: any) {
  const title = `${tool.name}: Ultimate Guide & How-to`;
  const intro = `${tool.longDescription || tool.description} In this guide you'll learn how to use ${tool.name} effectively, best practices, and tips to get the best results.`;

  const features = [
    tool.description,
    `Fast, browser-based processing with no signup required`,
    `Privacy-first handling — files are deleted shortly after processing`,
  ];

  const steps = [
    `Open the ${tool.name} tool page at ${tool.route}.`,
    `Upload your file(s) or paste your content depending on the tool's input types.`,
    `Choose options such as output format, compression level, or pages to process.`,
    `Click the primary action button and download the result when ready.`,
  ];

  const faqs = [
    {
      q: "Is this free to use?",
      a: `Most ${tool.name} features are available for free with reasonable limits. Check the site for any premium options.`,
    },
    {
      q: "Is my file private?",
      a: `We delete files from our servers shortly after processing. See the Privacy page for details on retention and data handling.`,
    },
  ];

  return { title, intro, features, steps, faqs };
}

async function getArticleContent(tool: any) {
  if (tool.blogContent) {
    try {
      const filePath = path.join(process.cwd(), 'app/blog/content', tool.blogContent);
      const content = await fs.readFile(filePath, 'utf8');
      return content;
    } catch (error) {
      console.error('Error reading blog content:', error);
      return null;
    }
  }
  return null;
}

export function generateStaticParams() {
  return tools.map((t) => ({ slug: slugFromRoute(t.route) }));
}

export async function generateMetadata({ params }: any) {
  const tool = tools.find((t) => slugFromRoute(t.route) === params.slug);
  if (!tool) return { title: "Not found" };
  return {
    title: `${tool.name} Guide & Tutorial | PDFMakerAI Blog`,
    description: tool.longDescription || tool.description,
    openGraph: {
      title: `${tool.name} - Complete Guide & Tutorial`,
      description: tool.longDescription || tool.description,
      type: 'article',
      authors: ['PDFMakerAI Team'],
      publishedTime: new Date().toISOString(),
    },
  };
}

export default async function BlogPostPage({ params }: any) {
  const tool = tools.find((t) => slugFromRoute(t.route) === params.slug);
  if (!tool) return notFound();

  const customContent = await getArticleContent(tool);
  
  if (customContent) {
    return (
      <main className="max-w-4xl mx-auto p-6">
        <article className="prose prose-slate max-w-none">
          <MarkdownRenderer content={customContent} />
          
          <hr className="my-8" />
          
          <footer className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Ready to try it yourself?</h3>
            <p className="mb-4">
              Now that you've learned about {tool.name}, put your knowledge into practice.
            </p>
            <a 
              href={tool.route}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Try {tool.name} Now
              <span className="ml-2">→</span>
            </a>
          </footer>
        </article>
      </main>
    );
  }

  const article = generateArticle(tool);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <article className="prose prose-slate max-w-none">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <time>Published: {new Date().toLocaleDateString()}</time>
            <span>·</span>
            <span>8 min read</span>
          </div>
        </header>

        <section className="mb-8">
          <p className="text-lg leading-relaxed">{article.intro}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Key Features</h2>
          <ul className="space-y-2">
            {article.features.map((f: string, i: number) => (
              <li key={i} className="flex items-start">
                <span className="mr-2">•</span>
                {f}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">How to Use {tool.name}</h2>
          <ol className="space-y-4">
            {article.steps.map((s: string, i: number) => (
              <li key={i} className="flex">
                <span className="mr-4 font-bold">{i + 1}.</span>
                {s}
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Best Practices</h2>
          <p>For best results, use high-quality source files, and choose options that balance size & quality depending on your needs.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {article.faqs.map((f: any, i: number) => (
              <div key={i} className="p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold mb-2">{f.q}</h3>
                <p className="text-slate-700">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Ready to try it yourself?</h3>
          <p className="mb-4">
            Now that you've learned about {tool.name}, put your knowledge into practice.
          </p>
          <a 
            href={tool.route}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Try {tool.name} Now
            <span className="ml-2">→</span>
          </a>
        </footer>
      </article>
    </main>
  );
}