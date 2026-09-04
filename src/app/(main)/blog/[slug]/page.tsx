import { db } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Clock, Eye, Calendar, Tag, Bookmark, Share2, ArrowLeft, Home,
  ChevronRight, TrendingUp, BookOpen, User /* Sparkles */
} from 'lucide-react';
import { Metadata } from 'next';
import { readingTime, formatNumber } from '@/lib/utils';
import { JsonLd } from '@/components/seo/json-ld';
import { BlogCard } from '@/components/blog/blog-card';
import { ReadingProgressBar } from '@/components/ui/reading-progress-bar';
import { TableOfContents } from '@/components/blog/table-of-contents';
import { InArticleAd as _InArticleAd } from '@/components/ads/ad-slot';

type Params = Promise<{ slug: string }>;

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = await db.post.findUnique({
    where: { slug },
    include: { author: { select: { name: true } }, category: { select: { name: true, icon: true } } },
  });
  if (!post) return {};
  return {
    title: `${post.title} | Blog-Ghar`,
    description: post.excerpt || post.content?.slice(0, 160).replace(/<[^>]*>/g, ''),
    alternates: { canonical: `https://bloghar.com/blog/${post.slug}` },
    openGraph: { title: post.title, description: post.excerpt || '', type: 'article' },
  };
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await db.post.findUnique({
    where: { slug },
    include: {
      author: { select: { name: true, image: true } },
      category: { select: { name: true, slug: true, icon: true } },
      tags: { select: { id: true, name: true, slug: true } },
    },
  });
  if (!post) notFound();

  try {
    await db.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } });
  } catch (err) {
    console.error('Failed to increment post view count:', err);
  }

  let relatedPosts: any[] = [];
  try {
    relatedPosts = await db.post.findMany({
      where: {
        categoryId: post.categoryId,
        NOT: { id: post.id },
        status: 'PUBLISHED',
        postType: 'BLOG',
      },
      take: 3,
      orderBy: { publishedAt: 'desc' },
      include: {
        author: { select: { name: true } },
        category: { select: { name: true, slug: true, icon: true } },
      },
    });
  } catch (err) {
    console.error('Failed to fetch related posts:', err);
  }

  const readTime = readingTime(post.content);
  const wordCount = post.content ? post.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length : 0;
  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  // Inject heading IDs for TOC anchor links
  const contentWithIds = post.content?.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/g,
    (match: string, level: string, attrs: string, inner: string) => {
      const existingId = attrs.match(/id="([^"]+)"/);
      if (existingId) return match;
      const text = inner.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').slice(0, 60);
      if (!id || id.length < 3) return match;
      return `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
    }
  ) || '';

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || '',
    url: `https://bloghar.com/blog/${post.slug}`,
    datePublished: post.publishedAt?.toISOString(),
    author: { '@type': 'Person', name: post.author?.name || 'Blog-Ghar' },
    image: post.featuredImage || `https://bloghar.com/og-blog-${post.slug}.png`,
  };

  return (
    <>
      <JsonLd type="Article" data={articleSchema} />
      <ReadingProgressBar />
      <div className="min-h-screen bg-gray-50/50 dark:bg-dark-bg">
        {/* Enhanced Breadcrumb Navigation */}
        <div className="max-w-6xl mx-auto px-4 pt-6">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <Link href="/blog" className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Blog
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <span className="text-gray-600 dark:text-gray-300 font-medium truncate max-w-[180px] md:max-w-[300px]">
              {post.title}
            </span>
          </nav>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Article Layout: TOC sidebar + main content */}
          <div className="flex gap-8">
            {/* Main Article */}
            <article className="flex-1 min-w-0">
              <div className="bg-white dark:bg-dark-card rounded-3xl overflow-hidden border border-gray-100 dark:border-dark-border shadow-sm hover:shadow-md transition-shadow duration-300">
                {/* Cover Image Section */}
                {post.featuredImage ? (
                  <div className="relative aspect-[21/9] w-full bg-gray-100 overflow-hidden">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover img-reveal"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                      <div className="flex items-center gap-2 flex-wrap">
                        {post.category && (
                          <Link href={`/blog?category=${post.category.slug}`}>
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/95 dark:bg-gray-900/95 backdrop-blur text-primary-700 dark:text-primary-300 rounded-full text-sm font-bold shadow-lg hover:bg-white transition-colors">
                              {post.category.icon} {post.category.name}
                            </span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative h-40 bg-gradient-to-br from-primary-600 via-indigo-600 to-purple-700 overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{
                      backgroundImage: 'radial-gradient(circle at 25% 50%, white 1px, transparent 1px)',
                      backgroundSize: '30px 30px'
                    }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-white/30" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                      <div className="flex items-center gap-2 flex-wrap">
                        {post.category && (
                          <Link href={`/blog?category=${post.category.slug}`}>
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/95 dark:bg-gray-900/95 backdrop-blur text-primary-700 dark:text-primary-300 rounded-full text-sm font-bold shadow-lg hover:bg-white transition-colors">
                              {post.category.icon} {post.category.name}
                            </span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="px-6 md:px-10 lg:px-14 pt-8 pb-12">
                  {/* Category & Tags - only show in body if no featured image */}
                  {!post.featuredImage && (
                    <div className="flex items-center gap-3 mb-5 flex-wrap">
                      {post.category && (
                        <Link href={`/blog?category=${post.category.slug}`}>
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-semibold hover:bg-primary-100 transition-colors">
                            {post.category.icon} {post.category.name}
                          </span>
                        </Link>
                      )}
                      {post.tags && (
                        <Link
                          href={`/tag/${post.tags.slug}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                        >
                          <Tag className="w-3 h-3" />
                          {post.tags.name}
                        </Link>
                      )}
                    </div>
                  )}

                  {/* Title */}
                  <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-display font-extrabold text-gray-900 dark:text-white mb-6 leading-[1.2]">
                    {post.title}
                  </h1>

                  {/* Excerpt Pull Quote */}
                  {post.excerpt && (
                    <div className="relative mb-8 p-6 md:p-8 bg-gradient-to-br from-primary-50 via-indigo-50/50 to-purple-50/30 dark:from-primary-900/15 dark:via-indigo-900/10 dark:to-purple-900/5 rounded-2xl border-l-4 border-primary-500">
                      <div className="absolute top-4 left-4 text-5xl text-primary-300 dark:text-primary-700/50 font-serif leading-none">
                        &ldquo;
                      </div>
                      <p className="text-base md:text-lg text-gray-700 dark:text-gray-200 leading-relaxed pl-6 relative z-10">
                        {post.excerpt}
                      </p>
                    </div>
                  )}

                  {/* Enhanced Meta Info Bar */}
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100 dark:border-dark-border">
                    {/* Author Card */}
                    <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow-md ring-2 ring-primary-100 dark:ring-primary-900">
                        {(post.author?.name || '?').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900 dark:text-white block text-sm leading-tight">
                          {post.author?.name || 'Blog-Ghar'}
                        </span>
                        <span className="text-xs text-gray-400">Author</span>
                      </div>
                    </div>

                    {/* Date Badge */}
                    <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <span className="block font-medium text-gray-900 dark:text-white text-sm leading-tight">{publishedDate}</span>
                        <span className="text-xs text-gray-400">Published</span>
                      </div>
                    </div>

                    {/* Read Time Badge */}
                    <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <span className="block font-medium text-gray-900 dark:text-white text-sm leading-tight">{readTime} min</span>
                        <span className="text-xs text-gray-400">{wordCount} words</span>
                      </div>
                    </div>

                    {/* Views Badge */}
                    <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                        <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <span className="block font-medium text-gray-900 dark:text-white text-sm leading-tight">
                          {formatNumber(post.views || 0)}
                        </span>
                        <span className="text-xs text-gray-400">Views</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 mb-10">
                    <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700">
                      <Bookmark className="w-4 h-4" />
                      Save
                    </button>
                    <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-50 dark:bg-primary-900/30 text-sm font-semibold text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors border border-primary-200/50 dark:border-primary-800/30">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>

                  {/* Article Content */}
                  <div
                    className="prose-content max-w-none"
                    dangerouslySetInnerHTML={{ __html: contentWithIds }}
                  />

                  {/* Bottom Tags */}
                  {post.tags && (
                    <div className="mt-12 pt-8 border-t border-gray-100 dark:border-dark-border">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Tags</span>
                        <Link
                          href={`/tag/${post.tags.slug}`}
                          className="px-4 py-2 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-semibold hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-all hover:scale-105 border border-primary-200/50 dark:border-primary-800/30"
                        >
                          {post.tags.name}
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Bottom tags */}
                  {post.tags && (
                    <div className="mt-10 pt-8 border-t border-gray-100 dark:border-dark-border">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 mr-2">Tags:</span>
                        <Link
                          href={`/tag/${post.tags.slug}`}
                          className="px-3 py-1.5 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium hover:bg-primary-100 transition-colors"
                        >
                          {post.tags.name}
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Author Bio Card */}
                  <div className="mt-10 p-6 md:p-8 bg-gradient-to-br from-primary-50 via-white to-indigo-50/50 dark:from-primary-900/20 dark:via-dark-card dark:to-indigo-900/15 rounded-2xl border border-primary-100/50 dark:border-primary-800/20 relative overflow-hidden">
                    <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary-200/20 dark:bg-primary-400/5 rounded-full blur-2xl" />
                    <div className="relative flex items-start gap-5">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white shadow-xl ring-4 ring-primary-100 dark:ring-primary-900/50 shrink-0">
                        {(post.author?.name || '?').charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                          <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white">
                            Written by {post.author?.name || 'Blog-Ghar'}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                          Passionate about sharing knowledge and insights on technology, lifestyle, and more.
                          Follow for more curated content delivered to your inbox.
                        </p>
                        <div className="flex items-center gap-2 mt-4">
                          <div className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                            <BookOpen className="w-3.5 h-3.5" />
                            {Math.max(1, Math.floor(wordCount / 1000))}k+ words published
                          </div>
                          <div className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                            <TrendingUp className="w-3.5 h-3.5" />
                            Top contributor
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Related Articles */}
              {relatedPosts.length > 0 && (
                <div className="mt-16">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-1 h-6 bg-primary-500 rounded-full" />
                    <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Related Articles</h2>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {relatedPosts.map((related) => (
                      <BlogCard key={related.id} post={related} variant="default" />
                    ))}
                  </div>
                </div>
              )}

              {/* Browse All Articles CTA */}
              <div className="mt-12 mb-8">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Browse All Articles
                </Link>
              </div>
            </article>

            {/* Table of Contents Sidebar */}
            <div className="hidden xl:block w-64 shrink-0">
              <div className="sticky top-24">
                <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-3">
                  Table of Contents
                </h4>
                <TableOfContents html={post.content} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
