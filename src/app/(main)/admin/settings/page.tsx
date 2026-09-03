import type { Metadata } from 'next';
import SettingsForm from './settings-form';

export const metadata: Metadata = {
  title: 'Admin',
  description: 'Admin dashboard',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function AdminSettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <AdminSidebar />
      <main className="ml-64 p-8">
        <h1 className="text-3xl font-extrabold mb-8">⚙️ Settings</h1>

        <SettingsForm />
        {/* Legacy static controls are intentionally replaced by the persisted settings form. */}
        <div className="hidden">
          <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-200 dark:border-dark-border">
            <h2 className="font-bold text-lg mb-4">General Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Site Name</label>
                <input type="text" defaultValue="Blog-Ghar" className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg dark:bg-dark-bg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Site Description</label>
                <textarea defaultValue="Your one-stop destination for blogs, games, news, tools & more." className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg dark:bg-dark-bg text-sm h-20 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Admin Email</label>
                <input type="email" defaultValue="admin@bloghar.com" className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg dark:bg-dark-bg text-sm" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-200 dark:border-dark-border">
            <h2 className="font-bold text-lg mb-4">SEO Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Meta Title</label>
                <input type="text" defaultValue="Blog-Ghar - Home of Blogs" className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg dark:bg-dark-bg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Meta Description</label>
                <textarea defaultValue="Blog-Ghar is your one-stop destination..." className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg dark:bg-dark-bg text-sm h-20 resize-none" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-200 dark:border-dark-border">
            <h2 className="font-bold text-lg mb-4">AdSense</h2>
            <div>
              <label className="block text-sm font-medium mb-1">AdSense Publisher ID</label>
              <input type="text" placeholder="ca-pub-xxxxxxxxxxxxxxxx" className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg dark:bg-dark-bg text-sm" />
              <p className="text-xs text-gray-500 mt-1">Enter your AdSense publisher ID to display ads</p>
            </div>
          </div>
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
        <a key={item} href={`/admin${item === 'Dashboard' ? '' : '/' + item.toLowerCase()}`} className={`block px-3 py-2 rounded-lg text-sm ${item === 'Settings' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50'}`}>{item}</a>
      ))}</nav>
    </aside>
  );
}
