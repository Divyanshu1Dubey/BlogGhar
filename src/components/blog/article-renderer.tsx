'use client';

import { useMemo, useEffect, useState } from 'react';
import { markdownToHtml, extractHeadings } from '@/lib/content-parser';

type TocItem = {
  id: string;
  text: string;
  level: number;
};

type ArticleRendererProps = {
  content: string;
  showToc?: boolean;
  tocItems?: TocItem[];
  isHtml?: boolean;
};

function processSpecialBlocks(html: string): string {
  return html.replace(
    /<p>:::(tip|warning|callout|important|key-takeaway|faq|source)\s*([\s\S]*?)<\/p>:::/g,
    (_, type, content) => {
      const cleaned = content.trim();
      const icons: Record<string, string> = {
        tip: '💡',
        warning: '⚠️',
        callout: '📢',
        important: '❗',
        'key-takeaway': '🔑',
        faq: '❓',
        source: '📚',
      };
      const titles: Record<string, string> = {
        tip: 'Pro Tip',
        warning: 'Warning',
        callout: 'Important',
        important: 'Important',
        'key-takeaway': 'Key Takeaway',
        faq: 'FAQ',
        source: 'Source',
      };
      const classMap: Record<string, string> = {
        tip: 'article-tip',
        warning: 'article-warning',
        callout: 'article-callout',
        important: 'article-callout',
        'key-takeaway': 'article-key-takeaway',
        faq: 'article-faq',
        source: 'article-source',
      };

      return `
        <div class="${classMap[type] || 'article-callout'}">
          <div class="article-callout-title">${icons[type] || '📌'} ${titles[type] || 'Note'}</div>
          <div class="article-callout-content">${cleaned}</div>
        </div>
      `;
    }
  );
}

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

export default function ArticleRenderer({ content, showToc = false, tocItems: externalTocItems, isHtml = false }: ArticleRendererProps) {
  const { html, headings } = useMemo(() => {
    if (!content || !content.trim()) return { html: '', headings: [] as TocItem[] };

    // Convert Markdown → HTML only when the input is raw Markdown
    const raw = isHtml ? content : markdownToHtml(content);
    const converted = processSpecialBlocks(raw);
    const extracted: TocItem[] = extractHeadings(converted);

    return { html: converted, headings: extracted };
  }, [content, isHtml]);

  if (!html) {
    return (
      <div className="article-body">
        <div className="article-prose">
          <p className="text-gray-400 italic">No content available.</p>
        </div>
      </div>
    );
  }

  // Use externally-provided TOC if available, otherwise use extracted headings
  const tocItems = externalTocItems && externalTocItems.length >= 2 ? externalTocItems : headings;

  return (
    <div className="article-body">
      <div className="article-prose">
        {showToc && tocItems.length >= 2 && (
          <nav aria-label="Table of contents">
            {/* Desktop: sticky sidebar TOC */}
            <div className="hidden lg:block mb-8">
              <div className="toc toc-sidebar">
                <div className="toc-title">Table of Contents</div>
                <ul className="toc-list">
                  {tocItems.map((heading) => (
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
              <MobileToc headings={tocItems} />
            </div>
          </nav>
        )}
        <div
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
