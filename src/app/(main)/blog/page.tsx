import { prisma, getAvailable } from '@/lib/prisma';
import Link from 'next/link';
import { BlogCard } from '@/components/blog/blog-card';

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

  if (pageError) {
    return (
      <div className="min-h-screen bg-gray-50/50 dark:bg-dark-bg">
        <div className="max-w-3xl mx-auto px-4 pt-10">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">
            <h2 className="font-bold text-lg mb-1">Temporary loading error</h2>
            <p className="text-sm opacity-90">{pageError}</p>
            <p className="text-xs mt-3 opacity-75">If this persists, please try again shortly.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-dark-bg">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Blog</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">{totalPosts} published articles</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} variant="default" />
          ))}
        </div>
      </div>
    </div>
  );
}
