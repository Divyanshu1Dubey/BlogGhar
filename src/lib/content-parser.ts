// Content Parser - Converts raw Markdown text into structured blog post data
// Handles: headings, bold, italic, links, lists, blockquotes, code, tables, images, horizontal rules

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  TECHNOLOGY: ['code', 'software', 'app', 'tech', 'digital', 'AI', 'computer', 'web', 'data', 'cloud', 'programming', 'developer', 'API', 'software', 'machine learning', 'blockchain', 'cyber', 'javascript', 'python', 'react', 'node'],
  LIFESTYLE: ['health', 'fitness', 'diet', 'travel', 'food', 'fashion', 'wellness', 'mindfulness', 'yoga', 'meditation', 'self-care', 'routine', 'habits', 'morning', 'balance'],
  EDUCATION: ['learn', 'study', 'course', 'exam', 'school', 'college', 'university', 'student', 'tutorial', 'guide', 'tips', 'career', 'skill', 'education', 'learning', 'training', 'certification'],
  FINANCE: ['money', 'invest', 'stock', 'market', 'save', 'tax', 'budget', 'crypto', 'bitcoin', 'portfolio', 'income', 'wealth', 'trading', 'banking', 'loan', 'insurance', 'financial'],
  ENTERTAINMENT: ['movie', 'music', 'game', 'celebrity', 'fun', 'film', 'series', 'streaming', 'review', 'actor', 'director', 'album', 'entertainment', 'show', 'netflix'],
  HEALTH: ['medical', 'doctor', 'disease', 'treatment', 'symptom', 'mental health', 'therapy', 'medicine', 'hospital', 'fitness', 'nutrition', 'health', 'wellness', 'diet', 'exercise'],
  TRAVEL: ['destination', 'flight', 'hotel', 'vacation', 'trip', 'tourist', 'backpacking', 'resort', 'airport', 'passport', 'travel', 'tourism', 'journey', 'adventure'],
  FOOD: ['recipe', 'cook', 'kitchen', 'restaurant', 'cuisine', 'ingredient', 'baking', 'meal', 'chef', 'delicious', 'food', 'cooking', 'taste', 'flavor'],
  SPORTS: ['match', 'player', 'team', 'score', 'championship', 'league', 'tournament', 'coach', 'athlete', 'fitness', 'sport', 'cricket', 'football', 'game'],
  SCIENCE: ['research', 'discovery', 'experiment', 'space', 'nasa', 'quantum', 'physics', 'biology', 'chemistry', 'study', 'science', 'scientific', 'theory', 'hypothesis'],
};

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'shall', 'can', 'need', 'dare', 'ought',
  'used', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from',
  'as', 'into', 'through', 'during', 'before', 'after', 'above', 'below',
  'between', 'out', 'off', 'over', 'under', 'again', 'further', 'then',
  'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'both',
  'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor',
  'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just',
  'because', 'but', 'and', 'or', 'if', 'while', 'about', 'up', 'that',
  'this', 'these', 'those', 'it', 'its', 'he', 'she', 'they', 'them',
  'his', 'her', 'their', 'what', 'which', 'who', 'whom', 'also',
  'however', 'therefore', 'thus', 'hence', 'although', 'though',
  'even', 'much', 'many', 'well', 'like', 'get', 'got', 'make',
  'made', 'take', 'took', 'come', 'came', 'go', 'went', 'know',
  'knew', 'think', 'thought', 'see', 'saw', 'want', 'say', 'said',
  'tell', 'told', 'ask', 'asked', 'look', 'looked', 'give', 'gave',
  'find', 'found', 'tell', 'use', 'using', 'new', 'one', 'two',
]);

export interface ParsedContent {
  title: string;
  slug: string;
  excerpt: string;
  content: string; // HTML
  suggestedCategory: string;
  tags: string[];
  readTime: number;
  wordCount: number;
}

export async function readFiles(files: File[]): Promise<string[]> {
  return Promise.all(files.map(file => file.text()));
}

