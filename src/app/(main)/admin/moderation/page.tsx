import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import Link from 'next/link';
import AdminSidebar from '@/app/(main)/admin/components/admin-sidebar';

export const metadata: Metadata = {
  title: 'Moderation Queue — Blog-Ghar Admin',
  description: 'Content moderation queue',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

type PendingItem = {
  id: string;
  type: 'post' | 'community' | 'comment';
  title: string;
  content: string;
  author: { name: string; email: string };
  createdAt: string;
  status: string;
};

export default async function AdminModerationPage({ searchParams }: { searchParams?: Promise<{ type?: string }> }) {
  const adminCheck = await requireAdmin();
  if (adminCheck.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-lg font-medium">{adminCheck.error}</div>
      </div>
    );
  }

  const params = await searchParams;
  const filterType = params?.type || 'all';

  // Get pending items
  let pendingPosts: any[] = [];
  let pendingCommunity: any[] = [];
  let pendingComments: any[] = [];

  try {
    const [posts, community, comments] = await Promise.all([
      prisma.post.findMany({
        where: filterType === 'all' || filterType === 'post'
          ? { status: 'PENDING' }
          : undefined,
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: { author: { select: { name: true, email: true } } },
      }),
      prisma.communityPost.findMany({
        where: filterType === 'all' || filterType === 'community'
          ? { status: 'PENDING' }
          : undefined,
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: { author: { select: { name: true, email: true } } },
      }),
      prisma.comment.findMany({
        where: filterType === 'all' || filterType === 'comment'
          ? { status: 'PENDING' }
          : undefined,
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: { user: { select: { name: true, email: true } } },
      }),
    ]);
    pendingPosts = posts;
    pendingCommunity = community;
    pendingComments = comments;
  } catch {
    // ignore
  }

  const tabs = [
    { key: 'all', label: 'All', count: pendingPosts.length + pendingCommunity.length + pendingComments.length },
    { key: 'post', label: 'Posts', count: pendingPosts.length },
    { key: 'community', label: 'Community', count: pendingCommunity.length },
    { key: 'comment', label: 'Comments', count: pendingComments.length },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <AdminSidebar current="Moderation" />
      <main className="ml-64 p-8">
        <div className="max-w-6xl">
          <h1 className="text-3xl font-extrabold mb-2">Moderation Queue</h1>
          <p className="text-gray-500 mb-6">Review and approve or reject pending content.</p>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {tabs.map(tab => (
              <Link
                key={tab.key}
                href={`?type=${tab.key}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterType === tab.key
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border hover:border-primary-300'
                }`}
              >
                {tab.label} ({tab.count})
              </Link>
            ))}
          </div>

          {/* Pending Posts */}
          {(filterType === 'all' || filterType === 'post') && pendingPosts.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Pending Posts ({pendingPosts.length})</h2>
              <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border divide-y divide-gray-100 dark:divide-dark-border">
                {pendingPosts.map(post => (
                  <div key={post.id} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{post.title}</h3>
                        <p className="text-sm text-gray-500 line-clamp-2">{post.excerpt || post.content.slice(0, 200)}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                          <span>by {post.author.name || post.author.email}</span>
                          <span>·</span>
                          <span>{new Date(post.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <form action={`/api/admin/posts/${post.id}/moderate`} method="post">
                          <input type="hidden" name="action" value="approve" />
                          <button type="submit" className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700">Approve</button>
                        </form>
                        <form action={`/api/admin/posts/${post.id}/moderate`} method="post">
                          <input type="hidden" name="action" value="reject" />
                          <button type="submit" className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700">Reject</button>
                        </form>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pending Community Posts */}
          {(filterType === 'all' || filterType === 'community') && pendingCommunity.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Pending Community Posts ({pendingCommunity.length})</h2>
              <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border divide-y divide-gray-100 dark:divide-dark-border">
                {pendingCommunity.map(post => (
                  <div key={post.id} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">{post.content}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                          <span>by {post.author.name || post.author.email}</span>
                          <span>·</span>
                          <span>{new Date(post.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <form action={`/api/admin/community/${post.id}/moderate`} method="post">
                          <input type="hidden" name="action" value="approve" />
                          <button type="submit" className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700">Approve</button>
                        </form>
                        <form action={`/api/admin/community/${post.id}/moderate`} method="post">
                          <input type="hidden" name="action" value="reject" />
                          <button type="submit" className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700">Reject</button>
                        </form>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {pendingPosts.length === 0 && pendingCommunity.length === 0 && pendingComments.length === 0 && (
            <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-12 text-center">
              <p className="text-gray-500 text-lg">All caught up! No pending content to review.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
