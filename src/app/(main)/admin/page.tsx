import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import Link from 'next/link';
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
  } = {
    posts: 0,
    users: 0,
    games: 0,
    tools: 0,
    comments: 0,
    subscribers: 0,
    views: null,
  };
  let error: string | null = null;
  if (prisma) {
    try {
      const [posts, users, games, tools, comments, subscribers, views] = await Promise.all([
        prisma.post.count(),
        prisma.user.count(),
        prisma.game.count(),
        prisma.tool.count(),
        prisma.comment.count(),
        prisma.newsletterSubscriber.count(),
        prisma.post.aggregate({ _sum: { views: true } }),
      ]);
      stats = { posts, users, games, tools, comments, subscribers, views };
    } catch (err) {
      console.error('Admin dashboard metrics failed', err);
      error = 'Dashboard metrics are temporarily unavailable.';
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <div className="flex">
        <AdminSidebar />

        {/* Main */}
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-display font-extrabold mb-8">Dashboard</h1>
          {error && <div className="mb-6 rounded-lg bg-red-100 p-4 text-sm text-red-700">{error}</div>}

          {/* Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Posts', value: (stats?.posts ?? 0).toLocaleString(), icon: '📝', color: 'bg-blue-500' },
              { label: 'Users', value: (stats?.users ?? 0).toLocaleString(), icon: '👥', color: 'bg-green-500' },
              { label: 'Games', value: (stats?.games ?? 0).toLocaleString(), icon: '🎮', color: 'bg-purple-500' },
              { label: 'Tools', value: (stats?.tools ?? 0).toLocaleString(), icon: '🔧', color: 'bg-yellow-500' },
              { label: 'Comments', value: (stats?.comments ?? 0).toLocaleString(), icon: '💬', color: 'bg-pink-500' },
              { label: 'Subscribers', value: (stats?.subscribers ?? 0).toLocaleString(), icon: '📧', color: 'bg-orange-500' },
              { label: 'Views', value: (stats?.views?._sum?.views ?? 0).toLocaleString(), icon: '👁️', color: 'bg-indigo-500' },
            ].map((s) => (
              <div key={s.label} className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-border">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${s.color} rounded-lg flex items-center justify-center text-white text-xl`}>{s.icon}</div>
                  <div><p className="text-sm text-gray-500">{s.label}</p><p className="text-2xl font-bold">{s.value}</p></div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-200 dark:border-dark-border">
              <h2 className="font-bold text-lg mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Link href="/admin/posts/new" className="block p-3 bg-gray-50 dark:bg-dark-bg rounded-lg hover:bg-primary-50 transition-colors">+ New Blog Post</Link>
                <Link href="/admin/posts/new" className="block p-3 bg-gray-50 dark:bg-dark-bg rounded-lg hover:bg-primary-50 transition-colors">+ Publish News</Link>
                <Link href="/admin/games" className="block p-3 bg-gray-50 dark:bg-dark-bg rounded-lg hover:bg-primary-50 transition-colors">Manage Games</Link>
              </div>
            </div>
            <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-200 dark:border-dark-border">
              <h2 className="font-bold text-lg mb-4">Site Health</h2>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-sm text-gray-500">API Status</span><span className="text-sm text-green-600 font-medium">● Online</span></div>
                <div className="flex justify-between"><span className="text-sm text-gray-500">Database</span><span className="text-sm text-green-600 font-medium">● Connected</span></div>
                <div className="flex justify-between"><span className="text-sm text-gray-500">Environment</span><span className="text-sm text-gray-400">Development</span></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
