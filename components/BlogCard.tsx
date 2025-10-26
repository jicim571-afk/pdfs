import Link from "next/link";

const categoryColors = {
  PDF: "bg-blue-100 text-blue-800",
  Image: "bg-purple-100 text-purple-800",
  Document: "bg-green-100 text-green-800",
  Utilities: "bg-orange-100 text-orange-800",
  AI: "bg-red-100 text-red-800",
  Productivity: "bg-indigo-100 text-indigo-800",
  UX: "bg-pink-100 text-pink-800",
};

type CategoryKey = keyof typeof categoryColors;

type Props = {
  title: string;
  excerpt: string;
  href: string;
  icon?: string;
  category?: CategoryKey | string;
  readingTime?: string;
  date?: string;
};

function estimateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

export default function BlogCard({
  title,
  excerpt,
  href,
  icon,
  category,
  readingTime,
  date,
}: Props) {
  const categoryColor = category && categoryColors[category as CategoryKey] || "bg-slate-100 text-slate-800";

  return (
    <Link href={href}>
      <article
        className="group relative overflow-hidden rounded-xl bg-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
      >
        {/* Card Header with Gradient */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
          
          {/* Large Icon Display */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-6xl opacity-20 transition-opacity group-hover:opacity-30">
            {icon}
          </div>
          
          {/* Category Badge */}
          {category && (
            <span
              className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-medium ${categoryColor}`}
            >
              {category}
            </span>
          )}
        </div>

        {/* Content Area */}
        <div className="p-6">
          <header className="mb-4">
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
            
            {/* Meta Information */}
            <div className="mt-2 flex items-center gap-4 text-xs text-slate-600">
              {date && (
                <time className="flex items-center gap-1">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {date}
                </time>
              )}
              {readingTime && (
                <span className="flex items-center gap-1">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {readingTime}
                </span>
              )}
            </div>
          </header>

          <p className="mb-4 text-sm text-slate-600 line-clamp-3">
            {excerpt}
          </p>

          <span className="inline-flex items-center text-sm font-medium text-blue-600 transition-colors group-hover:text-blue-700">
            Read article
            <span className="ml-1 transition-transform group-hover:translate-x-0.5">→</span>
          </span>
        </div>
      </article>
    </Link>
  );
}
