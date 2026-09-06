'use client';

import { useMemo, useEffect, useState } from 'react';

type TocItem = {
  id: string;
  text: string;
  level: number;
};

type ArticleRendererProps = {
  content: string;
  showToc?: boolean;
  tocItems?: TocItem[];
};

function MobileToc({ headings }: { headings: TocItem[] }) {
  const [activeId, setActiveId] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
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

  return (
    <div className="toc">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="toc-mobile-header w-full"
        aria-expanded={isOpen}
      >
        <span className="toc-title mb-0">On this page</span>
        <span className="toc-mobile-toggle">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <ul className="toc-list mt-3">
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
      )}
    </div>
  );
}

/**
 * ArticleRenderer renders pre-converted HTML (from content-parser)
 * into structured, beautifully-styled output.
 *
 * The content-parser already converted Markdown → HTML with semantic
 * tags (<h2>, <p>, <ul>, <blockquote>, <table>, etc.).
 * This component renders that HTML directly with premium typography.
 */
export default function ArticleRenderer({ content, showToc = false, tocItems: externalTocItems }: ArticleRendererProps) {
  const html = useMemo(() => {
    if (!content || !content.trim()) return '';

    let parsed = content;

    // Ensure block-level elements are on their own lines for consistent rendering
    const blockTags = ['h1','h2','h3','h4','h5','h6','p','ul','ol','li','blockquote','pre','table','hr','div'];
    for (const tag of blockTags) {
      const openRe = new RegExp(`(<${tag}[\\s>])`, 'gi');
      parsed = parsed.replace(openRe, '\n$1');
      parsed = parsed.replace(new RegExp(`(<\\/${tag}>)`, 'gi'), '$1\n');
    }

    // Normalize whitespace
    parsed = parsed.replace(/\n{3,}/g, '\n\n').trim();

    // Split into blocks and rejoin
    const blocks = parsed.split(/\n+/).filter((b) => b.trim());

    return blocks.join('\n');
  }, [content]);

  if (!html) {
    return (
      <div className="article-body">
        <div className="article-content">
          <p className="text-gray-400 italic">No content available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="article-body">
      <div className="article-content">
        {showToc && externalTocItems && externalTocItems.length >= 2 && (
          <nav aria-label="Table of contents">
            {/* Desktop: sticky sidebar TOC */}
            <div className="hidden lg:block mb-8">
              <div className="toc toc-sidebar">
                <div className="toc-title">Table of Contents</div>
                <ul className="toc-list">
                  {externalTocItems.map((heading) => (
                    <li key={heading.id} className={`toc-item ${heading.level === 3 ? 'toc-h3' : ''}`}>
                      <a href={`#${heading.id}`} className="toc-link">
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* Mobile: collapsible TOC */}
            <div className="lg:hidden mb-8">
              <MobileToc headings={externalTocItems} />
            </div>
          </nav>
        )}
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
