'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Eye, Calendar, ChevronRight, Clock } from 'lucide-react';
import { readingTime, formatNumber } from '@/lib/utils';
import type { Post } from '@prisma/client';

interface BlogCardProps {
  post: Post & {
    author?: { name: string };
    category?: { name: string; slug: string; icon: string };
  };
  variant?: 'default' | 'featured' | 'horizontal';
}

export function BlogCard({ post, variant = 'default' }: BlogCardProps) {
  const readTime = readingTime(post.content);
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  if (variant === 'featured') {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group relative h-72 md:h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-600 to-indigo-700 flex items-end p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.07]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Category badge */}
        <div className="absolute top-5 left-5 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold text-white border border-white/20">
            {post.category?.icon} {post.category?.name || 'Blog'}
          </span>
        </div>

        {/* Featured badge */}
        <span className="absolute top-5 right-5 px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full z-10">
          Featured
        </span>

        {/* Content */}
        <div className="relative z-10">
          <h3 className="font-display font-bold text-xl md:text-2xl text-white mb-2 group-hover:text-blue-200 transition-colors leading-tight line-clamp-2">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-sm text-blue-100/80 line-clamp-2 mb-3 hidden md:block">
              {post.excerpt}
            </p>
          )}
          <div className="flex items-center gap-4 text-xs text-blue-200">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {readTime}m read
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {formatNumber(post.views || 0)}
            </span>
          </div>
        </div>

        {/* Hover arrow */}
        <div className="absolute top-1/2 right-6 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
          <ChevronRight className="w-6 h-6 text-white/70" />
        </div>
      </Link>
    );
  }

  if (variant === 'horizontal') {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group flex gap-4 p-4 rounded-xl bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-300"
      >
        {/* Thumbnail */}
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-800 relative">
          {post.featuredImage ? (
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl bg-gradient-to-br from-primary-100 to-indigo-100 dark:from-primary-900 dark:to-indigo-900">
              {post.category?.icon || '📝'}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 py-1">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium mb-2">
            {post.category?.icon} {post.category?.name || 'Blog'}
          </span>
          <h3 className="font-display font-bold text-sm md:text-base text-gray-900 dark:text-white mb-1.5 group-hover:text-primary-600 transition-colors line-clamp-2 leading-tight">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mb-2 hidden sm:block">
              {post.excerpt}
            </p>
          )}
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span>{post.author?.name || 'Anonymous'}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span>{readTime}m</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span>{formatNumber(post.views || 0)} views</span>
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all self-center shrink-0" />
      </Link>
    );
  }

  // Default card variant
  return (
    <article
      className="group bg-white dark:bg-dark-card rounded-2xl overflow-hidden border border-gray-100 dark:border-dark-border hover:shadow-xl hover:shadow-primary-500/5 hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-500 hover:-translate-y-1"
    >
      {/* Image */}
      <Link href={`/blog/${post.slug}`} className="block relative">
        <div className="aspect-[16/10] bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
          {post.featuredImage ? (
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-primary-100 via-indigo-100 to-purple-100 dark:from-primary-900/40 dark:via-indigo-900/40 dark:to-purple-900/40">
              {post.category?.icon || '📝'}
            </div>
          )}

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Category badge */}
          {post.category && (
            <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 dark:bg-dark-bg/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 dark:text-gray-200 border border-white/20">
              {post.category.icon} {post.category.name}
            </span>
          )}

          {/* Reading time badge */}
          <span className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/50 backdrop-blur-sm rounded-full text-xs text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {readTime} min read
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 md:p-6">
        <Link href={`/blog/${post.slug}`}>
          <h3 className="font-display font-bold text-base md:text-lg text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors leading-snug line-clamp-2">
            {post.title}
          </h3>
        </Link>

        {post.excerpt && (
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {/* Meta row */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">
              {(post.author?.name || '?').charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 block">
                {post.author?.name || 'Anonymous'}
              </span>
              {date && (
                <span className="text-[11px] text-gray-400">{date}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {formatNumber(post.views || 0)}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
