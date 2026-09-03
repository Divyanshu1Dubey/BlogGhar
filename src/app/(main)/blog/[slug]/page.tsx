import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import {
  ArrowLeft,
  Clock,
  Eye,
  MessageCircle,
  Share2,
  Bookmark,
  ThumbsUp,
  Facebook,
  Twitter,
  Linkedin,
  Calendar,
  Tag,
  Newspaper,
  TrendingUp,
  Clock3,
} from 'lucide-react';
import CommentSection from '@/components/comments/comment-section';
import { AdSlot } from '@/components/ads/ad-slot';
import NewsletterForm from '@/components/newsletter-form';
import { formatDate, readingTime, formatNumber } from '@/lib/utils';
import { CopyLinkButton } from '@/components/ui/copy-link-button';
import { generatePageMetadata } from '@/components/seo/page-seo';

type BlogParams = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: BlogParams }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug }, select: { title: true, excerpt: true, slug: true, featuredImage: true, author: { select: { name: true } }, tags: { select: { name: true } } } });
  if (!post) return {};
  return generatePageMetadata({
    title: post.title,
    description: post.excerpt || post.title,
    canonical: `https://bloghar.com/blog/${post.slug}`,
    ogImage: post.featuredImage || undefined,
    ogType: 'article',
    author: post.author?.name || undefined,
    tags: post.tags ? [post.tags.name] : undefined,
  });
}

function buildArticleSchema(post: {
  title: string;
  excerpt?: string;
  slug: string;
  publishedAt?: Date;
  updatedAt?: Date;
  author?: { name?: string };
  category?: { name?: string };
  views?: number;
  content?: string;
  featuredImage?: string;
}) {
  const pubDate = post.publishedAt?.toISOString() || post.updatedAt?.toISOString() || new Date().toISOString();
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.title,
    url: `https://bloghar.com/blog/${post.slug}`,
    datePublished: pubDate,
    dateModified: post.updatedAt?.toISOString() || pubDate,
    author: { '@type': 'Person', name: post.author?.name || 'Blog-Ghar' },
    publisher: {
      '@type': 'Organization',
      name: 'Blog-Ghar',
      url: 'https://bloghar.com',
      logo: { '@type': 'ImageObject', url: 'https://bloghar.com/logo.svg' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://bloghar.com/blog/${post.slug}` },
    image: post.featuredImage ? [{ '@type': 'ImageObject', url: post.featuredImage }] : undefined,
    articleSection: post.category?.name || 'General',
    wordCount: post.content ? post.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length : 0,
    inLanguage: 'en-IN',
  };
}

function buildBreadcrumbSchema(postTitle: string, slug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://bloghar.com' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://bloghar.com/blog' },
      { '@type': 'ListItem', position: 3, name: postTitle, item: `https://bloghar.com/blog/${slug}` },
    ],
  };
}

function extractHeadings(html: string): { text: string; level: number; id: string }[] {
  const headings: { text: string; level: number; id: string }[] = [];
  const regex = /<h([23])(?:\s[^>]*)?>([\s\S]*?)<\/h\1>/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const rawText = match[2]
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .trim();
    if (!rawText) continue;
    const id = slugifyHeading(rawText);
    headings.push({ text: rawText, level: parseInt(match[1]), id });
  }

  return headings;
}

function slugifyHeading(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').slice(0, 60);
}

function withHeadingIds(html: string): string {
  return html.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/g, (_match, level, attrs, inner) => {
    const text = inner.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
    return `<h${level}${attrs} id="${slugifyHeading(text)}">${inner}</h${level}>`;
  });
}

