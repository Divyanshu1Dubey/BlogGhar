'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊', exact: true },
  { href: '/admin/posts', label: 'Posts', icon: '📝' },
  { href: '/admin/posts/new', label: 'New Post', icon: '✍️' },
  { href: '/admin/news', label: 'News', icon: '📰' },
  { href: '/admin/users', label: 'Users', icon: '👥' },
  { href: '/admin/jobs', label: 'Jobs', icon: '💼' },
  { href: '/admin/games', label: 'Games', icon: '🎮' },
  { href: '/admin/tools', label: 'Tools', icon: '🔧' },
  { href: '/admin/comments', label: 'Comments', icon: '💬' },
  { href: '/admin/subscribers', label: 'Subscribers', icon: '📧' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed w-64 bg-white dark:bg-dark-card border-r border-gray-200 dark:border-dark-border min-h-screen z-40">
      <div className="p-4 border-b border-gray-200 dark:border-dark-border">
        <Link href="/" className="text-xl font-display font-extrabold text-primary-600">
          🌿 Blog-Ghar
        </Link>
        <p className="text-xs text-gray-500 mt-0.5">Admin Panel</p>
      </div>
      <nav className="p-3 space-y-0.5">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              isActive(item.href, item.exact)
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 font-medium'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-bg'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-dark-border">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <span>←</span> Back to Site
        </Link>
      </div>
    </aside>
  );
}
