import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminGamesPage() {
  let games: any[] = [];
  try { games = await prisma.game.findMany({ orderBy: { createdAt: 'desc' } }); }
  catch {}

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <AdminSidebar />
      <main className="ml-64 p-8">
        <h1 className="text-3xl font-extrabold mb-6">Games</h1>
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 dark:bg-dark-bg"><th className="text-left p-3">Icon</th><th className="text-left p-3">Name</th><th className="text-left p-3">Category</th><th className="text-left p-3">Active</th><th className="text-left p-3">Actions</th></tr></thead>
            <tbody>{games.map((g: any) => (
              <tr key={g.id} className="border-t border-gray-100 dark:border-dark-border">
                <td className="p-3 text-2xl">{g.icon}</td><td className="p-3">{g.name}</td><td className="p-3">{g.category}</td><td className="p-3">{g.isActive ? 'Yes' : 'No'}</td>
                <td className="p-3"><a href={`/games/${g.slug}`} className="text-primary-600 text-xs">View</a></td>
              </tr>
            ))}</tbody>
          </table>
          {games.length === 0 && <p className="p-8 text-center text-gray-500">No games yet</p>}
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
        <a key={item} href={`/admin${item === 'Dashboard' ? '' : '/' + item.toLowerCase()}`} className={`block px-3 py-2 rounded-lg text-sm ${item === 'Games' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50'}`}>{item}</a>
      ))}</nav>
    </aside>
  );
}