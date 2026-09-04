/**
 * Blog content importer
 *
 * Scans /content/posts/*.md files, converts each Markdown file into
 * a Post in the database, and exports a ready-to-import JSON to
 * `scripts/blog-import-output.json`.
 *
 * Usage:
 *   1. Place .md files in ./content/posts/
 *   2. Run: npx tsx scripts/import-blog.ts
 *   3. Review the output file
 *   4. Or run: npx tsx scripts/import-blog.ts --apply
 */

import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

const CONTENT_DIR = path.resolve(process.cwd(), 'content/posts');
const OUTPUT_FILE = path.resolve(process.cwd(), 'scripts/blog-import-output.json');

interface FrontMatter {
  title: string;
  slug: string;
  category: string;
  tags?: string;
  excerpt: string;
  author?: string;
  readTime?: number;
  sourceUrl?: string;
  focusKeyword?: string;
}

interface PostInput {
  frontMatter: FrontMatter;
  markdownBody: string;
}

function parseFrontMatter(content: string): { front: FrontMatter; body: string } | null {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;

  try {
    const front = yaml.parse(match[1]) as FrontMatter;
    const body = match[2].trim();
    return { front, body: body };
  } catch {
    return null;
  }
}

function mdToHtml(md: string): string {
  let html = md;

  html = html.replace(/^#{6}\s*(.+)$/gm, '<h6>$1</h6>');
  html = html.replace(/^#{5}\s*(.+)$/gm, '<h5>$1</h5>');
  html = html.replace(/^#{4}\s*(.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^#{3}\s*(.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^#{2}\s*(.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^#{1}\s*(.+)$/gm, '<h1>$1</h1>');

  // Bold & Italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Strikethrough
  html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`);

  // Ordered lists
  html = html.replace(/^\d+\.\s(.+)$/gm, '<li>$1</li>');

  // Blockquotes
  html = html.replace(/^&gt;\s(.+)$/gm, '<blockquote>$1</blockquote>');

  // Code blocks
  html = html.replace(/```[\s\S]*?```/g, (match) => {
    return `<pre><code>${match.slice(3, -3).trim()}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Paragraphs
  const blocks = html.split(/\n\n+/);
  html = blocks.map(block => {
    const trimmed = block.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('<')) return trimmed;
    return `<p>${trimmed}</p>`;
  }).join('\n\n');

  return html;
}

function scanContentDir(): PostInput[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
    return [];
  }

  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
  const posts: PostInput[] = [];

  for (const file of files) {
    const fullPath = path.join(CONTENT_DIR, file);
    const raw = fs.readFileSync(fullPath, 'utf-8');
    const parsed = parseFrontMatter(raw);
    if (parsed && parsed.front.title && parsed.front.slug) {
      posts.push({
        frontMatter: parsed.front,
        markdownBody: parsed.body,
      });
    }
  }

  return posts;
}

function toDbPayload(posts: PostInput[]): any[] {
  return posts.map(p => ({
    title: p.frontMatter.title,
    slug: p.frontMatter.slug,
    excerpt: p.frontMatter.excerpt,
    content: mdToHtml(p.markdownBody),
    readTime: p.frontMatter.readTime || undefined,
    sourceUrl: p.frontMatter.sourceUrl || 'https://bloghar.com',
    focusKeyword: p.frontMatter.focusKeyword || '',
    tags: p.frontMatter.tags || '',
    status: 'PUBLISHED',
    publishedAt: new Date(),
  }));
}

function main() {
  console.log('📂 Scanning content directory:', CONTENT_DIR);

  const posts = scanContentDir();
  console.log(`   Found ${posts.length} markdown files`);

  if (posts.length === 0) {
    console.log('   No posts found. Add .md files with front matter to content/posts/');
    return;
  }

  const dbPayload = toDbPayload(posts);
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(dbPayload, null, 2));
  console.log('   Output:', OUTPUT_FILE);
  console.log('   Summary:');
  for (const p of posts) {
    console.log(`     - [${p.frontMatter.category}] ${p.frontMatter.title} (${p.frontMatter.slug})`);
  }
  console.log('\n   To import into DB, run with --apply (requires DB schema with Post model)');
}

main();