// ── URL safety ──────────────────────────────────────────────────────
const ALLOWED_PROTOCOLS = /^(?:https?:|mailto:|tel:|\/|\.\/|#)/i;

function sanitizeUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (/^(?:javascript|data|vbscript):/i.test(trimmed)) return null;
  if (ALLOWED_PROTOCOLS.test(trimmed) || trimmed.startsWith('./') || trimmed.startsWith('../')) {
    return trimmed.replace(/"/g, '&quot;');
  }
  return null;
}

// ── HTML escape ────────────────────────────────────────────────────
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// ── Inline formatting ──────────────────────────────────────────────
function inlineFormat(text: string): string {
  let result = text;

  // Images: ![alt](url)
  result = result.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match: string, alt: string, url: string) => {
    const safeUrl = sanitizeUrl(url);
    if (!safeUrl) return escapeHtml(alt || '');
    const safeAlt = escapeHtml(alt);
    return `<img src="${safeUrl}" alt="${safeAlt}" loading="lazy" />`;
  });

  // Links: [text](url)
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match: string, label: string, url: string) => {
    const safeUrl = sanitizeUrl(url);
    if (!safeUrl) return escapeHtml(label);
    return `<a href="${safeUrl}">${label}</a>`;
  });

  // Bold+Italic: ***text***
  result = result.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');

  // Bold: **text**
  result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Italic: *text*
  result = result.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');

  // Inline code: `code`
  result = result.replace(/`([^`]+)`/g, '<code>$1</code>');

  return result;
}

// ── Parse a single line of a pipe-delimited table ──────────────────
function parseTableRow(line: string): string[] {
  const trimmed = line.trim();
  const inner = trimmed.startsWith('|') && trimmed.endsWith('|')
    ? trimmed.slice(1, -1)
    : trimmed;
  return inner.split('|').map((c) => c.trim());
}

// ── Unordered list: returns [html, nextIndex] ──────────────────────
function parseUnorderedList(lines: string[], startIdx: number): { html: string; nextIdx: number } {
  const items: string[] = [];
  let i = startIdx;
  while (i < lines.length && lines[i].match(/^[-*+]\s+/)) {
    items.push(`  <li>${inlineFormat(lines[i].replace(/^[-*+]\s+/, ''))}</li>`);
    i++;
  }
  return { html: `<ul>\n${items.join('\n')}\n</ul>`, nextIdx: i };
}

// ── Ordered list: returns [html, nextIndex] ────────────────────────
function parseOrderedList(lines: string[], startIdx: number): { html: string; nextIdx: number } {
  const items: string[] = [];
  let i = startIdx;
  while (i < lines.length && lines[i].match(/^\d+\.\s+/)) {
    items.push(`  <li>${inlineFormat(lines[i].replace(/^\d+\.\s+/, ''))}</li>`);
    i++;
  }
  return { html: `<ol>\n${items.join('\n')}\n</ol>`, nextIdx: i };
}

// ── Table: returns [html, nextIndex] ──────────────────────────────
function parseTable(lines: string[], startIdx: number): { html: string; nextIdx: number } {
  const headerLine = lines[startIdx];
  const headers = parseTableRow(headerLine);
  const separatorLine = lines[startIdx + 1];
  const separators = parseTableRow(separatorLine);

  const rows: string[][] = [];
  let idx = startIdx + 2;
  while (idx < lines.length && lines[idx].includes('|')) {
    rows.push(parseTableRow(lines[idx]));
    idx++;
  }

  const alignAttr = (sep: string) => {
    if (sep.startsWith(':') && sep.endsWith(':')) return ' align="center"';
    if (sep.endsWith(':')) return ' align="right"';
    return '';
  };

  let html = '<div class="table-wrapper"><table>\n<thead>\n<tr>\n';
  for (let c = 0; c < headers.length; c++) {
    html += `  <th${alignAttr(separators[c] || '')}>${inlineFormat(headers[c])}</th>\n`;
  }
  html += '</tr>\n</thead>\n<tbody>\n';

  for (const row of rows) {
    html += '<tr>\n';
    for (let c = 0; c < Math.max(headers.length, row.length); c++) {
      html += `  <td>${inlineFormat(row[c] || '')}</td>\n`;
    }
    html += '</tr>\n';
  }

  html += '</tbody>\n</table></div>';
  return { html, nextIdx: idx };
}

// ── Main Markdown → HTML converter ────────────────────────────────
export function markdownToHtml(md: string): string {
  const lines = md.split('\n');
  const blocks: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Empty line — skip
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Fenced code block
    if (line.match(/^```/)) {
      const lang = line.replace(/^```/, '').trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].match(/^```/)) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++;
      const escapedCode = escapeHtml(codeLines.join('\n'));
      blocks.push(`<pre><code${lang ? ` class="language-${escapeHtml(lang)}"` : ''}>${escapedCode}</code></pre>`);
      continue;
    }

    // Horizontal rule
    if (line.match(/^(-{3,}|\*{3,}|_{3,})\s*$/)) {
      blocks.push('<hr />');
      i++;
      continue;
    }

    // Headings (h1-h6)
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const id = text
        .toLowerCase()
        .replace(/[^\wऀ-ॿ\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      const lvl = Math.min(level, 6);
      blocks.push(`<h${lvl} id="${id}">${inlineFormat(text)}</h${lvl}>`);
      i++;
      continue;
    }

    // Blockquote
    if (line.match(/^>\s?/)) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].match(/^>\s?/)) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      blocks.push(`<blockquote><p>${inlineFormat(quoteLines.join(' '))}</p></blockquote>`);
      continue;
    }

    // Unordered list
    if (line.match(/^[-*+]\s+/)) {
      const { html: ulHtml, nextIdx } = parseUnorderedList(lines, i);
      blocks.push(ulHtml);
      i = nextIdx;
      continue;
    }

    // Ordered list
    if (line.match(/^\d+\.\s+/)) {
      const { html: olHtml, nextIdx } = parseOrderedList(lines, i);
      blocks.push(olHtml);
      i = nextIdx;
      continue;
    }

    // Table (GFM)
    if (line.includes('|') && i + 1 < lines.length && lines[i + 1].match(/^\|[\s\-:|]+\|$/)) {
      const { html: tableHtml, nextIdx } = parseTable(lines, i);
      blocks.push(tableHtml);
      i = nextIdx;
      continue;
    }

    // Paragraph — collect consecutive non-empty, non-block lines
    const paraLines: string[] = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].match(/^(#{1,6}\s|[-*+]\s|\d+\.\s|>\s?|```|(-{3,}|\*{3,}|_{3,})\s*$)/) &&
      !(lines[i].includes('|') && i + 1 < lines.length && lines[i + 1].match(/^\|[\s\-:|]+\|$/))
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    const text = paraLines.join(' ').trim();
    if (text) {
      blocks.push(`<p>${inlineFormat(text)}</p>`);
    }
  }

  return blocks.join('\n');
}

