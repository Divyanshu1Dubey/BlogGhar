'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Search, X, Loader2 } from 'lucide-react';

type ResultItem = {
  type: string;
  title: string;
  description: string;
  url: string;
  slug: string;
};

type Props = {
  initialQuery?: string;
};

const TYPE_ICONS: Record<string, string> = { post: '📝', game: '🎮', news: '📰', community: '💬', user: '👤' };
const TYPE_LABELS: Record<string, string> = { post: 'Blog Post', game: 'Game', news: 'News', community: 'Community', user: 'Author' };

export default function SearchPageClient({ initialQuery }: Props) {
  const [query, setQuery] = useState(initialQuery || '');
  const [results, setResults] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (initialQuery && inputRef.current) {
      inputRef.current.focus();
    }
  }, [initialQuery]);

  const doSearch = useCallback(async (q: string) => {
    if (!q || q.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}&type=all`);
      if (!res.ok) throw new Error(`Search failed (${res.status})`);
      const data = await res.json();
      setResults(data.results || []);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(query), 300);
    return () => clearTimeout(debounceRef.current);
  }, [query, doSearch]);

  useEffect(() => {
    if (initialQuery && initialQuery.length >= 2) {
      doSearch(initialQuery);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const clear = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-dark-bg">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Search Input */}
        <div className="mb-8">
          <h1 className="text-2xl font-display font-extrabold mb-4 text-gray-900 dark:text-white">Search</h1>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search blogs, games, news, tools, people..."
              className="w-full pl-12 pr-10 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-card text-gray-900 dark:text-white text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
              autoFocus={!initialQuery}
            />
            {query && (
              <button
                onClick={clear}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center gap-2 py-12 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Searching...</span>
          </div>
        )}

        {/* Initial / Empty */}
        {!initialQuery && !loading && results.length === 0 && !error && (
          <div className="text-center py-16">
            <Search className="w-14 h-14 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">Start typing to search across Blog-Ghar</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Find blogs, games, news, tools, and community posts</p>
          </div>
        )}

        {/* No results */}
        {query && !loading && !error && results.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No results for &ldquo;{query}&rdquo;</p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link href="/blog" className="btn-primary">Browse Blogs</Link>
              <Link href="/tools" className="btn-secondary">Explore Tools</Link>
              <Link href="/games" className="btn-secondary">Play Games</Link>
            </div>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-3">
            {results.map((item, i) => (
              <Link
                key={`${item.type}-${item.slug}-${i}`}
                href={item.url}
                className="card p-5 flex gap-4 group hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all"
              >
                <div className="text-2xl shrink-0 mt-0.5">{TYPE_ICONS[item.type] || '📄'}</div>
                <div className="flex-1 min-w-0">
                  <span className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5">
                    {TYPE_LABELS[item.type] || item.type}
                  </span>
                  <h3 className="font-display font-bold text-base group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">{item.title}</h3>
                  {item.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1 leading-relaxed">{item.description}</p>
                  )}
                </div>
                <div className="shrink-0 text-gray-300 dark:text-gray-600 self-center">
                  &rarr;
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
