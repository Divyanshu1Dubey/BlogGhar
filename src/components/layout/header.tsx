'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Search, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';

const categories = [
  { name: 'Technology', slug: 'technology', icon: '💻', color: 'bg-blue-500' },
  { name: 'Lifestyle', slug: 'lifestyle', icon: '🌟', color: 'bg-pink-500' },
  { name: 'Education', slug: 'education', icon: '📚', color: 'bg-green-500' },
  { name: 'Finance', slug: 'finance', icon: '💰', color: 'bg-yellow-500' },
  { name: 'Entertainment', slug: 'entertainment', icon: '🎬', color: 'bg-purple-500' },
  { name: 'Health', slug: 'health', icon: '🏥', color: 'bg-red-500' },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-dark-bg border-b border-gray-200 dark:border-dark-border">
      {/* Top bar */}
      <div className="bg-primary-600 text-white text-xs py-1.5">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <span>Welcome to Blog-Ghar - Your One-Stop Destination!</span>
          <div className="hidden sm:flex gap-4">
            <Link href="/news" className="hover:underline">📰 Latest News</Link>
            <Link href="/games" className="hover:underline">🎮 Play Games</Link>
            <Link href="/tools" className="hover:underline">🔧 Free Tools</Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-display font-extrabold text-primary-600 group-hover:text-primary-700 transition-colors">
              Blog<span className="text-gray-900 dark:text-white">Ghar</span>
            </span>
            <span className="hidden sm:inline text-xs text-gray-500 dark:text-gray-400 border-l border-gray-300 dark:border-gray-600 pl-2">
              Home of Blogs
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavLink href="/blog">Blog</NavLink>
            <NavLink href="/games">🎮 Games</NavLink>
            <NavLink href="/tools">🔧 Tools</NavLink>
            <NavLink href="/news">📰 News</NavLink>
            <NavLink href="/horoscope">🔮 Horoscope</NavLink>
            <NavLink href="/forum">💬 Forum</NavLink>
            <NavLink href="/qa">❓ Q&A</NavLink>
            <NavLink href="/jobs">💼 Jobs</NavLink>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Search toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
              aria-label="Toggle theme"
            >
              <Sun className="w-5 h-5 hidden dark:block" />
              <Moon className="w-5 h-5 block dark:hidden" />
            </button>

            {/* Auth buttons */}
            <Link href="/login" className="hidden sm:block text-sm font-medium hover:text-primary-600 transition-colors">
              Login
            </Link>
            <Link href="/register" className="hidden sm:block btn-primary text-sm">
              Sign Up
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-card"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="pb-4 animate-in">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blogs, games, tools, news..."
                className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Category pills */}
        <div className="flex gap-2 pb-3 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/blog?category=${cat.slug}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-dark-card hover:bg-primary-100 dark:hover:bg-primary-900/30 text-sm font-medium whitespace-nowrap transition-colors"
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-2">
            <MobileNavLink href="/blog" onClick={() => setMobileOpen(false)}>📝 Blog</MobileNavLink>
            <MobileNavLink href="/games" onClick={() => setMobileOpen(false)}>🎮 Games</MobileNavLink>
            <MobileNavLink href="/tools" onClick={() => setMobileOpen(false)}>🔧 Tools</MobileNavLink>
            <MobileNavLink href="/news" onClick={() => setMobileOpen(false)}>📰 News</MobileNavLink>
            <MobileNavLink href="/horoscope" onClick={() => setMobileOpen(false)}>🔮 Horoscope</MobileNavLink>
            <MobileNavLink href="/forum" onClick={() => setMobileOpen(false)}>💬 Forum</MobileNavLink>
            <MobileNavLink href="/qa" onClick={() => setMobileOpen(false)}>❓ Q&A</MobileNavLink>
            <MobileNavLink href="/jobs" onClick={() => setMobileOpen(false)}>💼 Jobs</MobileNavLink>
            <hr className="border-gray-200 dark:border-dark-border" />
            <MobileNavLink href="/login" onClick={() => setMobileOpen(false)}>🔑 Login</MobileNavLink>
            <MobileNavLink href="/register" onClick={() => setMobileOpen(false)}>✨ Sign Up Free</MobileNavLink>
          </nav>
        </div>
      )}
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-dark-card rounded-lg transition-colors"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-card rounded-lg transition-colors"
    >
      {children}
    </Link>
  );
}
