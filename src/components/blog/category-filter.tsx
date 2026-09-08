'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  _count?: { posts: number };
}

interface CategoryFilterProps {
  categories: CategoryItem[];
  currentSlug?: string;
}

export function CategoryFilter({ categories, currentSlug }: CategoryFilterProps) {
  const [showAll, setShowAll] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Only categories that have published posts
  const visible = (categories || []).filter(c => (c._count?.posts ?? 0) > 0);

  // Primary = top 8 by count
  const primary = [...visible]
    .sort((a, b) => (b._count?.posts ?? 0) - (a._count?.posts ?? 0))
    .slice(0, 8);

  // Everything else goes in "More"
  const primaryIds = new Set(primary.map(c => c.id));
  const more = visible.filter(c => !primaryIds.has(c.id));

  const isActive = (slug?: string) => currentSlug === slug || (!currentSlug && !slug);
  const pillClass = (active: boolean) =>
    `inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 border ${
      active
        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white shadow-sm'
        : 'bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 border-gray-200 dark:border-dark-border hover:border-gray-400 dark:hover:border-gray-500'
    }`;

  return (
    <div className="relative">
      {/* Primary row: scrollable on mobile, wrapped on desktop */}
      <div className="flex items-center gap-2">
        <div
          ref={scrollRef}
          className="flex-1 flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1 pb-1"
          style={{ scrollbarWidth: 'none' }}
        >
          <Link href="/blog" className={pillClass(isActive(undefined))}>
            All
          </Link>
          {primary.map((cat) => (
            <Link
              key={cat.id}
              href={`/blog?category=${cat.slug}`}
              className={pillClass(isActive(cat.slug))}
            >
              {cat.icon && <span>{cat.icon}</span>}
              <span>{cat.name}</span>
              <span className={`text-xs ${isActive(cat.slug) ? 'opacity-70' : 'text-gray-400'}`}>
                {cat._count?.posts}
              </span>
            </Link>
          ))}
          {more.length > 0 && (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-gray-100 dark:bg-dark-card text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-border transition-colors"
            >
              More
              <span className="text-xs text-gray-400">({more.length})</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Slide-down panel for the rest */}
      {showAll && more.length > 0 && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowAll(false)}
          />
          <div className="absolute left-0 right-0 mt-2 z-40 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl shadow-xl p-4 max-h-80 overflow-y-auto">
            <div className="flex items-center justify-between mb-3 sticky top-0 bg-white dark:bg-dark-card pb-2">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                All categories
              </h3>
              <button
                type="button"
                onClick={() => setShowAll(false)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-border"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {more.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/blog?category=${cat.slug}`}
                  onClick={() => setShowAll(false)}
                  className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    currentSlug === cat.slug
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium'
                      : 'hover:bg-gray-50 dark:hover:bg-dark-border text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="flex items-center gap-1.5 truncate">
                    {cat.icon && <span>{cat.icon}</span>}
                    <span className="truncate">{cat.name}</span>
                  </span>
                  <span className="text-xs text-gray-400">{cat._count?.posts}</span>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
