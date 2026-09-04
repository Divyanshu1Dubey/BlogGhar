import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Clock, Eye } from 'lucide-react';
import { readingTime, formatNumber } from '@/lib/utils';
import { JsonLd } from '@/components/seo/json-ld';

export const dynamic = 'force-dynamic';

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

  const whereCondition = {
    postType: 'BLOG',
    status: 'PUBLISHED',
    ...(params?.category ? { category: { slug: params.category } } : {}),
  };

  try {
    [posts, totalPosts] = await Promise.all([
      prisma.post.findMany({
        where: whereCondition,
        orderBy: { publishedAt: 'desc' },
        take: 60,
        include: {
          author: { select: { name: true } },
          category: { select: { name: true, slug: true, icon: true } },
        },
      }),
      prisma.post.count({
        where: whereCondition,
      }),
    ]);
  } catch (primaryErr) {
    console.error('Failed to load blog posts with full query:', primaryErr);
    try {
      // Resilient fallback: load posts without extra filters if primary query failed
      posts = await prisma.post.findMany({
        where: { status: 'PUBLISHED', postType: 'BLOG' },
        orderBy: { createdAt: 'desc' },
        take: 30,
        include: {
          author: { select: { name: true } },
          category: { select: { name: true, slug: true, icon: true } },
        },
      });
      totalPosts = posts.length;
    } catch (fallbackErr) {
      console.error('Failed to load blog posts fallback:', fallbackErr);
      posts = [];
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
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
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
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-indigo-700 text-white py-16">
        <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
          <div className="absolute top-10 right-20 text-8xl animate-bounce">📝</div>
          <div className="absolute bottom-10 left-20 text-7xl animate-pulse">✍️</div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-4">📝 Our Blog</h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Discover stories, tutorials, and insights across technology, lifestyle, education, finance, and more.
          </p>
          {totalPosts > 0 && (
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs text-blue-100">
              <span>📚</span> {totalPosts} Published Articles
            </div>
          )}
          {params?.category && (
            <div className="mt-4">
              <Link href="/blog" className="text-sm text-blue-200 hover:text-white underline">
                ← Clear category filter
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Featured Posts Banner */}
      {posts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 -mt-6 relative z-10">
          <div className="card p-1">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {posts.slice(0, 3).map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group relative h-48 rounded-xl overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 flex items-end p-5 hover:shadow-lg transition-all"
                >
                  <div className="absolute top-3 left-3 text-4xl opacity-80 group-hover:scale-110 transition-transform">
                    {post.category?.icon || '📝'}
                  </div>
                  <div className="relative z-10">
                    <span className="inline-block px-2.5 py-1 bg-white/90 dark:bg-dark-bg/90 backdrop-blur-sm rounded-full text-xs font-medium mb-2">
                      {post.category?.name || 'Blog'}
                    </span>
                    <h3 className="font-display font-bold text-base line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Blog Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <article key={post.id} className="card overflow-hidden group hover:shadow-lg transition-all">
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="aspect-video bg-gray-200 dark:bg-dark-bg relative overflow-hidden">
                    {post.featuredImage ? (
                      <img src={post.featuredImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800">
                        {post.category?.icon || '📝'}
                      </div>
                    )}
                    {post.category && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 dark:bg-dark-bg/90 backdrop-blur-sm rounded-full text-xs font-medium">
                        {post.category.icon} {post.category.name}
                      </span>
                    )}
                    {index < 3 && (
                      <span className="absolute top-3 right-3 px-2 py-1 bg-yellow-500 text-white text-[10px] font-bold rounded-full">
                        ⭐ Featured
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <Link href={`/blog/${post.slug}`}>
                      <h3 className="font-bold text-lg mb-2 group-hover:text-primary-600 transition-colors line-clamp-2 leading-tight">
                        {post.title}
                      </h3>
                    </Link>
                    {post.excerpt && <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 leading-relaxed">{post.excerpt}</p>}
                    <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100 dark:border-dark-border">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-[10px] font-medium text-primary-700">
                          {(post.author?.name || '?').charAt(0).toUpperCase()}
                        </div>
                        <span>{post.author?.name || 'Anonymous'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime || readingTime(post.content)}m</span>
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {formatNumber(post.views || 0)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="card p-16 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-display font-bold mb-2">No blog posts yet</h3>
            <p className="text-gray-500 mb-4">Check back soon for amazing content!</p>
            <Link href="/admin/blogs/import" className="btn-primary">Create First Post</Link>
          </div>
        )}
      </section>
    </div>
  );
}
