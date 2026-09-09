import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import AdminSidebar from './components/admin-sidebar';

export const metadata: Metadata = {
  title: 'Admin',
  description: 'Admin dashboard',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  let stats: {
    posts: number;
    users: number;
    games: number;
    tools: number;
    comments: number;
    subscribers: number;
    views: { _sum: { views: number | null } } | null;
    drafts: number;
    published: number;
    pendingReports: number;
    customCodePosts: number;
  } = { posts: 0, users: 0, games: 0, tools: 0, comments: 0, subscribers: 0, views: null, drafts: 0, published: 0, pendingReports: 0, customCodePosts: 0 };
  let recentPosts: any[] = [];
  let recentReports: any[] = [];
  let error: string | null = null;
  try {
    const [
      posts, users, games, tools, comments, subscribers, views,
      drafts, published, pendingReports, customCodePosts, recentPostsRaw, recentReportsRaw
    ] = await Promise.all([
      prisma.post.count(),
      prisma.user.count(),
      prisma.game.count(),
      prisma.tool.count(),
      prisma.comment.count(),
      prisma.newsletterSubscriber.count(),
      prisma.post.aggregate({ _sum: { views: true } }),
      prisma.post.count({ where: { status: 'DRAFT' } }),
      prisma.post.count({ where: { status: 'PUBLISHED' } }),
      prisma.report.count({ where: { status: 'OPEN' } }),
      prisma.post.count({ where: { format: 'CUSTOM_CODE' } }),
      prisma.post.findMany({ orderBy: { createdAt: 'desc' }, take: 5, include: { author: { select: { name: true } }, category: { select: { name: true, icon: true } } } }),
      prisma.report.findMany({ orderBy: { createdAt: 'desc' }, take: 5, include: { reporter: { select: { name: true } } } }),
    ]);
    stats = { posts, users, games, tools, comments, subscribers, views, drafts, published, pendingReports, customCodePosts };
    recentPosts = recentPostsRaw;
    recentReports = recentReportsRaw;
  } catch (err) {
    console.error('Admin dashboard metrics failed', err);
    error = 'Dashboard metrics are temporarily unavailable.';
  }

  const totalViews = stats.views?._sum?.views ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <div className="flex">
        <AdminSidebar />

        {/* Main */}
        <main className="flex-1 p-6 md:p-8">
          <h1 className="text-3xl font-display font-extrabold mb-6">Dashboard</h1>
          {error && <div className="mb-6 rounded-lg bg-red-100 p-4 text-sm text-red-700">{error}</div>}

          {/* Primary Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Published', value: (stats.published ?? 0).toLocaleString(), icon: '📝', color: 'bg-green-500', href: '/admin/posts' },
              { label: 'Drafts', value: (stats.drafts ?? 0).toLocaleString(), icon: '📋', color: 'bg-yellow-500', href: '/admin/posts' },
              { label: 'Total Views', value: totalViews.toLocaleString(), icon: '👁️', color: 'bg-blue-500', href: '/admin/posts' },
              { label: 'Users', value: (stats.users ?? 0).toLocaleString(), icon: '👥', color: 'bg-purple-500', href: '/admin/users' },
            ].map((s) => (
              <a key={s.label} href={s.href} className="bg-white dark:bg-dark-card rounded-xl p-5 shadow-sm border border-gray-200 dark:border-dark-border hover:border-primary-300 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${s.color} rounded-lg flex items-center justify-center text-white text-xl`}>{s.icon}</div>
                  <div>
                    <p className="text-sm text-gray-500 group-hover:text-gray-600">{s.label}</p>
                    <p className="text-2xl font-bold">{s.value}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Secondary Stats */}
            <div className="bg-white dark:bg-dark-card rounded-xl p-5 border border-gray-200 dark:border-dark-border">
              <h2 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-4">Platform</h2>
              <div className="space-y-3">
                {[
                  { label: 'Games', value: stats.games ?? 0 },
                  { label: 'Tools', value: stats.tools ?? 0 },
                  { label: 'Comments', value: stats.comments ?? 0 },
                  { label: 'Subscribers', value: stats.subscribers ?? 0 },
                  { label: 'Custom Code Posts', value: stats.customCodePosts ?? 0 },
                ].map(s => (
                  <div key={s.label} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{s.label}</span>
                    <span className="text-sm font-bold">{s.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-dark-card rounded-xl p-5 border border-gray-200 dark:border-dark-border">
              <h2 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <a href="/admin/posts/new" className="block p-3 bg-gray-50 dark:bg-dark-bg rounded-lg hover:bg-primary-50 hover:text-primary-700 transition-colors text-sm font-medium">+ New Blog Post</a>
                <a href="/author/posts/new" className="block p-3 bg-gray-50 dark:bg-dark-bg rounded-lg hover:bg-primary-50 hover:text-primary-700 transition-colors text-sm font-medium">+ Author Post (AUTHOR+)</a>
                <a href="/admin/games" className="block p-3 bg-gray-50 dark:bg-dark-bg rounded-lg hover:bg-primary-50 hover:text-primary-700 transition-colors text-sm font-medium">Manage Games</a>
                <a href="/admin/users" className="block p-3 bg-gray-50 dark:bg-dark-bg rounded-lg hover:bg-primary-50 hover:text-primary-700 transition-colors text-sm font-medium">Manage Users</a>
              </div>
            </div>

            {/* Moderation Queue */}
            <div className="bg-white dark:bg-dark-card rounded-xl p-5 border border-gray-200 dark:border-dark-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-sm uppercase tracking-wider text-gray-500">Moderation</h2>
                {stats.pendingReports > 0 && (
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-bold">{stats.pendingReports} open</span>
                )}
              </div>
              {recentReports.length === 0 ? (
                <p className="text-sm text-gray-400">No reports to review.</p>
              ) : (
                <div className="space-y-2">
                  {recentReports.map((r) => (
                    <a key={r.id} href={`/admin/reports`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 text-sm">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${r.status === 'OPEN' ? 'bg-red-500' : 'bg-gray-300'}`} />
                      <span className="flex-1 truncate text-gray-700">{r.reason} — {r.targetType}</span>
                      <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                    </a>
                  ))}
                </div>
              )}
              <a href="/admin/reports" className="block mt-3 text-sm text-primary-600 font-medium hover:text-primary-700">View all reports →</a>
            </div>
          </div>

          {/* Recent Posts */}
          <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-dark-border">
              <h2 className="font-bold text-lg">Recent Posts</h2>
              <a href="/admin/posts" className="text-sm text-primary-600 hover:text-primary-700 font-medium">View all →</a>
            </div>
            {recentPosts.length === 0 ? (
              <div className="p-12 text-center text-gray-400">No posts yet</div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-dark-border">
                {recentPosts.map((post: any) => (
                  <div key={post.id} className="flex items-center gap-4 p-4 hover:bg-gray-50/50 transition-colors">
                    <span className={`w-2 h-8 rounded-full shrink-0 ${post.status === 'PUBLISHED' ? 'bg-green-500' : post.status === 'DRAFT' ? 'bg-yellow-400' : 'bg-gray-300'}`} />
                    <div className="flex-1 min-w-0">
                      <a href={`/blog/${post.slug}`} className="font-medium text-sm hover:text-primary-600 truncate block">{post.title}</a>
                      <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
                        <span>{post.author?.name || 'Unknown'}</span>
                        <span>{post.category?.icon} {post.category?.name || 'Uncategorized'}</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${post.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : post.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>{post.status}</span>
                      {post.format === 'CUSTOM_CODE' && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-[11px] font-bold">CUSTOM</span>}
                      <a href={`/admin/posts/new?id=${post.id}`} className="text-xs text-primary-600 hover:text-primary-700">Edit</a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
