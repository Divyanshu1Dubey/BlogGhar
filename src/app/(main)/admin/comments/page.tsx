import type { Metadata } from 'next';
import prisma from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Admin',
  description: 'Admin dashboard',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminCommentsPage() {
  let comments: any[] = [];
  let error: string | null = null;
  try { comments = await prisma.comment.findMany({ orderBy: { createdAt: 'desc' }, take: 50, include: { user: { select: { name: true } }, post: { select: { title: true } } } }); }
  catch (err) { console.error('Admin comments load failed', err); error = 'Unable to load comments.'; }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <AdminSidebar />
      <main className="ml-64 p-8">
        <h1 className="text-3xl font-extrabold mb-6">Comments</h1>
        {error && <div className="mb-4 rounded-lg bg-red-100 p-4 text-sm text-red-700">{error}</div>}
        <div className="card divide-y divide-gray-100 dark:divide-dark-border">
          {comments.length > 0 ? comments.map((c: any) => (
            <div key={c.id} className="p-4 flex items-start gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center font-medium">{c.user?.name?.charAt(0)}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between"><p className="font-medium">{c.user?.name}</p><span className="text-xs text-gray-400">{c.createdAt.toLocaleDateString()}</span></div>
                <p className="text-sm text-gray-600 mt-1">{c.content}</p>
              </div>
              <form action={`/api/admin/comments?id=${c.id}`} method="post"><button type="submit" className="text-xs text-red-500">Delete</button></form>
            </div>
          )) : <p className="p-8 text-center text-gray-500">No comments yet</p>}
        </div>
      </main>
    </div>
  );
}

function AdminSidebar() {
  const items = ['Dashboard', 'Posts', 'News', 'Users', 'Games', 'Tools', 'Comments', 'Subscribers', 'Settings'];
  return (
    <aside className="fixed w-64 bg-white dark:bg-dark-card border-r border-gray-200 dark:border-dark-border min-h-screen">
      <div className="p-4 border-b"><a href="/admin" className="text-xl font-display font-extrabold text-primary-600">🌿 Blog-Ghar</a><p className="text-xs text-gray-500">Admin</p></div>
      <nav className="p-2 space-y-1">{items.map(item => (
        <a key={item} href={`/admin${item === 'Dashboard' ? '' : '/' + item.toLowerCase()}`} className={`block px-3 py-2 rounded-lg text-sm ${item === 'Comments' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50'}`}>{item}</a>
      ))}</nav>
    </aside>
  );
}