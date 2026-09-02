import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { formatDate, readingTime } from '@/lib/utils';
import { ArrowLeft, Clock, Eye, MessageCircle, Share2, Bookmark, ThumbsUp } from 'lucide-react';
import CommentSection from '@/components/comments/comment-section';
import { AdSlot } from '@/components/ads/ad-slot';

type BlogParams = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: BlogParams }) {
  try {
    const { slug } = await params;
    const post = await prisma.post.findUnique({
      where: { slug },
      include: { user: { select: { name: true } }, category: { select: { name: true } } },
    });
    if (!post) return {};

    const canonical = `https://blogghar.com/blog/${post.slug}`;
    const ogImage = post.featuredImage || 'https://blogghar.com/og-image.png';
    const description = post.seoDesc || post.excerpt || post.title;

    return {
      title: post.seoTitle || post.title,
      description,
      keywords: post.focusKeyword ? [post.focusKeyword, 'blog', 'blog-ghar'] : undefined,
      authors: [{ name: post.user.name || 'Blog-Ghar' }],
      alternates: { canonical },
      openGraph: {
        type: 'article',
        url: canonical,
        title: post.title,
        description,
        images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
        publishedTime: post.publishedAt?.toISOString(),
        modifiedTime: post.updatedAt?.toISOString(),
        authors: [post.user.name || 'Blog-Ghar'],
        section: post.category?.name,
        tags: post.focusKeyword ? [post.focusKeyword] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description,
        images: [ogImage],
      },
    };
  } catch {
    return {};
  }
}

export default async function BlogPostPage({ params }: { params: BlogParams }) {
  const { slug } = await params;
  let post: any;
  try {
    post = await prisma.post.findUnique({
      where: { slug },
      include: {
        user: { select: { name: true, image: true } },
        category: { select: { name: true, slug: true } },
        tags: { include: { tag: true } },
        _count: { select: { comments: true } },
      },
    });
  } catch {
    post = null;
  }

  if (!post) notFound();

  try { await prisma.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } }); } catch {}

  let related: any[] = [];
  try {
    related = await prisma.post.findMany({
      where: { categoryId: post.categoryId, NOT: { id: post.id }, status: 'PUBLISHED' },
      take: 3,
      orderBy: { publishedAt: 'desc' },
    });
  } catch {}

  // JSON-LD Article schema
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.title,
    url: `https://blogghar.com/blog/${post.slug}`,
    datePublished: post.publishedAt?.toISOString() || post.createdAt?.toISOString(),
    dateModified: post.updatedAt?.toISOString() || post.createdAt?.toISOString(),
    author: {
      '@type': 'Person',
      name: post.user.name || 'Blog-Ghar',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Blog-Ghar',
      url: 'https://blogghar.com',
      logo: { '@type': 'ImageObject', url: 'https://blogghar.com/logo.png' },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://blogghar.com/blog/${post.slug}`,
    },
    image: post.featuredImage ? { '@type': 'ImageObject', url: post.featuredImage } : undefined,
    articleSection: post.category?.name || 'General',
    keywords: post.focusKeyword,
    inLanguage: 'en-IN',
    wordCount: post.content?.split(/\s+/).length,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://blogghar.com' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://blogghar.com/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://blogghar.com/blog/${post.slug}` },
    ],
  };

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <Script
        id="article-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Link href="/blog" className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Blog
      </Link>

      {post.featuredImage && (
        <img src={post.featuredImage} alt={post.title} className="w-full aspect-video object-cover rounded-2xl mb-6" />
      )}

      <div className="mb-6">
        {post.category && (
          <Link href={`/category/${post.category.slug}`} className="inline-block text-xs font-medium px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full mb-3">
            {post.category.name}
          </Link>
        )}
        <h1 className="text-3xl md:text-4xl font-display font-extrabold mb-4 leading-tight">{post.title}</h1>
        {post.excerpt && <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{post.excerpt}</p>}
        <div className="flex items-center justify-between text-sm text-gray-500 pb-6 border-b border-gray-200 dark:border-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center font-medium">{post.user.name?.charAt(0).toUpperCase()}</div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{post.user.name}</p>
              <div className="flex items-center gap-2 text-xs">
                <time dateTime={post.publishedAt?.toISOString()}>{formatDate(post.publishedAt || post.createdAt)}</time>
                <span>•</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime || readingTime(post.content)} min</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {post.views}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="prose dark:prose-invert max-w-none mb-8" dangerouslySetInnerHTML={{ __html: post.content }} />

      {/* In-content Ad */}
      <div className="my-8">
        <AdSlot slot="1234567890" format="auto" responsive={true} />
      </div>

      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-gray-200 dark:border-dark-border">
          {post.tags.map((t: any) => (
            <Link key={t.tag.id} href={`/tag/${t.tag.slug}`} className="px-3 py-1 bg-gray-100 dark:bg-dark-bg rounded-full text-xs hover:bg-primary-100 dark:hover:bg-primary-900/30">
              #{t.tag.name}
            </Link>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <button className="p-2 bg-gray-100 dark:bg-dark-bg rounded-lg hover:bg-gray-200"><ThumbsUp className="w-5 h-5 text-gray-500" /></button>
          <button className="p-2 bg-gray-100 dark:bg-dark-bg rounded-lg hover:bg-gray-200"><Bookmark className="w-5 h-5 text-gray-500" /></button>
          <button className="p-2 bg-gray-100 dark:bg-dark-bg rounded-lg hover:bg-gray-200"><Share2 className="w-5 h-5 text-gray-500" /></button>
        </div>
        <Link href="#comments" className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600">
          <MessageCircle className="w-4 h-4" /> {post._count.comments} comments
        </Link>
      </div>

      <CommentSection postId={post.id} />

      {related.length > 0 && (
        <section className="mt-12 pt-8 border-t border-gray-200 dark:border-dark-border">
          <h2 className="text-2xl font-display font-bold mb-6">📚 Related Posts</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {related.map((r: any) => (
              <Link key={r.id} href={`/blog/${r.slug}`} className="card overflow-hidden group">
                {r.featuredImage && <img src={r.featuredImage} alt="" className="aspect-video w-full object-cover" />}
                <div className="p-4">
                  <h3 className="font-medium text-sm group-hover:text-primary-600 line-clamp-2">{r.title}</h3>
                  <p className="text-xs text-gray-500 mt-2">{formatDate(r.publishedAt || r.createdAt)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
