import Link from 'next/link';
import { Clock, Eye, Calendar } from 'lucide-react';
import { formatDate, formatNumber } from '@/lib/utils';

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImage: string | null;
  views: number | null;
  publishedAt: Date | null;
  createdAt: Date | null;
  author?: { name: string } | null;
  category?: { name: string; slug: string; icon: string | null } | null;
  tags?: { name: string; slug: string }[] | null;
};

type BlogCardProps = {
  post: Post;
  variant?: 'default' | 'featured' | 'compact';
};

export function BlogCard({ post, variant = 'default' }: BlogCardProps) {
  const imageUrl = post.featuredImage;
  const categoryName = post.category?.name || '';
  const _categorySlug = post.category?.slug || '';
  const categoryIcon = post.category?.icon || '';
  const displayDate = post.publishedAt
    ? formatDate(new Date(post.publishedAt))
    : post.createdAt
      ? formatDate(new Date(post.createdAt))
      : '';

  if (variant === 'featured') {
    return (
      <Link href={`/blog/${post.slug}`} className="group block h-full">
        <div className="card overflow-hidden h-full flex flex-col group-hover:border-primary-300 dark:group-hover:border-primary-700 group-hover:shadow-xl transition-all duration-300">
          {/* Image */}
          <div className="relative h-52 bg-gradient-to-br from-primary-100 via-primary-50 to-indigo-100 dark:from-primary-900/40 dark:via-primary-800/30 dark:to-indigo-900/40 overflow-hidden">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-5xl opacity-80 group-hover:scale-110 transition-transform duration-300">
                  {categoryIcon || '📝'}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {/* Category badge on image */}
            {categoryName && (
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/95 dark:bg-gray-900/95 backdrop-blur text-primary-700 dark:text-primary-300 rounded-full text-xs font-bold shadow-lg">
                  {categoryIcon} {categoryName}
                </span>
              </div>
            )}
            {/* Hover overlay text */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="px-5 py-2 bg-white text-primary-700 rounded-full text-sm font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                Read Article →
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col flex-1">
            <h3 className="font-display font-bold text-xl mb-3 leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-1 leading-relaxed">
                {post.excerpt}
              </p>
            )}
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-dark-border">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
                  {(post.author?.name || 'A').charAt(0).toUpperCase()}
                </div>
                <span className="font-medium">{post.author?.name || 'Anonymous'}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {displayDate}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {formatNumber(post.views || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link href={`/blog/${post.slug}`} className="group block">
        <div className="card p-4 flex gap-4 group-hover:border-primary-300 dark:group-hover:border-primary-700 group-hover:shadow-lg transition-all duration-200">
          <div className="shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/40 dark:to-primary-800/30 flex items-center justify-center text-2xl overflow-hidden">
            {imageUrl ? (
              <img src={imageUrl} alt={post.title} className="w-full h-full object-cover" />
            ) : (
              <span>{categoryIcon || '📝'}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-sm mb-1 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug">
              {post.title}
            </h3>
            <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
              <span>{categoryIcon} {categoryName}</span>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <span className="flex items-center gap-0.5">
                <Eye className="w-3 h-3" />
                {formatNumber(post.views || 0)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Default variant
  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <div className="card overflow-hidden h-full flex flex-col group-hover:border-primary-300 dark:group-hover:border-primary-700 group-hover:shadow-xl transition-all duration-300">
        {/* Image */}
        <div className="relative h-48 bg-gradient-to-br from-primary-100 via-primary-50 to-indigo-100 dark:from-primary-900/40 dark:via-primary-800/30 dark:to-indigo-900/40 overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-5xl opacity-80 group-hover:scale-110 transition-transform duration-300">
                {categoryIcon || '📝'}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          {/* Category badge */}
          {categoryName && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/95 dark:bg-gray-900/95 backdrop-blur text-primary-700 dark:text-primary-300 rounded-full text-xs font-bold shadow-lg">
                {categoryIcon} {categoryName}
              </span>
            </div>
          )}
          {/* Read time / views badge */}
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-black/50 backdrop-blur text-white rounded-full text-[11px] font-medium">
              <Eye className="w-3 h-3" />
              {formatNumber(post.views || 0)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          <h3 className="font-display font-bold text-lg mb-3 leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-1 leading-relaxed">
              {post.excerpt}
            </p>
          )}
          {/* Meta info */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-dark-border">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
                {(post.author?.name || 'A').charAt(0).toUpperCase()}
              </div>
              <span className="font-medium truncate max-w-[100px]">{post.author?.name || 'Anonymous'}</span>
            </div>
            <span className="flex items-center gap-1 text-gray-400">
              <Clock className="w-3 h-3" />
              {displayDate}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
