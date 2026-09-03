import prisma from '@/lib/prisma';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { Metadata } from 'next';
import { JsonLd } from '@/components/seo/json-ld';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return {
    title: 'Latest News',
    description: 'Stay updated with the latest news and trending stories from around the world on Blog-Ghar.',
    alternates: { canonical: 'https://bloghar.com/news' },
  };
}

export default async function NewsPage() {
  let news: any[] = [];
  try {
    news = await prisma.post.findMany({
      where: { postType: 'NEWS', status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: 30,
      include: { category: { select: { name: true, slug: true } } },
    });
  } catch {}

  const trending = news.slice(0, 5);

  const newsSchema = news.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: news.length,
    itemListElement: news.map((post, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://bloghar.com/news/${post.slug}`,
      name: post.title,
    })),
  } : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <JsonLd type="BreadcrumbList" data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://bloghar.com' },
          { '@type': 'ListItem', position: 2, name: 'News', item: 'https://bloghar.com/news' },
        ],
      }} />
      {newsSchema && <JsonLd type="ItemList" data={newsSchema} />}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-display font-extrabold mb-3">📰 Latest News</h1>
        <p className="text-gray-600 dark:text-gray-400">Stay updated with the latest news from around the world</p>
      </div>

      {/* Trending */}
      {trending.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-display font-bold mb-6">🔥 Trending</h2>
          <div className="grid md:grid-cols-5 gap-4">
            {trending.map((post, idx) => (
              <Link key={post.id} href={`/news/${post.slug}`} className={`card overflow-hidden group ${idx === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
                <div className={`bg-gray-200 dark:bg-dark-bg ${idx === 0 ? 'aspect-video' : 'aspect-square'}`}>
                  {post.featuredImage && <img src={post.featuredImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />}
                </div>
                <div className="p-4">
                  <h3 className="font-bold group-hover:text-primary-600 line-clamp-2">{post.title}</h3>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* All News */}
      <section>
        <h2 className="text-2xl font-display font-bold mb-6">All News</h2>
        {news.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {news.map((post) => (
              <Link key={post.id} href={`/news/${post.slug}`} className="card overflow-hidden group">
                <div className="aspect-video bg-gray-200 dark:bg-dark-bg">
                  {post.featuredImage && <img src={post.featuredImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />}
                </div>
                <div className="p-5">
                  <h3 className="font-bold group-hover:text-primary-600 line-clamp-2 mb-2">{post.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                    <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                    {post.category && <><span>•</span><span>{post.category.name}</span></>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <p className="text-4xl mb-3">📰</p>
            <p className="text-gray-500">No news yet. Check back soon!</p>
          </div>
        )}
      </section>
    </div>
  );
}