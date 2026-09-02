import prisma from '@/lib/prisma';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { JsonLd } from '@/components/seo/json-ld';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return {
    title: 'Community Forum',
    description: 'Join the Blog-Ghar community forum. Discuss topics, ask questions, and connect with other users.',
    alternates: { canonical: 'https://blogghar.com/forum' },
  };
}

export default async function ForumPage() {
  let forums: any[] = [];
  let recentPosts: any[] = [];
  try {
    forums = await prisma.forum.findMany({ include: { _count: { select: { posts: true } } } });
    recentPosts = await prisma.forumPost.findMany({
      where: { parentId: null },
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, image: true } }, forum: { select: { name: true, slug: true } }, _count: { select: { replies: true } } },
    });
  } catch { forums = []; recentPosts = []; }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <JsonLd type="BreadcrumbList" data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://blogghar.com' },
          { '@type': 'ListItem', position: 2, name: 'Forum', item: 'https://blogghar.com/forum' },
        ],
      }} />
      <div className="text-center mb-10">
        <h1 className="text-4xl font-display font-extrabold mb-3">💬 Community Forum</h1>
        <p className="text-gray-600 dark:text-gray-400">Discuss, ask questions, and connect with our community</p>
      </div>

      {/* Forums */}
      <section className="mb-12">
        <h2 className="text-2xl font-display font-bold mb-6">📋 Forums</h2>
        <div className="card divide-y divide-gray-100 dark:divide-dark-border">
          {forums.length > 0 ? forums.map((forum) => (
            <Link key={forum.id} href={`/forum/${forum.slug}`} className="p-5 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-dark-bg">
              <div className="text-3xl">{forum.icon || '💬'}</div>
              <div className="flex-1">
                <h3 className="font-bold">{forum.name}</h3>
                <p className="text-sm text-gray-500">{forum.description}</p>
              </div>
              <div className="text-right text-sm">
                <p className="font-bold">{forum._count.posts}</p>
                <p className="text-xs text-gray-500">posts</p>
              </div>
            </Link>
          )) : (
            <div className="p-8 text-center text-gray-500">No forums yet</div>
          )}
        </div>
      </section>

      {/* Recent Posts */}
      <section>
        <h2 className="text-2xl font-display font-bold mb-6">🔥 Recent Discussions</h2>
        <div className="card divide-y divide-gray-100 dark:divide-dark-border">
          {recentPosts.length > 0 ? recentPosts.map((post) => (
            <Link key={post.id} href={`/forum/${post.forum.slug}/${post.id}`} className="p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-dark-bg">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center font-medium text-sm">
                {post.user?.image ? (
                  <img src={post.user.image} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  (post.user?.name || '?').charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium hover:text-primary-600">{post.title}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <span>{post.user?.name}</span>
                  <span>•</span>
                  <span>{post.forum?.name}</span>
                  <span>•</span>
                  <span>{formatDate(post.createdAt)}</span>
                </div>
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <MessageCircle className="w-3 h-3" /> {post._count.replies}
              </div>
            </Link>
          )) : (
            <div className="p-8 text-center text-gray-500">No discussions yet. Start one!</div>
          )}
        </div>
      </section>
    </div>
  );
}
