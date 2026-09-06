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
  content: string;
  suggestedCategory: string;
  tags: string[];
  readTime: number;
  wordCount: number;
}

export async function readFiles(files: File[]): Promise<string[]> {
  return Promise.all(files.map(file => file.text()));
}

// ═══════════════════════════════════════════════════════════════════════
//  SPECIAL BLOCKS — Tip, Warning, Callout, FAQ, Source, Key Takeaway
// ═══════════════════════════════════════════════════════════════════════

const BLOCK_MARKERS: Record<string, { class: string; icon: string; title: string }> = {
  ':::tip':       { class: 'article-tip',            icon: '💡', title: 'Pro Tip' },
  ':::warning':   { class: 'article-warning',        icon: '⚠️', title: 'Warning' },
  ':::callout':   { class: 'article-callout',        icon: '📢', title: 'Important' },
  ':::important': { class: 'article-callout',        icon: '❗', title: 'Important' },
  ':::key-takeaway': { class: 'article-key-takeaway', icon: '🔑', title: 'Key Takeaway' },
  ':::faq':       { class: 'article-faq',            icon: '❓', title: 'FAQ' },
  ':::source':    { class: 'article-source',         icon: '📚', title: 'Sources' },
};

function convertSpecialBlocks(html: string): string {
  // Match block markers on their own lines: :::type content... :::
  const blockRegex = /(?:^|\n)(:::tip|:::warning|:::callout|:::important|:::key-takeaway|:::faq|:::source)\s*\n([\s\S]*?)\n:::/g;

  return html.replace(blockRegex, (_, marker, content) => {
    const info = BLOCK_MARKERS[marker] || BLOCK_MARKERS[':::callout'];
    // Process inline markdown inside the block content
    const processedContent = content
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    return `<div class="${info.class}"><div class="article-callout-title">${info.icon} ${info.title}</div><div class="article-callout-content">${processedContent}</div></div>`;
  });
}

// ═══════════════════════════════════════════════════════════════════════
//  MARKDOWN → HTML CONVERTER
// ═══════════════════════════════════════════════════════════════════════

// ── HTML escape ─────────────────────────────────────────────────────
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ── Heading ID generation ──────────────────────────────────────────
function makeHeadingId(text: string, seen: Map<string, number>): string {
  let id = text
    .toLowerCase()
    .replace(/<[^>]*>/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 60);

  if (!id) return 'section';

  const original = id;
  let counter = 1;
  while (seen.has(id)) {
    id = `${original}-${counter++}`;
  }
  seen.set(id, 1);
  return id;
}

// ── Inline Markdown escaping (for headings) ─────────────────────────
function escapeInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`(.+?)`/g, '$1');
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