export default async function BlogPostPage({ params }: { params: BlogParams }) {
  const { slug } = await params;
  let post: any;
  try {
    post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: { select: { name: true, image: true } },
        category: { select: { name: true, slug: true } },
        tags: { select: { id: true, name: true, slug: true } },
        _count: { select: { comments: true } },
      },
    });
  } catch {
    post = null;
  }
  if (!post) notFound();

  try { await prisma.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } }); } catch {}

  let related: any[] = [];
  let popularPosts: any[] = [];
  let categories: any[] = [];
  let recentComments: any[] = [];

  try {
    related = await prisma.post.findMany({
      where: { categoryId: post.categoryId, NOT: { id: post.id }, status: 'PUBLISHED' },
      take: 3,
      orderBy: { publishedAt: 'desc' },
      include: { category: { select: { name: true, slug: true } }, author: { select: { name: true } } },
    });
  } catch {}

  try {
    popularPosts = await prisma.post.findMany({
      where: { status: 'PUBLISHED', NOT: { id: post.id } },
      orderBy: { views: 'desc' },
      take: 5,
      include: { category: { select: { name: true, slug: true } }, author: { select: { name: true } } },
    });
  } catch {}

  try {
    categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { posts: true } } },
    });
  } catch {}

  try {
    recentComments = await prisma.comment.findMany({
      where: { post: { NOT: { id: post.id } }, isApproved: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { user: { select: { name: true, image: true } }, post: { select: { title: true, slug: true } } },
    });
  } catch {}

  const readTime = post.readTime || readingTime(post.content || '');
  const headings = extractHeadings(post.content || '');
  const articleSchema = buildArticleSchema(post);
  const breadcrumbSchema = buildBreadcrumbSchema(post.title, post.slug);
  const canonicalUrl = `https://bloghar.com/blog/${post.slug}`;
  const shareUrl = canonicalUrl;
  const shareText = post.title;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <span className="text-gray-300 dark:text-gray-600">/</span>
          <Link href="/blog" className="hover:text-primary-600 transition-colors">Blog</Link>
          {post.category && (
            <>
              <span className="text-gray-300 dark:text-gray-600">/</span>
              <Link href={`/category/${post.category.slug}`} className="hover:text-primary-600 transition-colors">{post.category.name}</Link>
            </>
          )}
          <span className="text-gray-300 dark:text-gray-600">/</span>
          <span className="text-gray-700 dark:text-gray-300 font-medium truncate max-w-[200px]">{post.title}</span>
        </nav>

        <div className="lg:flex lg:gap-8">
          {/* Main Content */}
          <div className="lg:w-[70%] min-w-0">
            <Link href="/blog" className="lg:hidden flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-4">
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>

            <article>
              {/* Category badge + meta */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {post.category && (
                  <Link href={`/category/${post.category.slug}`} className="inline-block text-xs font-semibold px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full hover:bg-primary-200 transition-colors">
                    {post.category.name}
                  </Link>
                )}
                <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <Clock3 className="w-3.5 h-3.5" />
                  {readTime} min read
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <Eye className="w-3.5 h-3.5" />
                  {formatNumber(post.views || 0)} views
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-gray-900 dark:text-white mb-4 leading-tight tracking-tight">
                {post.title}
              </h1>

              {/* Excerpt with left border */}
              {post.excerpt && (
                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed border-l-4 border-primary-500 pl-4">{post.excerpt}</p>
              )}

              {/* Author info card */}
              <div className="flex items-center justify-between p-4 bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-sm">
                    {(post.author?.name || 'B').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{post.author?.name || 'Blog-Ghar'}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(post.publishedAt || post.createdAt)}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline flex items-center gap-1"><Clock className="w-3 h-3" /> {readTime} min read</span>
                    </div>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg transition-colors" title="Share">
                    <Share2 className="w-5 h-5 text-gray-500" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg transition-colors" title="Bookmark">
                    <Bookmark className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Featured image */}
              {post.featuredImage && (
                <div className="mb-8 rounded-2xl overflow-hidden">
                  <img src={post.featuredImage} alt={post.title} className="w-full aspect-video sm:aspect-[21/9] object-cover" />
                  {post.excerpt && (
                    <figcaption className="text-xs text-gray-400 mt-2 text-center italic">{post.excerpt}</figcaption>
                  )}
                </div>
              )}

              {/* Leaderboard ad */}
              <div className="my-6">
                <AdSlot slot="728x90-leaderboard" format="horizontal" responsive={true} className="w-full" style={{ minHeight: '90px' }} />
              </div>

              {/* Table of Contents */}
              {headings.length > 0 && (
                <div className="mb-8 p-5 bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border">
                  <h2 className="text-lg font-display font-bold mb-3 flex items-center gap-2">
                    <Newspaper className="w-5 h-5 text-primary-600" />
                    Table of Contents
                  </h2>
                  <nav aria-label="Table of contents" className="space-y-1.5">
                    {headings.map((h, i) => (
                      <a
                        key={i}
                        href={`#${h.id}`}
                        className={`block text-sm ${h.level === 3 ? 'pl-4 text-gray-500 dark:text-gray-400 ml-2 border-l-2 border-gray-200 dark:border-dark-border' : 'text-gray-700 dark:text-gray-300 font-medium border-l-2 border-primary-500'} pl-3 hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400 transition-colors py-1`}
                      >
                        {h.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* Article body */}
              <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-6 sm:p-8 lg:p-10">
                <div
                  className="
                    prose prose-lg dark:prose-invert max-w-none
                    prose-headings:font-display prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
                    prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-3 prose-h2:border-b prose-h2:border-gray-200 dark:prose-h2:border-dark-border
                    prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                    prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-[1.85] prose-p:text-[17px]
                    prose-p:first-child:first-letter:text-5xl prose-p:first-child:first-letter:font-bold prose-p:first-child:first-letter:float-left prose-p:first-child:first-letter:mr-3 prose-p:first-child:first-letter:mt-1 prose-p:first-child:first-letter:text-primary-600 dark:prose-p:first-child:first-letter:text-primary-400
                    prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
                    prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:bg-primary-50 dark:prose-blockquote:bg-primary-900/20 prose-blockquote:rounded-r-lg prose-blockquote:py-3 prose-blockquote:px-5 prose-blockquote:my-6 prose-blockquote:italic prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300
                    prose-ul:my-6 prose-ul:space-y-2 prose-ol:my-6 prose-ol:space-y-2
                    prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:text-[16px]
                    prose-img:rounded-2xl prose-img:my-8 prose-img:shadow-lg
                    prose-figure:text-center prose-figcaption:text-xs prose-figcaption:text-gray-400 prose-figcaption:mt-2
                    prose-strong:text-gray-900 dark:prose-strong:text-white
                    prose-code:text-sm prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                    prose-pre:rounded-xl prose-pre:my-6
                    prose-hr:border-gray-200 dark:prose-hr:border-dark-border
                  "
                  dangerouslySetInnerHTML={{ __html: withHeadingIds(post.content) }}
                />
              </div>

              {/* Tags */}
              {post.tags && (
                <div className="mt-8 p-6 bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(post.tags) ? (
                      (post.tags as any[]).map((tag: any) => (
                        <Link key={tag.id} href={`/tag/${tag.slug}`} className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-dark-bg hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:text-primary-700 transition-colors">
                          <Tag className="w-3 h-3" /> {tag.name}
                        </Link>
                      ))
                    ) : (
                      <Link href={`/tag/${(post.tags as any)?.slug}`} className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-dark-bg rounded-full text-sm text-gray-700 dark:text-gray-300">
                        <Tag className="w-3 h-3" /> {(post.tags as any)?.name}
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Inline ad (after tags) */}
              <div className="mt-8">
                <AdSlot slot="728x90-inline-1" format="horizontal" responsive={true} className="w-full" style={{ minHeight: '90px' }} />
              </div>

              {/* Social sharing */}
              <div className="mt-8 p-6 bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Share this article</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1DA1F2] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
                    <Twitter className="w-4 h-4" /> Tweet
                  </a>
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1877F2] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
                    <Facebook className="w-4 h-4" /> Share
                  </a>
                  <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0A66C2] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
                    <Linkedin className="w-4 h-4" /> Share
                  </a>
                  <CopyLinkButton url={shareUrl} />
                </div>
              </div>

              {/* Like / Bookmark actions */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors">
                  <ThumbsUp className="w-4 h-4" /> Like
                </button>
                <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl text-sm font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 transition-colors">
                  <Bookmark className="w-4 h-4" /> Save
                </button>
                <a href="#comments" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors">
                  <MessageCircle className="w-4 h-4" /> {post._count?.comments || 0} Comments
                </a>
              </div>

              {/* Author bio card */}
              <div className="mt-8 p-6 sm:p-8 bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-2xl border border-primary-100 dark:border-primary-800">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md shrink-0">
                    {(post.author?.name || 'B').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">{post.author?.name || 'Blog-Ghar Team'}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Content Writer at Blog-Ghar</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Passionate about sharing knowledge across technology, lifestyle, and education. Bringing you well-researched, insightful articles.</p>
                  </div>
                </div>
              </div>

              {/* Related Posts */}
              {related.length > 0 && (
                <section className="mt-12">
                  <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-primary-600" />
                    Related Posts
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {related.map((r: any) => (
                      <Link key={r.id} href={`/blog/${r.slug}`} className="group block bg-white dark:bg-dark-card rounded-2xl overflow-hidden border border-gray-200 dark:border-dark-border hover:shadow-lg transition-all duration-300">
                        <div className="aspect-video bg-gray-100 dark:bg-dark-bg relative overflow-hidden">
                          {r.featuredImage ? (
                            <img src={r.featuredImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl">📝</div>
                          )}
                          {r.category && (
                            <span className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 dark:bg-dark-bg/90 backdrop-blur-sm rounded-full text-[11px] font-medium">{r.category.name}</span>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary-600 transition-colors mb-2">{r.title}</h3>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span>{r.author?.name || 'Blog-Ghar'}</span>
                            <span>•</span>
                            <span>{formatDate(r.publishedAt || r.createdAt)}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Comments */}
              <CommentSection />
            </article>
          </div>

          {/* Sidebar - Desktop only */}
          <aside className="hidden lg:block lg:w-[30%] min-w-0">
            <div className="sticky top-24 space-y-6">
              {/* Author profile card */}
              <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border overflow-hidden">
                <div className="h-20 bg-gradient-to-r from-primary-500 to-primary-700"></div>
                <div className="px-5 pb-5 -mt-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg border-4 border-white dark:border-dark-card">
                    {(post.author?.name || 'B').charAt(0).toUpperCase()}
                  </div>
                  <h3 className="font-display font-bold text-lg mt-3 text-gray-900 dark:text-white">{post.author?.name || 'Blog-Ghar'}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Content Writer at Blog-Ghar</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Newspaper className="w-3.5 h-3.5" /> Articles</span>
                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {formatNumber(post.views || 0)} views</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 leading-relaxed">Passionate about sharing knowledge across technology, lifestyle, and education topics.</p>
                </div>
              </div>

              {/* Popular posts */}
              {popularPosts.length > 0 && (
                <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-5">
                  <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary-600" />
                    Popular Posts
                  </h3>
                  <div className="space-y-4">
                    {popularPosts.map((p: any, i: number) => (
                      <Link key={p.id} href={`/blog/${p.slug}`} className="flex gap-3 group">
                        <span className="text-2xl font-display font-extrabold text-primary-200 dark:text-primary-800 leading-none mt-0.5 w-6 shrink-0">{i + 1}</span>
                        <div className="min-w-0">
                          <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-primary-600 transition-colors line-clamp-2">{p.title}</h4>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                            <span>{p.category?.name}</span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" /> {formatNumber(p.views || 0)}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories */}
              {categories.length > 0 && (
                <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-5">
                  <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                    <Newspaper className="w-5 h-5 text-primary-600" />
                    Categories
                  </h3>
                  <div className="space-y-2">
                    {categories.map((cat: any) => (
                      <Link key={cat.id} href={`/category/${cat.slug}`} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors group">
                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary-600 transition-colors">{cat.name}</span>
                        <span className="text-xs font-medium bg-gray-100 dark:bg-dark-bg text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">{cat._count.posts}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Newsletter */}
              <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-6 text-white">
                <h3 className="font-display font-bold text-lg mb-2">Stay Updated</h3>
                <p className="text-sm text-primary-100 mb-4">Get the latest posts delivered to your inbox weekly.</p>
                <NewsletterForm variant="sidebar" />
              </div>

              {/* Sidebar Ad */}
              <div>
                <AdSlot slot="300x250-sidebar" format="rectangle" responsive={false} className="w-full max-w-[300px] mx-auto" style={{ minHeight: '250px' }} />
              </div>

              {/* Recent comments */}
              {recentComments.length > 0 && (
                <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-5">
                  <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-primary-600" />
                    Recent Comments
                  </h3>
                  <div className="space-y-4">
                    {recentComments.map((comment: any) => {
                      const postSlug = comment.post?.slug || '';
                      const href = postSlug.startsWith('news/') ? `/${postSlug}` : `/blog/${postSlug}`;
                      return (
                        <Link key={comment.id} href={href} className="block group">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{comment.user?.name}</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 group-hover:text-primary-600 transition-colors">{comment.content}</p>
                          <p className="text-xs text-gray-400 mt-1">On: {comment.post?.title}</p>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Mobile: Table of Contents + Sidebar extras */}
        <div className="lg:hidden mt-10 space-y-6">
          {headings.length > 0 && (
            <div className="p-5 bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border">
              <h2 className="text-lg font-display font-bold mb-3">Table of Contents</h2>
              <nav className="space-y-1.5">
                {headings.map((h, i) => (
                  <a key={i} href={`#${h.id}`} className={`block text-sm py-1 border-l-2 pl-3 hover:border-primary-600 ${h.level === 3 ? 'text-gray-500 border-gray-200 dark:border-dark-border ml-2' : 'text-gray-700 dark:text-gray-300 font-medium border-primary-500'}`}>
                    {h.text}
                  </a>
                ))}
              </nav>
            </div>
          )}

          {popularPosts.length > 0 && (
            <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-5">
              <h3 className="font-display font-bold text-lg mb-4">Popular Posts</h3>
              <div className="space-y-3">
                {popularPosts.map((p: any, i: number) => (
                  <Link key={p.id} href={`/blog/${p.slug}`} className="flex gap-3 items-start group">
                    <span className="text-xl font-display font-extrabold text-primary-200 dark:text-primary-800 leading-none mt-0.5 w-5 shrink-0">{i + 1}</span>
                    <div>
                      <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary-600 transition-colors">{p.title}</h4>
                      <span className="text-xs text-gray-400 mt-0.5">{formatDate(p.publishedAt || p.createdAt)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {categories.length > 0 && (
            <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-5">
              <h3 className="font-display font-bold text-lg mb-4">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat: any) => (
                  <Link key={cat.id} href={`/category/${cat.slug}`} className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-dark-bg rounded-full text-sm text-gray-700 dark:text-gray-300 hover:bg-primary-100 transition-colors">
                    {cat.name} <span className="text-xs text-gray-400">({cat._count.posts})</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <AdSlot slot="300x250-mobile" format="rectangle" responsive={false} style={{ minHeight: '250px', maxWidth: '300px', width: '100%' }} />
          </div>

          <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-6 text-white">
            <h3 className="font-display font-bold text-lg mb-2">Stay Updated</h3>
            <p className="text-sm text-primary-100 mb-4">Get latest posts in your inbox.</p>
            <NewsletterForm variant="sidebar" />
          </div>
        </div>
      </div>

      {/* JSON-LD schemas */}
      <Script id="article-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Script id="breadcrumb-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </div>
  );
}
