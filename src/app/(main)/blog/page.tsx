import { prisma, getAvailable } from '@/lib/prisma';
import Link from 'next/link';
import { BookOpen, TrendingUp } from 'lucide-react';
import { JsonLd } from '@/components/seo/json-ld';
import { BlogCard } from '@/components/blog/blog-card';
import { CategoryFilter } from '@/components/blog/category-filter';

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
  let params: { category?: string } | undefined;
  let posts: any[] = [];
  let totalPosts = 0;
  let categoriesWithCount: { id: string; name: string; slug: string; icon: string | null; _count: { posts: number } }[] = [];
  let pageError: string | null = null;

  try {
    params = await searchParams;

    const whereCondition = {
      postType: 'BLOG',
      status: 'PUBLISHED',
      ...(params?.category ? { category: { slug: params.category } } : {}),
    };

    if (!getAvailable()) {
      posts = [];
      totalPosts = 0;
      categoriesWithCount = [];
    } else {
      const result = await Promise.all([
        prisma.post.findMany({
          where: whereCondition,
          orderBy: { publishedAt: 'desc' },
          take: 60,
          include: {
            author: { select: { name: true } },
            category: { select: { name: true, slug: true, icon: true } },
          },
        }),
        prisma.post.count({ where: whereCondition }),
        prisma.category.findMany({
          select: { id: true, name: true, slug: true, icon: true, _count: { select: { posts: true } } },
        }),
      ]);
      posts = result[0] as any[];
      totalPosts = result[1];
      categoriesWithCount = result[2] as any;
    }
  } catch (error: any) {
    pageError = error?.message || 'Failed to load blog posts';
    console.error('Blog page error:', error);
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
      {pageError && (
        <div className="max-w-3xl mx-auto px-4 pt-10">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">
            <h2 className="font-bold text-lg mb-1">Temporary loading error</h2>
            <p className="text-sm opacity-90">{pageError}</p>
            <p className="text-xs mt-3 opacity-75">If this persists, please try again shortly.</p>
          </div>
        </div>
      )}
      {!pageError && <JsonLd type="BreadcrumbList" data={{
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
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 pt-16 pb-16 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold mb-4 leading-tight">
            Our Blog
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-8 leading-relaxed">
            Discover stories, tutorials, and insights across technology, lifestyle, education, finance, and more.
          </p>
          {totalPosts > 0 && (
            <div className="flex items-center justify-center gap-6">
              <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 rounded-full text-sm text-blue-100 border border-white/10">
                <BookOpen className="w-4 h-4" />
                <span>{totalPosts} Published Articles</span>
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

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full">
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
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white">
              {params?.category ? `${categoriesWithCount.find(c => c.slug === params.category)?.name || ''} Articles` : 'Featured Stories'}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {posts.slice(0, 3).map((post) => (
              <BlogCard key={post.id} post={post} variant="featured" />
            ))}
          </div>
        </section>
      )}

      {/* Main Blog Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        {posts.length > 1 && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">All Articles</h2>
            <span className="text-sm text-gray-500">{totalPosts} total</span>
          </div>
        )}

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
            <p className="text-gray-500">Check back soon for amazing content!</p>
          </div>
        )}
      </section>
    </div>
  );
}
