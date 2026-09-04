'use client';

import Link from 'next/link';

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
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href="/blog"
        className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
          !currentSlug
            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        All
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/blog?category=${cat.slug}`}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            currentSlug === cat.slug
              ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {cat.icon && <span>{cat.icon}</span>}
          {cat.name}
          {cat._count && cat._count.posts > 0 && (
            <span className={`text-xs ${
              currentSlug === cat.slug
                ? 'text-gray-500 dark:text-gray-400'
                : 'text-gray-400'
            }`}>
              ({cat._count.posts})
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}
