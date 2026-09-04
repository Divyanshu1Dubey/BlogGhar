import { db } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, Eye } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { JsonLd } from '@/components/seo/json-ld';

export const dynamic = 'force-dynamic';

type PostParams = Promise<{ slug: string; id: string }>;

export async function generateMetadata({ params }: { params: PostParams }) {
  try {
    const { slug, id } = await params;
    const post = await db.forumPost.findUnique({
      where: { id },
      select: { title: true, content: true },
    });
    if (!post) return {};
    return {
      title: `${post.title} | Blog-Ghar Forum`,
      description: post.content?.slice(0, 160) || `Discussion: ${post.title}`,
      alternates: { canonical: `https://bloghar.com/forum/${slug}/${id}` },
    };
  } catch {
    return {};
  }
}

export default async function ForumPostPage({ params }: { params: PostParams }) {
  const { slug, id } = await params;
  let post: any = null;
  let replies: any[] = [];
  try {
    const result = await db.forumPost.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, image: true } },
        forum: { select: { name: true, slug: true } },
        _count: { select: { replies: true } },
        replies: {
          orderBy: { createdAt: 'asc' },
          include: { user: { select: { name: true, image: true } } },
        },
      },
    });
    post = result;
    if (post) {
      replies = post.replies;
    }
  } catch {}

  if (!post) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <JsonLd type="BreadcrumbList" data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://bloghar.com' },
          { '@type': 'ListItem', position: 2, name: 'Forum', item: 'https://bloghar.com/forum' },
          { '@type': 'ListItem', position: 3, name: post.forum.name, item: `https://bloghar.com/forum/${post.forum.slug}` },
          { '@type': 'ListItem', position: 4, name: post.title, item: `https://bloghar.com/forum/${slug}/${id}` },
        ],
      }} />
      <Link href={`/forum/${slug}`} className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to {post.forum.name}
      </Link>

      {/* Original Post */}
      <article className="card p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center font-medium">
            {post.user?.image ? (
              <img src={post.user.image} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              (post.user?.name || '?').charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <p className="font-medium text-sm">{post.user?.name || 'Anonymous'}</p>
            <p className="text-xs text-gray-400">{formatDate(post.createdAt)}</p>
          </div>
          <div className="ml-auto flex gap-2">
            {post.isPinned && <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-medium">Pinned</span>}
            {post.isLocked && <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">Locked</span>}
          </div>
        </div>
        <h1 className="text-2xl font-display font-bold mb-4">{post.title}</h1>
        <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
          {post.content}
        </div>
        <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gray-100 dark:border-dark-border text-xs text-gray-400">
          <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {post.views || 0} views</span>
          <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {post._count.replies} replies</span>
        </div>
      </article>

      {/* Replies */}
      {replies.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-display font-bold mb-4">
            {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
          </h2>
          <div className="space-y-4">
            {replies.map((reply: any) => (
              <article key={reply.id} className="card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gray-100 dark:bg-dark-bg rounded-full flex items-center justify-center text-sm font-medium">
                    {reply.user?.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{reply.user?.name || 'Anonymous'}</p>
                    <p className="text-xs text-gray-400">{formatDate(reply.createdAt)}</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap">{reply.content}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Reply Form */}
      <div className="card p-6">
        <h3 className="font-display font-bold text-lg mb-4">Post a Reply</h3>
        <form action="/api/forum/reply" method="POST" className="space-y-4">
          <input type="hidden" name="topicId" value={id} />
          <textarea
            name="content"
            rows={4}
            required
            placeholder="Write your reply..."
            className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg dark:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          />
          <button type="submit" className="btn-primary px-6">Post Reply</button>
        </form>
      </div>
    </div>
  );
}
