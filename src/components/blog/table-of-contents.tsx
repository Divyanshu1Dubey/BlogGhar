'use client';

import { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: TocItem[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  // Mobile collapsible TOC
  const MobileToc = () => (
    <div className="lg:hidden mb-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="toc-mobile-header w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300"
        aria-expanded={isOpen}
      >
        <span>Table of Contents</span>
        <span className="toc-mobile-toggle" aria-hidden="true">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <nav className="toc mt-2" aria-label="Table of contents">
          <ul className="toc-list">
            {headings.map((heading) => (
              <li key={heading.id} className={`toc-item ${heading.level === 3 ? 'toc-h3' : ''}`}>
                <a
                  href={`#${heading.id}`}
                  className={`toc-link ${activeId === heading.id ? 'toc-active' : ''}`}
                  onClick={() => setIsOpen(false)}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );

  // Desktop sidebar TOC
  const DesktopToc = () => (
    <aside className="hidden lg:block w-56 shrink-0" aria-label="Table of contents">
      <div className="toc toc-sidebar">
        <div className="toc-title">Table of Contents</div>
        <ul className="toc-list">
          {headings.map((heading) => (
            <li key={heading.id} className={`toc-item ${heading.level === 3 ? 'toc-h3' : ''}`}>
              <a
                href={`#${heading.id}`}
                className={`toc-link ${activeId === heading.id ? 'toc-active' : ''}`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );

  if (headings.length < 2) return null;

  return (
    <>
      <MobileToc />
      <DesktopToc />
    </>
  );
}
