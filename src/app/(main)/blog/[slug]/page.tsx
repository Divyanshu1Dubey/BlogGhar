import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Clock, Eye, Calendar, Tag, Bookmark, Share2, ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';
import { readingTime, formatNumber } from '@/lib/utils';
import { JsonLd } from '@/components/seo/json-ld';
import { BlogCard } from '@/components/blog/blog-card';
import { ReadingProgressBar } from '@/components/ui/reading-progress-bar';
import { TableOfContents } from '@/components/blog/table-of-contents';

type Params = Promise<{ slug: string }>;

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
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
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: { select: { name: true, image: true } },
      category: { select: { name: true, slug: true, icon: true } },
      tags: { select: { id: true, name: true, slug: true } },
    },
  });
  if (!post) notFound();

  try {
    await prisma.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } });
  } catch (err) {
    console.error('Failed to increment post view count:', err);
  }

  let relatedPosts: any[] = [];
  try {
    relatedPosts = await prisma.post.findMany({
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
  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

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
        {/* Back navigation */}
        <div className="max-w-6xl mx-auto px-4 pt-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Blog
          </Link>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <span className="text-gray-300">/</span>
            <Link href="/blog" className="hover:text-primary-600 transition-colors">Blog</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-600 dark:text-gray-300 truncate max-w-[200px]">{post.title}</span>
          </nav>

          {/* Article Layout: TOC sidebar + main content */}
          <div className="flex gap-8">
            {/* Main Article */}
            <article className="flex-1 min-w-0">
              <div className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden border border-gray-100 dark:border-dark-border shadow-sm">
                {/* Cover Image with gradient overlay */}
                {post.featuredImage && (
                  <div className="aspect-[21/9] w-full bg-gray-100 relative">
                    <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  </div>
                )}

                <div className="px-6 md:px-10 lg:px-14 pt-8 pb-12">
                  {/* Category & Tags */}
                  <div className="flex items-center gap-3 mb-5 flex-wrap">
                    {post.category && (
                      <Link href={`/blog?category=${post.category.slug}`}>
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-semibold hover:bg-primary-100 transition-colors cursor-pointer">
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

                  {/* Title */}
                  <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-display font-extrabold text-gray-900 dark:text-white mb-6 leading-[1.2]">
                    {post.title}
                  </h1>

                  {/* Excerpt highlight */}
                  {post.excerpt && (
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed border-l-4 border-primary-500 pl-5 bg-primary-50/50 dark:bg-primary-900/10 py-4 rounded-r-lg">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Meta info bar */}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-500 mb-10 pb-8 border-b border-gray-100 dark:border-dark-border">
                    {/* Author */}
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow-md ring-2 ring-primary-100 dark:ring-primary-900">
                        {(post.author?.name || '?').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900 dark:text-white block">{post.author?.name || 'Blog-Ghar'}</span>
                        <span className="text-xs">Author</span>
                      </div>
                    </div>

                    <div className="hidden sm:block w-px h-8 bg-gray-200 dark:bg-gray-700" />

                    {/* Date */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <span className="block font-medium text-gray-900 dark:text-white">{publishedDate}</span>
                        <span className="text-xs text-gray-400">Published</span>
                      </div>
                    </div>

                    <div className="hidden sm:block w-px h-8 bg-gray-200 dark:bg-gray-700" />

                    {/* Read time */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <Clock className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <span className="block font-medium text-gray-900 dark:text-white">{readTime} min</span>
                        <span className="text-xs text-gray-400">Read time</span>
                      </div>
                    </div>

                    <div className="hidden sm:block w-px h-8 bg-gray-200 dark:bg-gray-700" />

                    {/* Views */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <Eye className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <span className="block font-medium text-gray-900 dark:text-white">{formatNumber(post.views || 0)}</span>
                        <span className="text-xs text-gray-400">Views</span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-3 mb-10">
                    <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                      <Bookmark className="w-4 h-4" />
                      Save
                    </button>
                    <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>

                  {/* Article Content */}
                  <div
                    className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-headings:scroll-mt-24 prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-lg prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-code:text-primary-600 prose-code:bg-primary-50 dark:prose-code:bg-primary-900/30 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />

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

                  {/* Author card */}
                  <div className="mt-10 p-6 md:p-8 bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/20 rounded-2xl border border-primary-100 dark:border-primary-800/30">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shrink-0">
                        {(post.author?.name || '?').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">
                          Written by {post.author?.name || 'Blog-Ghar'}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                          Passionate about sharing knowledge and insights on technology, lifestyle, and more.
                          Follow for more curated content delivered to your inbox.
                        </p>
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
