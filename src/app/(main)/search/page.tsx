'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

type ResultItem = {
  type: string;
  title: string;
  description: string;
  url: string;
  slug: string;
};

export default function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = use(searchParams);
  const query = params.q || '';
  const [results, setResults] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(query)}&type=all`)
      .then((r) => r.json())
      .then((data) => { setResults(data.results || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [query]);

  const typeIcon: Record<string, string> = { post: '📝', game: '🎮', news: '📰' };
  const typeLabel: Record<string, string> = { post: 'Blog Post', game: 'Game', news: 'News' };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-display font-extrabold mb-2">Search Results</h1>
      {query && (
        <p className="text-gray-500 mb-6">
          {loading ? 'Searching...' : results.length > 0
            ? `Found ${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`
            : `No results found for "${query}"`}
        </p>
      )}

      {!query && (
        <div className="text-center py-16">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Enter a search term to find blogs, games, news, and more.</p>
        </div>
      )}

      <div className="space-y-4">
        {results.map((item, i) => (
          <Link
            key={i}
            href={item.url}
            className="card p-5 flex gap-4 group hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
          >
            <div className="text-3xl">{typeIcon[item.type] || '📄'}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-gray-100 dark:bg-dark-bg rounded text-xs font-medium">{typeLabel[item.type] || item.type}</span>
              </div>
              <h3 className="font-display font-bold text-lg group-hover:text-primary-600 transition-colors line-clamp-1">{item.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 mt-1">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>

      {query && !loading && results.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Try different keywords or browse our categories.</p>
          <Link href="/blog" className="btn-primary inline-block">Browse Blogs</Link>
        </div>
      )}
    </div>
  );
}