// ── Inline formatting (used by list parser) ─────────────────────────
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
  result = result.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>');

  // Inline code: `code`
  result = result.replace(/`([^`]+)`/g, '<code>$1</code>');

  return result;
}

// ── Table rendering ──────────────────────────────────────────────
function renderTable(tableText: string): string {
  const rows = tableText.split('\n').filter(l => l.trim().match(/^\|.+\|$/));
  if (rows.length < 2) return tableText;

  let headerRow = '';
  const bodyRows: string[] = [];
  let isFirstDataRow = true;

  for (const row of rows) {
    const cleaned = row.replace(/^\|/, '').replace(/\|$/, '');
    const cells = cleaned.split('|').map(c => c.trim());
    if (cells.every(c => /^:?-+:?$/.test(c))) continue;
    if (isFirstDataRow) {
      headerRow = cleaned;
      isFirstDataRow = false;
    } else {
      bodyRows.push(cleaned);
    }
  }

  if (!headerRow && bodyRows.length === 0) return tableText;

  const escapeCell = (cell: string) => inlineFormat(escapeHtml(cell.trim()));

  let tableHtml = '<div class="article-table-wrapper"><table>';

  if (headerRow) {
    const headers = headerRow.split('|').map(c => escapeCell(c));
    tableHtml += '<thead><tr>' + headers.map(h => `<th>${h}</th>`).join('') + '</tr></thead>';
  }

  if (bodyRows.length > 0) {
    const tbodyRows = bodyRows.map(row => {
      const cells = row.split('|').map(c => escapeCell(c));
      return '<tr>' + cells.map(c => `<td>${c}</td>`).join('') + '</tr>';
    });
    tableHtml += '<tbody>' + tbodyRows.join('') + '</tbody>';
  }

  tableHtml += '</table></div>';
  return tableHtml;
}

function convertTables(html: string): string {
  const lines = html.split('\n');
  const tables: string[] = [];
  let inTable = false;
  let tableLines: string[] = [];
  const result: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    const isTableLine = trimmed.startsWith('|') && trimmed.endsWith('|');

    if (isTableLine) {
      if (!inTable) {
        inTable = true;
        tableLines = [];
      }
      tableLines.push(trimmed);

      const nextLine = (i + 1 < lines.length) ? lines[i + 1].trim() : '';
      if (!nextLine.startsWith('|') || !nextLine.endsWith('|')) {
        tables.push(tableLines.join('\n'));
        tableLines = [];
        inTable = false;
      }
    } else {
      result.push(lines[i]);
    }
  }

  if (tableLines.length > 0) {
    tables.push(tableLines.join('\n'));
    result.push(...tableLines);
  }

  let joined = result.join('\n');

  tables.forEach((table) => {
    const tableHtml = renderTable(table);
    joined = joined.replace(table, tableHtml);
  });

  return joined;
}

// ── List conversion ────────────────────────────────────────────────
function convertLists(html: string): string {
  const lines = html.split('\n');
  const result: string[] = [];
  const listStack: { type: 'ul' | 'ol'; items: string[] }[] = [];
  let inList = false;

  function closeList() {
    while (listStack.length > 0) {
      const list = listStack.pop()!;
      const tag = list.type;
      result.push(`<${tag}>${list.items.join('')}</${tag}>`);
    }
    inList = false;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    const ulMatch = trimmed.match(/^[-*+]\s+(.+)/);
    const olMatch = trimmed.match(/^(\d+)\.\s+(.+)/);

    if (ulMatch || olMatch) {
      const listType: 'ul' | 'ol' = ulMatch ? 'ul' : 'ol';
      const content = ulMatch ? ulMatch[1] : olMatch![2];

      if (!inList) {
        inList = true;
        listStack.length = 0;
      }

      if (listStack.length > 0 && listStack[listStack.length - 1].type !== listType) {
        closeList();
        inList = true;
      }

      const processedContent = inlineFormat(escapeHtml(content));
      if (listStack.length === 0) {
        listStack.push({ type: listType, items: [] });
      }
      listStack[listStack.length - 1].items.push(`<li>${processedContent}</li>`);
    } else {
      if (inList) {
        closeList();
      }
      result.push(line);
    }
  }

  if (inList) {
    closeList();
  }

  return result.join('\n');
}

// ── Inline formatting (for paragraphs and inline contexts) ─────────
function applyInlineFormatting(html: string): string {
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_m, alt, url) => {
    const safeAlt = escapeHtml(alt);
    return `<img src="${url}" alt="${safeAlt}" loading="lazy" />`;
  });

  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label, url) => {
    const safeLabel = escapeHtml(label);
    const safeUrl = url.replace(/"/g, '&quot;');
    return `<a href="${safeUrl}">${safeLabel}</a>`;
  });

  // Bold+Italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>');

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');

  // Strikethrough
  html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');

  // Inline code
  html = html.replace(/`([^`\n]+)`/g, '<code>$1</code>');

  return html;
}

// ── HTML Sanitization ──────────────────────────────────────────────
function sanitizeHtml(html: string): string {
  html = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  html = html.replace(/\s(on\w+)=["'][^"']*["']/gi, '');
  html = html.replace(/\s(on\w+)=\S+/gi, '');
  html = html.replace(/(href|src)=["'](?:javascript|data|vbscript):[^"']*["']/gi, (_m, attr) => `${attr}=""`);
  return html;
}

