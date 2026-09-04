'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({ html }: { html: string }) {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const pathname = usePathname();

  useEffect(() => {
    const items: TocItem[] = [];
    const regex = /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/g;
    let match;
    while ((match = regex.exec(html)) !== null) {
      const level = parseInt(match[1]);
      const text = match[3].replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').slice(0, 60);
      if (text.length > 3) items.push({ id, text, level });
    }
    setHeadings(items);
  }, [html]);

  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    );

    headings.forEach(h => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 3) return null;

  return (
    <aside className="hidden xl:block w-64 shrink-0">
      <div className="sticky top-24">
        <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Table of Contents
        </h4>
        <nav className="space-y-1">
          {headings.map((heading) => (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              className={`block text-sm py-1.5 px-3 rounded-lg transition-all border-l-2 ${
                activeId === heading.id
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 font-medium'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              style={{ paddingLeft: heading.level === 3 ? '2rem' : '1rem' }}
            >
              {heading.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
