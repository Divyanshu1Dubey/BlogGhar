'use client';

import Link from 'next/link';
import { Newspaper, ExternalLink } from 'lucide-react';

interface BreakingNewsItem {
  title: string;
  slug: string;
  publishedAt: string;
}

interface BreakingNewsProps {
  item?: BreakingNewsItem;
  onClose?: () => void;
}

export function BreakingNews({ item, onClose }: BreakingNewsProps) {
  if (!item) return null;

  return (
    <div className="relative bg-gradient-to-r from-red-600 to-red-500 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-3">
        {/* Pulsing indicator */}
        <span className="relative flex h-3 w-3 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-300 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
        </span>

        {/* Label */}
        <span className="shrink-0 flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded">
          <Newspaper className="w-3.5 h-3.5" />
          Breaking
        </span>

        {/* Headline */}
        <Link
          href={`/news/${item.slug}`}
          className="flex-1 text-sm font-medium truncate hover:underline underline-offset-2 min-w-0"
        >
          {item.title}
        </Link>

        {/* Timestamp */}
        <span className="hidden sm:block text-xs text-red-100 shrink-0">
          {new Date(item.publishedAt).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>

        {/* Link icon */}
        <Link
          href={`/news/${item.slug}`}
          className="hidden sm:flex items-center gap-1 text-xs text-red-100 hover:text-white shrink-0"
        >
          Read <ExternalLink className="w-3 h-3" />
        </Link>

        {/* Close */}
        {onClose && (
          <button
            onClick={onClose}
            className="shrink-0 p-1 hover:bg-white/10 rounded transition-colors"
            aria-label="Dismiss breaking news"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
