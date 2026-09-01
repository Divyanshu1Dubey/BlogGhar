import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { formatDate, readingTime } from '@/lib/utils';
import { ArrowLeft, Eye } from 'lucide-react';

type NewsParams = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: NewsParams }) {
  try {
    const { slug } = await params;
    const post = await prisma.post.findUnique({ where: { slug } });
    if (!post) return {};
    return { title: `${post.title} | Blog-Ghar News`, description: post.excerpt || '' };
  } catch { return {}; }
}

export default async function NewsDetailPage({ params }: { params: NewsParams }) {
  const { slug } = await params;
  let post;
  try {
    post = await prisma.post.findUnique({
      where: { slug },
      include: { user: { select: { name: true } }, category: { select: { name: true, slug: true } } },
    });
  } catch { post = null; }
  if (!post) notFound();

  try { await prisma.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } }); } catch {}

  return (
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
          <span className="font-medium">{post.user.name}</span>
          <span>•</span>
          <span>{formatDate(post.publishedAt || post.createdAt)}</span>
          <span>•</span>
          <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {post.views}</span>
        </div>
      </div>

      <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
