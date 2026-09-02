import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { formatDate, readingTime } from '@/lib/utils';
import { ArrowLeft, Eye } from 'lucide-react';
import { JsonLd } from '@/components/seo/json-ld';

export const dynamic = 'force-dynamic';

type NewsParams = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: NewsParams }) {
  try {
    const { slug } = await params;
    const post = await prisma.post.findUnique({ where: { slug } });
    if (!post) return {};
    const authorName = post.author?.name || 'Blog-Ghar';
    return {
      title: `${post.title} | Blog-Ghar News`,
      description: post.excerpt || post.content?.replace(/<[^>]*>/g, '').slice(0, 160) || '',
      openGraph: {
        title: post.title,
        description: post.excerpt || '',
        type: 'article',
        publishedTime: post.publishedAt?.toISOString(),
        authors: [authorName],
        images: post.featuredImage ? [post.featuredImage] : undefined,
      },
      twitter: { card: 'summary_large_image', title: post.title, description: post.excerpt || '' },
      alternates: { canonical: `https://blogghar.com/news/${post.slug}` },
    };
  } catch { return {}; }
}

export default async function NewsDetailPage({ params }: { params: NewsParams }) {
  const { slug } = await params;
  let post;
  try {
    post = await prisma.post.findUnique({
      where: { slug },
      include: { author: { select: { name: true } }, category: { select: { name: true, slug: true } } },
    });
  } catch { post = null; }
  if (!post) notFound();

  try { await prisma.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } }); } catch {}

  const authorName = post.author?.name || 'Blog-Ghar';
  const contentText = post.content?.replace(/<[^>]*>/g, '') || '';
  const wordCount = contentText.split(/\s+/).filter(Boolean).length;
  const newsSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    description: post.excerpt || contentText.slice(0, 160),
    datePublished: post.publishedAt?.toISOString() || post.createdAt?.toISOString() || new Date().toISOString(),
    dateModified: post.publishedAt?.toISOString() || post.createdAt?.toISOString() || new Date().toISOString(),
    author: { '@type': 'Person', name: authorName },
    publisher: { '@type': 'Organization', name: 'Blog-Ghar', url: 'https://blogghar.com' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://blogghar.com/news/${post.slug}` },
    articleSection: post.category?.name || 'General',
    wordCount,
    image: post.featuredImage || undefined,
    url: `https://blogghar.com/news/${post.slug}`,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://blogghar.com' },
      { '@type': 'ListItem', position: 2, name: 'News', item: 'https://blogghar.com/news' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://blogghar.com/news/${post.slug}` },
    ],
  };

  return (
    <>
      <JsonLd type="NewsArticle" data={newsSchema} />
      <JsonLd type="BreadcrumbList" data={breadcrumbSchema} />
      <article className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/news" className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to News
        </Link>

        <div className="mb-6">
          {post.category && (
            <Link href={`/category/${post.category.slug}`} className="inline-block text-xs font-medium px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full mb-3">
              {post.category.name}
            </Link>
          )}
          <h1 className="text-3xl md:text-4xl font-display font-extrabold mb-4">{post.title}</h1>
          {post.excerpt && <p className="text-lg text-gray-600 dark:text-gray-400">{post.excerpt}</p>}
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-500 pb-6 border-b border-gray-200 dark:border-dark-border">
            <span className="font-medium">{authorName}</span>
            <span>•</span>
            <span>{formatDate(post.publishedAt || post.createdAt)}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {post.views}</span>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </>
  );
}
