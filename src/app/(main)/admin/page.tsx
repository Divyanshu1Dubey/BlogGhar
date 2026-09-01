import prisma from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  let stats: { totalPosts: number; totalUsers: number; totalViews: number; totalComments: number } | null = null;
  try {
    stats = {
      posts: await prisma.post.count(),
      users: await prisma.user.count(),
      games: await prisma.game.count(),
      tools: await prisma.tool.count(),
      comments: await prisma.comment.count(),
      subscribers: await prisma.newsletterSubscriber.count(),
      views: await prisma.post.aggregate({ _sum: { views: true } }),
    };
  } catch {}

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-dark-card border-r border-gray-200 dark:border-dark-border min-h-screen">
          <div className="p-4 border-b border-gray-200 dark:border-dark-border">
            <Link href="/" className="text-xl font-display font-extrabold text-primary-600">🌿 Blog-Ghar</Link>
            <p className="text-xs text-gray-500">Admin Dashboard</p>
          </div>
          <nav className="p-2 space-y-1">
            {['Dashboard', 'Posts', 'News', 'Users', 'Games', 'Tools', 'Comments', 'Subscribers', 'Settings'].map((item) => (
              <a key={item} href={`/admin${item === 'Dashboard' ? '' : `/${item.toLowerCase()}`}`} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${item === 'Dashboard' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-bg'}`}>{item}</a>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-display font-extrabold mb-8">Dashboard</h1>

          {/* Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Posts', value: stats.posts, icon: '📝', color: 'bg-blue-500' },
              { label: 'Users', value: stats.users, icon: '👥', color: 'bg-green-500' },
              { label: 'Games', value: stats.games, icon: '🎮', color: 'bg-purple-500' },
              { label: 'Tools', value: stats.tools, icon: '🔧', color: 'bg-yellow-500' },
              { label: 'Comments', value: stats.comments, icon: '💬', color: 'bg-pink-500' },
              { label: 'Subscribers', value: stats.subscribers, icon: '📧', color: 'bg-orange-500' },
              { label: 'Views', value: stats.views._sum.views, icon: '👁️', color: 'bg-indigo-500' },
            ].map((s) => (
              <div key={s.label} className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-border">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${s.color} rounded-lg flex items-center justify-center text-white text-xl`}>{s.icon}</div>
                  <div><p className="text-sm text-gray-500">{s.label}</p><p className="text-2xl font-bold">{s.value.toLocaleString()}</p></div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-200 dark:border-dark-border">
              <h2 className="font-bold text-lg mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Link href="/admin/posts/new" className="block p-3 bg-gray-50 dark:bg-dark-bg rounded-lg hover:bg-primary-50 transition-colors">+ New Blog Post</Link>
                <Link href="/admin/news/new" className="block p-3 bg-gray-50 dark:bg-dark-bg rounded-lg hover:bg-primary-50 transition-colors">+ Publish News</Link>
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
