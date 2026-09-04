import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Clock, Eye, Calendar, Tag } from 'lucide-react';
import { Metadata } from 'next';
import { readingTime, formatNumber } from '@/lib/utils';
import { JsonLd } from '@/components/seo/json-ld';

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
    include: {
      author: { select: { name: true, image: true } },
      category: { select: { name: true, slug: true, icon: true } },
      tags: { select: { id: true, name: true, slug: true } },
    },
  });
  if (!post) notFound();

  // Increment views
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
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
        <div className="max-w-4xl mx-auto px-4 py-8">
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

            <div className="p-6 md:p-10">
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

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 font-medium leading-relaxed italic border-l-4 border-primary-500 pl-4">
                  {post.excerpt}
                </p>
              )}

              {/* Full Article Content */}
              <div
                className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-primary-600 prose-img:rounded-xl leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              {post.tags && (
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-dark-border">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <Link
                      href={`/tag/${post.tags.slug}`}
                      className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition-colors"
                    >
                      {post.tags.name}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </article>

          {/* Related Articles Section */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-display font-bold mb-6">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.id}
                    href={`/blog/${related.slug}`}
                    className="card p-5 group hover:shadow-lg transition-all"
                  >
                    <div className="text-2xl mb-2">{related.category?.icon || '📝'}</div>
                    <h3 className="font-bold text-sm mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {related.title}
                    </h3>
                    <p className="text-xs text-gray-400">{related.category?.name || 'Blog'}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Browse All Articles CTA */}
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
