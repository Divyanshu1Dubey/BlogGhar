'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ArticleRendererProps {
  content: string;
}

type Block = { type: string; data: Record<string, any> };

function parseContent(html: string): Block[] {
  const blocks: Block[] = [];
  const parts = html.split(/(<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>|<table[\s\S]*?<\/table>|<pre[\s\S]*?<\/pre>|<blockquote[\s\S]*?<\/blockquote>|<ul[\s\S]*?<\/ul>|<ol[\s\S]*?<\/ol>|<img[^>]*>|<p[^>]*>[\s\S]*?<\/p>|<div[^>]*>[\s\S]*?<\/div>|<hr[^/]*>)/gi);
  for (const part of parts) {
    if (!part.trim()) continue;
    if (/^<h[1-6]/.test(part)) {
      const level = part.match(/^<h([1-6])/)?.[1] || '2';
      blocks.push({ type: 'heading', data: { level: parseInt(level), text: stripTags(part) } });
    } else if (/^<table/.test(part)) {
      blocks.push({ type: 'table', data: { html: part } });
    } else if (/^<pre/.test(part)) {
      const langMatch = part.match(/language-(\w+)/);
      const code = part.replace(/<pre[^>]*>/, '').replace(/<\/pre>$/, '').replace(/<code[^>]*>/, '').replace(/<\/code>$/, '');
      blocks.push({ type: 'code', data: { language: langMatch?.[1] || 'text', code } });
    } else if (/^<blockquote/.test(part)) {
      blocks.push({ type: 'quote', data: { text: stripTags(part) } });
    } else if (/^<(ul|ol)/.test(part)) {
      const items = part.match(/<li[^>]*>[\s\S]*?<\/li>/gi) || [];
      blocks.push({ type: 'list', data: { ordered: part.startsWith('<ol'), items: items.map(i => stripTags(i)) } });
    } else if (/^<img/.test(part)) {
      const src = part.match(/src="([^"]+)"/)?.[1] || '';
      const alt = part.match(/alt="([^"]*)"/)?.[1] || '';
      blocks.push({ type: 'image', data: { src, alt, caption: alt } });
    } else if (/^<hr/.test(part)) {
      blocks.push({ type: 'hr', data: {} });
    } else if (/^<div/.test(part)) {
      if (part.includes('article-')) {
        blocks.push({ type: 'callout', data: { html: part } });
      } else if (part.includes('article-faq')) {
        blocks.push({ type: 'faq', data: { html: part } });
      } else {
        blocks.push({ type: 'text', data: { html: part } });
      }
    } else if (/^<p/.test(part)) {
      blocks.push({ type: 'paragraph', data: { html: part } });
    } else {
      const text = stripTags(part);
      if (text.trim()) blocks.push({ type: 'text', data: { html: part } });
    }
  }
  return blocks;
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').trim();
}

const headingClasses = ['text-3xl', 'text-2xl', 'text-xl', 'text-lg', 'text-base', 'text-sm'];

export function ArticleRenderer({ content }: ArticleRendererProps) {
  const blocks = useMemo(() => parseContent(content), [content]);

  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      {blocks.map((block, i) => (
        <BlockRenderer key={i} block={block} />
      ))}
    </div>
  );
}

function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case 'heading':
      const Tag = `h${block.data.level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      return <Tag className={headingClasses[block.data.level - 1] || 'text-xl'}>{block.data.text}</Tag>;
    case 'paragraph':
      return <p className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: block.data.html }} />;
    case 'quote':
      return <blockquote className="border-l-4 border-primary-500 pl-4 italic text-gray-600 dark:text-gray-300">{block.data.text}</blockquote>;
    case 'code': {
      const isInline = block.data.code.length < 100 && !block.data.code.includes('\n');
      if (isInline) return <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">{block.data.code}</code>;
      return (
        <SyntaxHighlighter language={block.data.language} style={oneLight} PreTag="div" customStyle={{ borderRadius: '0.75rem', margin: '1rem 0' }}>
          {block.data.code}
        </SyntaxHighlighter>
      );
    }
    case 'list':
      if (block.data.ordered) {
        return <ol className="list-decimal list-inside space-y-1"><li>{block.data.items.map((item: string, j: number) => <span key={j} dangerouslySetInnerHTML={{ __html: item }} />)}</li></ol>;
      }
      return <ul className="list-disc list-inside space-y-1"><li>{block.data.items.map((item: string, j: number) => <span key={j} dangerouslySetInnerHTML={{ __html: item }} />)}</li></ul>;
    case 'image':
      return (
        <figure className="my-6">
          <div className="relative w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800" style={{ aspectRatio: '16/9', maxHeight: '600px' }}>
            <Image src={block.data.src} alt={block.data.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 800px" />
          </div>
          {block.data.caption && <figcaption className="text-center text-sm text-gray-500 mt-2">{block.data.caption}</figcaption>}
        </figure>
      );
    case 'table':
      return (
        <div className="overflow-x-auto my-6">
          <div className="inline-block min-w-full border border-gray-200 dark:border-dark-border rounded-xl overflow-hidden">
            <table className="min-w-full" dangerouslySetInnerHTML={{ __html: block.data.html }} />
          </div>
        </div>
      );
    case 'callout':
    case 'faq':
      return <div dangerouslySetInnerHTML={{ __html: block.data.html }} />;
    case 'hr':
      return <hr className="my-8 border-gray-200 dark:border-dark-border" />;
    default:
      return null;
  }
}