// ── Main Markdown → HTML converter ────────────────────────────────
export function markdownToHtml(md: string): string {
  if (!md || !md.trim()) return '';

  let html = md.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Phase 1: Extract code blocks (protect from further processing)
  const codeBlocks: string[] = [];
  html = html.replace(/```([\s\S]*?)```/g, (match) => {
    codeBlocks.push(match);
    return `\n%%CODEBLOCK_${codeBlocks.length - 1}%%\n`;
  });

  // Inline code
  const inlineCodes: string[] = [];
  html = html.replace(/`([^`\n]+)`/g, (match) => {
    inlineCodes.push(match);
    return `%%INLINECODE_${inlineCodes.length - 1}%%`;
  });

  // Phase 1.5: Special blocks (::tip, :::warning, etc.)
  html = convertSpecialBlocks(html);

  // Phase 2: Headings (with anchor IDs for TOC)
  const headingIds = new Map<string, number>();

  html = html.replace(/^(#{1,6})\s+(.+)$/gm, (_, hashes, title) => {
    const level = Math.min(hashes.length, 3);
    const plainText = title.replace(/\*\*(.+?)\*\*/g, '$1')
                           .replace(/\*(.+?)\*/g, '$1')
                           .replace(/`(.+?)`/g, '$1')
                           .replace(/<[^>]*>/g, '')
                           .trim();

    const id = makeHeadingId(plainText, headingIds);
    const escaped = escapeInlineMarkdown(title.trim());
    return `<h${level} id="${id}">${escaped}</h${level}>`;
  });

  // Phase 3: Horizontal rules
  html = html.replace(/^([-*_])(?:\s*\1){2,}\s*$/gm, '<hr>');

  // Phase 4: Blockquotes
  const lines = html.split('\n');
  const processedLines: string[] = [];
  let inQuote = false;
  let quoteContent: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const quoteMatch = line.match(/^>\s?(.*)/);

    if (quoteMatch) {
      if (!inQuote) {
        inQuote = true;
        quoteContent = [];
      }
      quoteContent.push(quoteMatch[1]);
    } else {
      if (inQuote) {
        processedLines.push(`<blockquote>${quoteContent.join('<br>')}</blockquote>`);
        inQuote = false;
        quoteContent = [];
      }
      processedLines.push(line);
    }
  }
  if (inQuote) {
    processedLines.push(`<blockquote>${quoteContent.join('<br>')}</blockquote>`);
  }
  html = processedLines.join('\n');

  // Phase 5: Tables
  html = convertTables(html);

  // Phase 6: Lists
  html = convertLists(html);

  // Phase 7: Remaining inline formatting (bold, italic, links)
  html = applyInlineFormatting(html);

  // Phase 8: Paragraphs
  const blocks = html.split(/\n\n+/);
  html = blocks
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (/^<(h[1-6]|blockquote|hr|ul|ol|li|table|pre|%%CODEBLOCK)/.test(trimmed)) {
        return trimmed;
      }
      return `<p>${trimmed.replace(/\n/g, '<br>')}</p>`;
    })
    .join('\n\n');

  // Phase 9: Restore code blocks
  codeBlocks.forEach((block, i) => {
    const langMatch = block.match(/```(\w*)/);
    const lang = langMatch ? langMatch[1] : '';
    const code = block.replace(/```\w*\n?/, '').replace(/```$/, '').trim();
    const escapedCode = escapeHtml(code);
    html = html.replace(`%%CODEBLOCK_${i}%%`, `<pre><code${lang ? ` class="language-${lang}"` : ''}>${escapedCode}</code></pre>`);
  });

  // Restore inline code
  inlineCodes.forEach((code, i) => {
    const unquoted = code.replace(/^`|`$/g, '');
    html = html.replace(`%%INLINECODE_${i}%%`, `<code>${escapeHtml(unquoted)}</code>`);
  });

  return sanitizeHtml(html);
}

// ═══════════════════════════════════════════════════════════════════════
//  PUBLIC API — parseContent, extractHeadings
// ═══════════════════════════════════════════════════════════════════════

// ── Public entry point ─────────────────────────────────────────────
export function parseContent(rawText: string): ParsedContent {
  const text = rawText.trim();
  if (!text) {
    return {
      title: '', slug: '', excerpt: '', content: '',
      suggestedCategory: 'TECHNOLOGY', tags: [], readTime: 1, wordCount: 0,
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

  // Excerpt from first sentences (strip markdown markers)
  const plainText = rawBody
    .replace(/#{1,6}\s/g, '')
    .replace(/[*_`>]/g, '')
    .replace(/\n+/g, ' ')
    .trim();
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
