import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Share2, Clock, Eye, Calendar, Tag } from 'lucide-react';
import { Metadata } from 'next';
import { readingTime, formatNumber } from '@/lib/utils';
import { JsonLd } from '@/components/seo/json-ld';
import BlogClient from './blog-client';

type Params = Promise<{ slug: string }>;

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

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({ where: { status: 'PUBLISHED', postType: 'BLOG' }, select: { slug: true } });
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { author: { select: { name: true, image: true } }, category: { select: { name: true, slug: true, icon: true } } },
  });
  if (!post) notFound();

  // Increment views
  await prisma.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } });

  const readTime = readingTime(post.content);
  const publishedDate = post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

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
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-primary-600">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-primary-600">Blog</Link>
            <span>/</span>
            <span className="text-gray-600 dark:text-gray-300 truncate">{post.title}</span>
          </nav>

          <article className="card p-0 overflow-hidden">
            {/* Cover Image */}
            {post.featuredImage && (
              <div className="aspect-video w-full bg-gray-200 relative">
                <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="p-6 md:p-8">
              {/* Category & Title */}
              {post.category && (
                <Link href={`/blog?category=${post.category.slug}`} className="inline-block mb-3">
                  <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium">
                    {post.category.icon} {post.category.name}
                  </span>
                </Link>
              )}
              <h1 className="text-3xl md:text-4xl font-display font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
                {post.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100 dark:border-dark-border">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-sm font-medium text-primary-700">
                    {(post.author?.name || '?').charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium">{post.author?.name || 'Blog-Ghar'}</span>
                </div>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {publishedDate}</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {readTime} min read</span>
                <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {formatNumber(post.views || 0)} views</span>
              </div>

              {/* Content */}
              <BlogClient content={post.content} excerpt={post.excerpt} />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-dark-border">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag className="w-4 h-4 text-gray-400" />
                    {post.tags.map((tag) => (
                      <Link key={tag.id} href={`/tag/${tag.slug}`} className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition-colors">
                        {tag.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Share */}
              <div className="mt-6 flex items-center gap-3">
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors flex items-center gap-2">
                  <Share2 className="w-4 h-4" /> Share Article
                </button>
              </div>
            </div>
          </article>

          {/* Related Posts CTA */}
          <div className="mt-8 text-center">
            <Link href="/blog" className="btn-primary">
              ← Browse All Articles
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
