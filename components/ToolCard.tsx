import Link from "next/link";
import { type LucideIcon } from "lucide-react";
import React from "react";

interface ToolCardProps {
  name: string;
  route: string;
  icon: LucideIcon; // LucideIcon type
  description: string;
  category?: string;
}

export default function ToolCard({
  name,
  route,
  icon: Icon,
  description,
  category,
}: ToolCardProps) {
  return (
    <Link
      href={route}
      className="block" // Link ko block banaya taki pura card clickable ho
    >
  <article className="bg-white border-b-4 border-transparent hover:border-primary-500 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-primary-300 cursor-pointer">
        <div className="flex items-start gap-5">
          {/* Icon Area */}
          <div className="p-3 bg-primary-50 text-primary-600 rounded-lg text-4xl flex-shrink-0">
            <Icon className="w-6 h-6" />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              {/* Title */}
              <h3 className="text-xl font-bold text-gray-800">{name}</h3>

              {/* Category Tag */}
              {category && (
                <span className="text-xs bg-purple-100 text-purple-700 font-medium px-2.5 py-1 rounded-full whitespace-nowrap">
                  {category}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="mt-2 text-sm text-gray-500 line-clamp-3">{description}</p>
          </div>
        </div>
      </article>
    </Link>
  );
}
