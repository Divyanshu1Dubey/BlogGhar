import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const metadata: Metadata = {
  title: 'Reports — Blog-Ghar Admin',
  description: 'Content moderation reports',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminReportsPage({ searchParams }: { searchParams?: Promise<{ status?: string }> }) {
  const adminCheck = await requireAdmin();
  if (adminCheck.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-lg font-medium">{adminCheck.error}</div>
      </div>
    );
  }

  const params = await searchParams;
  const status = params?.status?.toUpperCase() || 'OPEN';

  let reports: any[] = [];
  let stats: { open: number; resolved: number; dismissed: number } = { open: 0, resolved: 0, dismissed: 0 };

  try {
    const [reportList, openCount, resolvedCount, dismissedCount] = await Promise.all([
      prisma.report.findMany({
        where: status !== 'ALL' ? { status } : undefined,
        orderBy: { createdAt: 'desc' },
        take: 100,
        include: {
          reporter: { select: { id: true, name: true, email: true } },
          moderator: { select: { id: true, name: true } },
        },
      }),
      prisma.report.count({ where: { status: 'OPEN' } }),
      prisma.report.count({ where: { status: 'RESOLVED' } }),
      prisma.report.count({ where: { status: 'DISMISSED' } }),
    ]);
    reports = reportList;
    stats = { open: openCount, resolved: resolvedCount, dismissed: dismissedCount };
  } catch {
    // ignore
  }

  const tabs = [
    { key: 'OPEN', label: 'Open', count: stats.open },
    { key: 'RESOLVED', label: 'Resolved', count: stats.resolved },
    { key: 'DISMISSED', label: 'Dismissed', count: stats.dismissed },
  ];

  const reasonLabels: Record<string, string> = {
    SPAM: 'Spam', ABUSE: 'Abuse', MISINFORMATION: 'Misinformation', OTHER: 'Other',
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <AdminSidebar current="Reports" />
      <main className="ml-64 p-8">
        <h1 className="text-3xl font-extrabold mb-2">Reports</h1>
        <p className="text-gray-500 mb-6">Review and manage community content reports.</p>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {tabs.map(tab => (
            <a key={tab.key} href={`?status=${tab.key.toLowerCase()}`} className={`bg-white dark:bg-dark-card rounded-xl p-4 border-2 transition-colors ${status === tab.key ? 'border-primary-500' : 'border-transparent hover:border-gray-200'}`}>
              <p className="text-2xl font-bold">{tab.count}</p>
              <p className="text-sm text-gray-500">{tab.label}</p>
            </a>
          ))}
        </div>

        {/* Reports list */}
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border divide-y divide-gray-100 dark:divide-dark-border">
          {reports.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No {status.toLowerCase()} reports.</div>
          ) : reports.map(r => (
            <div key={r.id} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">{reasonLabels[r.reason] || r.reason}</span>
                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">{r.targetType}</span>
                    <span className="text-xs text-gray-400">#{r.targetId.slice(0, 8)}</span>
                    {r.status === 'OPEN' && <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">Open</span>}
                    {r.status === 'RESOLVED' && <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Resolved</span>}
                    {r.status === 'DISMISSED' && <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">Dismissed</span>}
                  </div>
                  {r.details && <p className="text-sm text-gray-600 mt-1">{r.details}</p>}
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span>by {r.reporter?.name || r.reporter?.email || 'Unknown'}</span>
                    <span>·</span>
                    <span>{new Date(r.createdAt).toLocaleString()}</span>
                    {r.moderator && <><span>·</span><span>Mod: {r.moderator.name}</span></>}
                    {r.moderatorNote && <><span>·</span><span className="italic">"{r.moderatorNote}"</span></>}
                  </div>
                </div>
                {status === 'OPEN' && (
                  <div className="flex gap-2">
                    <form action={`/api/reports/${r.id}`} method="post">
                      <input type="hidden" name="action" value="resolve" />
                      <button type="submit" className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700">Resolve</button>
                    </form>
                    <form action={`/api/reports/${r.id}`} method="post">
                      <input type="hidden" name="action" value="dismiss" />
                      <button type="submit" className="px-3 py-1.5 bg-gray-600 text-white rounded-lg text-xs font-medium hover:bg-gray-700">Dismiss</button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function AdminSidebar({ current }: { current: string }) {
  const items: { name: string; href: string }[] = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Posts', href: '/admin/posts' },
    { name: 'Reports', href: '/admin/reports' },
    { name: 'Community', href: '/community' },
    { name: 'Users', href: '/admin/users' },
    { name: 'Comments', href: '/admin/comments' },
    { name: 'Subscribers', href: '/admin/subscribers' },
    { name: 'Settings', href: '/admin/settings' },
  ];

  return (
    <aside className="fixed w-64 bg-white dark:bg-dark-card border-r border-gray-200 dark:border-dark-border min-h-screen">
      <div className="p-4 border-b">
        <a href="/admin" className="text-xl font-display font-extrabold text-primary-600">🌿 Blog-Ghar</a>
        <p className="text-xs text-gray-500">Admin</p>
      </div>
      <nav className="p-2 space-y-1">
        {items.map(item => (
          <a key={item.name} href={item.href} className={`block px-3 py-2 rounded-lg text-sm ${current === item.name ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50'}`}>{item.name}</a>
        ))}
      </nav>
    </aside>
  );
}
