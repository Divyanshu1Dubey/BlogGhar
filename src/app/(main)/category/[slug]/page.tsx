import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Eye } from 'lucide-react';
import { formatDate, readingTime } from '@/lib/utils';
import { Metadata } from 'next';
import { JsonLd } from '@/components/seo/json-ld';

type CategoryParams = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: CategoryParams }) {
  const { slug } = await params;
  try {
    const category = await prisma.category.findUnique({ where: { slug } });
    if (!category) return {};
    return {
      title: `${category.name} | Blog-Ghar`,
      description: category.description || `Read ${category.name} articles and posts on Blog-Ghar.`,
      alternates: { canonical: `https://blogghar.com/category/${category.slug}` },
    };
  } catch {
    return {};
  }
}

export default async function CategoryPage({ params }: { params: CategoryParams }) {
  const { slug } = await params;
  let category;
  let posts: any[] = [];
  try {
    category = await prisma.category.findUnique({
      where: { slug },
      include: {
        posts: {
          where: { status: 'PUBLISHED', postType: 'BLOG' },
          orderBy: { publishedAt: 'desc' },
          take: 20,
          include: {
            user: { select: { name: true } },
            category: { select: { name: true, slug: true } },
          },
        },
      },
    });
  } catch {
    category = null;
    posts = [];
  }

  if (!category) notFound();

  const postsList = category.posts || posts;

  return (
    <>
      <JsonLd type="BreadcrumbList" data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://blogghar.com' },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://blogghar.com/blog' },
          { '@type': 'ListItem', position: 3, name: category.name, item: `https://blogghar.com/category/${category.slug}` },
        ],
      }} />
      <JsonLd type="ItemList" data={{
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        numberOfItems: postsList.length,
        itemListElement: postsList.map((post, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `https://blogghar.com/blog/${post.slug}`,
          name: post.title,
        })),
      }} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/blog" className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        <div className="mb-10">
          <h1 className="text-4xl font-display font-extrabold mb-3">{category.name}</h1>
          {category.description && (
            <p className="text-gray-600 dark:text-gray-400">{category.description}</p>
          )}
          <p className="text-sm text-gray-500 mt-2">{postsList.length} posts</p>
        </div>

        {postsList.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {postsList.map((post) => (
              <article key={post.id} className="card overflow-hidden group">
                <div className="aspect-video bg-gray-200 dark:bg-dark-bg relative">
                  {post.featuredImage ? (
                    <img src={post.featuredImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">📝</div>
                  )}
                </div>
                <div className="p-5">
                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">{post.title}</h3>
                  </Link>
                  {post.excerpt && <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{post.excerpt}</p>}
                  <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100 dark:border-dark-border">
                    <span>{post.author.name}</span>
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
            <p className="text-4xl mb-3">📂</p>
            <p className="text-gray-500">No posts in this category yet.</p>
            <Link href="/blog" className="btn-primary mt-4 inline-block">Browse All Posts</Link>
          </div>
        )}
      </div>
    </>
  );
}
