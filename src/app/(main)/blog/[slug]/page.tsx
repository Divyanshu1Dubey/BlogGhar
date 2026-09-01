import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { formatDate, readingTime } from '@/lib/utils';
import { ArrowLeft, Clock, Eye, MessageCircle, Share2, Bookmark, ThumbsUp } from 'lucide-react';
import CommentSection from '@/components/comments/comment-section';

type BlogParams = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: BlogParams }) {
  try {
    const { slug } = await params;
    const post = await prisma.post.findUnique({ where: { slug } });
    if (!post) return {};
    return {
      title: `${post.title} | Blog-Ghar`,
      description: post.excerpt || '',
      openGraph: { title: post.title, description: post.excerpt || '', images: post.coverImage ? [post.coverImage] : [] },
    };
  } catch {
    return {};
  }
}

export default async function BlogPostPage({ params }: { params: BlogParams }) {
  const { slug } = await params;
  let post;
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

  // Increment views
  try { await prisma.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } }); } catch {}

  let related: any[] = [];
  try {
    related = await prisma.post.findMany({
      where: { categoryId: post.categoryId, NOT: { id: post.id }, status: 'PUBLISHED' },
      take: 3,
      orderBy: { publishedAt: 'desc' },
    });
  } catch {}

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/blog" className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Blog
      </Link>

      {post.coverImage && (
        <img src={post.coverImage} alt={post.title} className="w-full aspect-video object-cover rounded-2xl mb-6" />
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
                <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {readingTime(post.content)} min</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {post.views}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="prose dark:prose-invert max-w-none mb-8" dangerouslySetInnerHTML={{ __html: post.content }} />

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-gray-200 dark:border-dark-border">
          {post.tags.map((t: any) => (
            <Link key={t.tag.id} href={`/tag/${t.tag.slug}`} className="px-3 py-1 bg-gray-100 dark:bg-dark-bg rounded-full text-xs hover:bg-primary-100 dark:hover:bg-primary-900/30">
              #{t.tag.name}
            </Link>
          ))}
        </div>
      )}

      {/* Actions */}
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

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-12 pt-8 border-t border-gray-200 dark:border-dark-border">
          <h2 className="text-2xl font-display font-bold mb-6">📚 Related Posts</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {related.map((r) => (
              <Link key={r.id} href={`/blog/${r.slug}`} className="card overflow-hidden group">
                {r.coverImage && <img src={r.coverImage} alt="" className="aspect-video w-full object-cover" />}
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
