import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Clock, Eye } from 'lucide-react';
import { readingTime } from '@/lib/utils';
import { JsonLd } from '@/components/seo/json-ld';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return {
    title: 'Blog',
    description: 'Discover stories, tutorials, and insights across technology, lifestyle, education, and more on Blog-Ghar.',
    alternates: { canonical: 'https://bloghar.com/blog' },
  };
}

export default async function BlogPage({ searchParams }: { searchParams?: Promise<{ category?: string }> }) {
  const params = await searchParams;
  let posts: any[] = [];
  try {
    posts = await prisma.post.findMany({
      where: {
        postType: 'BLOG',
        status: 'PUBLISHED',
        ...(params?.category ? { category: { slug: params.category } } : {}),
      },
      orderBy: { publishedAt: 'desc' },
      take: 20,
      include: { author: { select: { name: true } }, category: { select: { name: true, slug: true } } },
    });
  } catch { posts = []; }

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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <JsonLd type="BreadcrumbList" data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://bloghar.com' },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://bloghar.com/blog' },
        ],
      }} />
      {blogSchema && <JsonLd type="Blog" data={blogSchema} />}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-display font-extrabold mb-3">📝 Our Blog</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Discover stories, tutorials, and insights across technology, lifestyle, education, and more.</p>
      </div>

      {posts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article key={post.id} className="card overflow-hidden group">
              <div className="aspect-video bg-gray-200 dark:bg-dark-bg relative">
                {post.featuredImage ? (
                  <img src={post.featuredImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">📝</div>
                )}
                {post.category && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 dark:bg-dark-bg/90 backdrop-blur-sm rounded-full text-xs font-medium">{post.category.name}</span>
                )}
              </div>
              <div className="p-5">
                <Link href={`/blog/${post.slug}`}>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">{post.title}</h3>
                </Link>
                {post.excerpt && <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{post.excerpt}</p>}
                <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100 dark:border-dark-border">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-[10px] font-medium">{(post.author.name || '?').charAt(0)}</div>
                    <span>{post.author.name || 'Anonymous'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {readingTime(post.content)}m</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {post.views}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <p className="text-4xl mb-3">📝</p>
          <p className="text-gray-500">No blog posts yet. Stay tuned!</p>
        </div>
      )}
    </div>
  );
}
