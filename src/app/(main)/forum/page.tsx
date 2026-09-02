import prisma from '@/lib/prisma';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community Forum',
  description: 'Join the Blog-Ghar community forum. Discuss topics, ask questions, and connect with other users.',
  openGraph: { title: 'Community Forum', description: 'Join the Blog-Ghar community forum and connect with other users.', type: 'website' },
};

export const dynamic = 'force-dynamic';

export default async function ForumPage() {
  let forums: any[] = [];
  let topics: any[] = [];
  try {
    forums = await prisma.forum.findMany({ include: { _count: { select: { topics: true } } } });
    topics = await prisma.forumTopic.findMany({ take: 20, orderBy: { lastReplyAt: 'desc' }, include: { user: { select: { name: true } }, forum: { select: { name: true, slug: true } }, _count: { select: { replies: true } } } });
  } catch { forums = []; topics = []; }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
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
              <div className="text-3xl">{forum.icon}</div>
              <div className="flex-1">
                <h3 className="font-bold">{forum.name}</h3>
                <p className="text-sm text-gray-500">{forum.description}</p>
              </div>
              <div className="text-right text-sm">
                <p className="font-bold">{forum._count.topics}</p>
                <p className="text-xs text-gray-500">topics</p>
              </div>
            </Link>
          )) : (
            <div className="p-8 text-center text-gray-500">No forums yet</div>
          )}
        </div>
      </section>

      {/* Recent Topics */}
      <section>
        <h2 className="text-2xl font-display font-bold mb-6">🔥 Recent Discussions</h2>
        <div className="card divide-y divide-gray-100 dark:divide-dark-border">
          {topics.length > 0 ? topics.map((topic) => (
            <Link key={topic.id} href={`/forum/topic/${topic.id}`} className="p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-dark-bg">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center font-medium text-sm">{(topic.user.name || '?').charAt(0)}</div>
              <div className="flex-1">
                <h3 className="font-medium hover:text-primary-600">{topic.title}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <span>{topic.user.name}</span>
                  <span>•</span>
                  <span>{topic.forum.name}</span>
                  <span>•</span>
                  <span>{formatDate(topic.lastReplyAt || topic.createdAt)}</span>
                </div>
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <MessageCircle className="w-3 h-3" /> {topic._count.replies}
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