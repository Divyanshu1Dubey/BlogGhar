import { db, getAvailable } from '@/lib/prisma';
import Link from 'next/link';
import { BookOpen, TrendingUp, Sparkles, Eye, User } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { JsonLd } from '@/components/seo/json-ld';
import { BlogCard } from '@/components/blog/blog-card';
import { CategoryFilter } from '@/components/blog/category-filter';
import { AdSlot } from '@/components/ads/ad-slot';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata() {
  return {
    title: 'Blog - Latest Articles, Tutorials & Insights | Blog-Ghar',
    description: 'Discover stories, tutorials, and insights across technology, lifestyle, education, finance, and more on Blog-Ghar.',
    alternates: { canonical: 'https://bloghar.com/blog' },
  };
}

export default async function BlogPage({ searchParams }: { searchParams?: Promise<{ category?: string }> }) {
  const params = await searchParams;
  let posts: any[] = [];
  let totalPosts = 0;
  let categoriesWithCount: { id: string; name: string; slug: string; icon: string | null; _count: { posts: number } }[] = [];

  const whereCondition = {
    postType: 'BLOG',
    status: 'PUBLISHED',
    ...(params?.category ? { category: { slug: params.category } } : {}),
  };

  try {
    if (!getAvailable()) {
      posts = [];
      totalPosts = 0;
      categoriesWithCount = [];
    } else {
      const result = await Promise.all([
        db.post.findMany({
          where: whereCondition,
          orderBy: { publishedAt: 'desc' },
          take: 60,
          include: {
            author: { select: { name: true } },
            category: { select: { name: true, slug: true, icon: true } },
          },
        }),
        db.post.count({ where: whereCondition }),
        db.category.findMany({
          select: { id: true, name: true, slug: true, icon: true, _count: { select: { posts: true } } },
        }),
      ]);
      posts = result[0] as any[];
      totalPosts = result[1];
      categoriesWithCount = result[2] as any;
    }
  } catch (primaryErr) {
    console.error('Failed to load blog posts with full query:', primaryErr);
    if (!getAvailable()) {
      posts = [];
      totalPosts = 0;
      categoriesWithCount = [];
    } else {
      try {
        const result = await Promise.all([
          db.post.findMany({
            where: { status: 'PUBLISHED', postType: 'BLOG' },
            orderBy: { createdAt: 'desc' },
            take: 30,
            include: {
              author: { select: { name: true } },
              category: { select: { name: true, slug: true, icon: true } },
            },
          }),
          db.post.count({ where: { status: 'PUBLISHED', postType: 'BLOG' } }),
          db.category.findMany({
            select: { id: true, name: true, slug: true, icon: true, _count: { select: { posts: true } } },
          }),
        ]);
        posts = result[0] as any[];
        totalPosts = result[1];
        categoriesWithCount = result[2] as any;
      } catch (fallbackErr) {
        console.error('Failed to load blog posts fallback:', fallbackErr);
        posts = [];
      }
    }
  }

  const blogSchema = posts.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Blog-Ghar Blog',
    description: 'Discover stories, tutorials, and insights across technology, lifestyle, education, and more.',
    url: 'https://bloghar.com/blog',
    blogPost: posts.slice(0, 10).map((post: any) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `https://bloghar.com/blog/${post.slug}`,
      datePublished: post.publishedAt?.toISOString(),
      author: { '@type': 'Person', name: post.author?.name || 'Blog-Ghar' },
    })),
  } : null;

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-dark-bg">
      <JsonLd type="BreadcrumbList" data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://bloghar.com' },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://bloghar.com/blog' },
        ],
      }} />
      {blogSchema && <JsonLd type="Blog" data={blogSchema} />}

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 text-white">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-20 left-1/4 text-6xl opacity-10 animate-bounce">📝</div>
          <div className="absolute bottom-20 right-1/4 text-5xl opacity-10 animate-pulse">✍️</div>
          <div className="absolute top-32 right-1/3 text-4xl opacity-5 animate-bounce" style={{ animationDelay: '0.5s' }}>📰</div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 pt-20 pb-16 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-sm text-blue-100 border border-white/10 mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Curated articles for curious minds</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-extrabold mb-6 leading-tight">
            Our <span className="bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent">Blog</span>
          </h1>

          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-8 leading-relaxed">
            Discover stories, tutorials, and insights across technology, lifestyle, education, finance, and more.
          </p>

          {totalPosts > 0 && (
            <div className="flex items-center justify-center gap-6">
              <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-blue-100 border border-white/10">
                <BookOpen className="w-4 h-4" />
                <span>{totalPosts} Published Articles</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-blue-100 border border-white/10">
                <TrendingUp className="w-4 h-4" />
                <span>Updated Daily</span>
              </div>
            </div>
          )}

          {params?.category && (
            <div className="mt-6">
              <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-blue-200 hover:text-white underline underline-offset-4 transition-colors">
                ← Clear category filter
              </Link>
            </div>
          )}
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60V30C240 10 480 0 720 0C960 0 1200 10 1440 30V60H0Z" fill="currentColor" className="text-gray-50/50 dark:text-dark-bg" />
          </svg>
        </div>
      </section>

      {/* Category Filter */}
      <section className="max-w-7xl mx-auto px-4 -mt-2 relative z-10">
        <div className="py-6">
          <CategoryFilter categories={categoriesWithCount} currentSlug={params?.category} />
        </div>
      </section>

      {/* Featured Posts Banner */}
      {posts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white">Featured Stories</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {posts.slice(0, 3).map((post) => (
              <BlogCard key={post.id} post={post} variant="featured" />
            ))}
          </div>
        </section>
      )}

      {/* Inline Ad */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <AdSlot slot="blog-featured-ad" format="rectangle" className="w-full flex justify-center" style={{ minHeight: '250px' }} />
      </div>

      {/* Stats Bar */}
      {posts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mb-10">
          <div className="bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-dark-border p-8 shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="text-3xl md:text-4xl font-display font-extrabold text-gray-900 dark:text-white">{totalPosts}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">Total Articles</div>
              </div>
              <div className="text-center group">
                <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-3xl md:text-4xl font-display font-extrabold text-gray-900 dark:text-white">{categoriesWithCount.length}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">Categories</div>
              </div>
              <div className="text-center group">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Eye className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-3xl md:text-4xl font-display font-extrabold text-gray-900 dark:text-white">
                  {formatNumber(posts.reduce((sum, p) => sum + (p.views || 0), 0))}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">Total Views</div>
              </div>
              <div className="text-center group">
                <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <User className="w-7 h-7 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="text-3xl md:text-4xl font-display font-extrabold text-gray-900 dark:text-white">
                  {new Set(posts.map(p => p.author?.name).filter(Boolean)).size}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">Authors</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Blog Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
            {params?.category
              ? `${categoriesWithCount.find(c => c.slug === params.category)?.name || ''} Articles`
              : 'Latest Articles'}
          </h2>
          {posts.length > 0 && (
            <span className="text-sm text-gray-500">
              Showing {posts.length} {posts.length === 1 ? 'article' : 'articles'}
            </span>
          )}
        </div>

        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} variant="default" />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-16 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-display font-bold mb-2 text-gray-900 dark:text-white">No blog posts yet</h3>
            <p className="text-gray-500 mb-6">Check back soon for amazing content!</p>
            <Link href="/admin/blogs/import" className="btn-primary">Create First Post</Link>
          </div>
        )}
      </section>
    </div>
  );
}