// ── Public entry point ─────────────────────────────────────────────
export function parseContent(rawText: string): ParsedContent {
  const text = rawText.trim();
  if (!text) {
    return {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      suggestedCategory: 'TECHNOLOGY',
      tags: [],
      readTime: 1,
      wordCount: 0,
    };
  }

  const lines = text.split('\n').filter(l => l.trim());
  let title = '';
  let contentStart = 0;

  // Title from first markdown heading
  const firstLine = lines[0] ? lines[0].trim() : '';
  if (firstLine.startsWith('# ')) {
    title = firstLine.replace(/^#+\s*/, '').trim();
    contentStart = 1;
  } else if (firstLine.length < 120 && !firstLine.match(/[.!?]\s/)) {
    title = firstLine.replace(/^[#*_\s]+/, '').trim();
    contentStart = 1;
  } else {
    const firstSentenceMatch = text.match(/^(.+?[.!?])\s/);
    if (firstSentenceMatch && firstSentenceMatch[1].length < 120) {
      title = firstSentenceMatch[1].trim().replace(/^[#*_\s]+/, '');
    } else {
      title = firstLine.substring(0, 80).replace(/^[#*_\s]+/, '').trim();
    }
  }

  const slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 60);

  // HTML content from remaining lines
  const contentLines = lines.slice(contentStart);
  const rawBody = contentLines.join('\n');
  const htmlContent = markdownToHtml(rawBody);

  // Excerpt from first sentences
  const plainText = rawBody.replace(/[#*_`>]/g, '').replace(/\n+/g, ' ').trim();
  const sentences = plainText.match(/[^.!?]+[.!?]+/g) || [plainText];
  const excerpt = sentences.slice(0, 3).join(' ').substring(0, 300).trim();

  const suggestedCategory = detectCategory(text);
  const tags = extractTags(text);
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return {
    title,
    slug,
    excerpt,
    content: htmlContent,
    suggestedCategory,
    tags,
    readTime,
    wordCount,
  };
}

// ── Heading extraction (for TOC) ───────────────────────────────────
export function extractHeadings(html: string): { id: string; text: string; level: number }[] {
  const items: { id: string; text: string; level: number }[] = [];
  const headingRegex = /<h([1-6])(?:\s[^>]*)?id="([^"]*)"[^>]*>([\s\S]*?)<\/h\1>/g;
  let m: RegExpExecArray | null;
  while ((m = headingRegex.exec(html)) !== null) {
    const level = parseInt(m[1]);
    const id = m[2];
    const text = m[3].replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    if (level >= 2 && text.trim().length >= 3) {
      items.push({ id, text: text.trim(), level: Math.min(level, 3) });
    }
  }
  return items;
}

function detectCategory(text: string): string {
  const lower = text.toLowerCase();
  let bestCategory = 'TECHNOLOGY';
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const score = keywords.reduce((acc, kw) => {
      const regex = new RegExp('\\b' + kw.toLowerCase() + '\\b', 'gi');
      const matches = lower.match(regex);
      return acc + (matches ? matches.length : 0);
    }, 0);

    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }

  return bestCategory.toLowerCase().replace(/_/g, '-');
}

function extractTags(text: string): string[] {
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 3 && !STOP_WORDS.has(w));

  const freq: Record<string, number> = {};
  for (const word of words) {
    freq[word] = (freq[word] || 0) + 1;
  }

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .substring(0, 60);
}

export function generateExcerpt(content: string, length = 160): string {
  const plain = content
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
  if (plain.length <= length) return plain;
  return plain.slice(0, length).trim() + '...';
}
