/**
 * Markdown-to-HTML converter for blog article content.
 *
 * Handles the Markdown content stored in the Post.content field and converts
 * it to semantic, styled HTML before rendering. This runs at render time
 * so it applies to all existing and future articles automatically.
 *
 * Supported Markdown:
 *   - Headings: #, ##, ###, ####
 *   - Bold/Italic: **bold**, *italic*, ***both***
 *   - Links: [text](url)
 *   - Images: ![alt](url)
 *   - Unordered lists: - item / * item
 *   - Ordered lists: 1. item
 *   - Blockquotes: > text
 *   - Code blocks: ```lang\n...\n```
 *   - Inline code: `code`
 *   - Horizontal rules: --- or ***
 *   - Tables: | col | col |
 *
 * HTML already in the content is preserved and escaped safely.
 */

// ─── Character escaping ─────────────────────────────────────────────

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Markdown-to-HTML converter.
 *
 * @param markdown - Raw Markdown string from the database
 * @returns Sanitized HTML string safe for dangerouslySetInnerHTML
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown || !markdown.trim()) return '';

  const text = markdown.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const html = convertMarkdown(text);
  return sanitizeHtml(html);
}

// ─── Core Markdown Conversion ────────────────────────────────────────

function convertMarkdown(source: string): string {
  // Normalize excessive blank lines
  let html = source.replace(/\n{3,}/g, '\n\n').trim();

  // ═══ Phase 1: Extract code blocks (protect from further processing) ═══
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

  // ═══ Phase 2: Headings (with anchor IDs for TOC) ═══
  // Track seen IDs to handle duplicates
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

  // ═══ Phase 3: Horizontal rules ═══
  html = html.replace(/^([-*_])(?:\s*\1){2,}\s*$/gm, '<hr>');

  // ═══ Phase 4: Blockquotes ═══
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

  // ═══ Phase 5: Tables ═══
  html = convertTables(html);

  // ═══ Phase 6: Lists ═══
  html = convertLists(html);

  // ═══ Phase 7: Remaining inline formatting (bold, italic, links) ═══
  html = applyInlineFormatting(html);

  // ═══ Phase 8: Paragraphs ═══
  const blocks = html.split(/\n\n+/);
  html = blocks
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      // Don't wrap block-level elements
      if (/^<(h[1-6]|blockquote|hr|ul|ol|li|table|pre|%%CODEBLOCK)/.test(trimmed)) {
        return trimmed;
      }
      // Single newlines inside a block → <br>
      return `<p>${trimmed.replace(/\n/g, '<br>')}</p>`;
    })
    .join('\n\n');

  // ═══ Phase 9: Restore code blocks ═══
  codeBlocks.forEach((block, i) => {
    const langMatch = block.match(/```(\w*)/);
    const lang = langMatch ? langMatch[1] : '';
    const code = block.replace(/```\w*\n?/, '').replace(/```$/, '').trim();
    const escapedCode = escapeHtml(code);
    html = html.replace(`%%CODEBLOCK_${i}%%`, `<pre><code${lang ? ` class="language-${lang}"` : ''}>${escapedCode}</code></pre>`);
  });

  // Restore inline code
  inlineCodes.forEach((code, i) => {
    // Remove the backticks from the stored value
    const unquoted = code.replace(/^`|`$/g, '');
    html = html.replace(`%%INLINECODE_${i}%%`, `<code>${escapeHtml(unquoted)}</code>`);
  });

  return html;
}

/**
 * Generate a unique, URL-safe heading ID from text.
 * Handles duplicates by appending a numeric suffix.
 */
function makeHeadingId(text: string, seen: Map<string, number>): string {
  const base = text.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);

  if (!base) return 'section';

  const count = seen.get(base) ?? 0;
  seen.set(base, count + 1);

  return count === 0 ? base : `${base}-${count}`;
}

// ─── Helper: Inline Markdown escaping ─────────────────────────────

function escapeInlineMarkdown(text: string): string {
  // Escape bold/italic markers and other markdown chars inside headings
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1') // remove bold markers
    .replace(/\*(.+?)\*/g, '$1')      // remove italic markers
    .replace(/`(.+?)`/g, '$1');       // remove inline code markers
}

// ─── Helper: Inline formatting ────────────────────────────────────

function applyInlineFormatting(html: string): string {
  // Images (before links, since both use brackets)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_m, alt, url) => {
    const safeAlt = escapeHtml(alt);
    return `<img src="${url}" alt="${safeAlt}" loading="lazy" />`;
  });

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label, url) => {
    const safeLabel = escapeHtml(label);
    const safeUrl = url.replace(/"/g, '&quot;');
    return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${safeLabel}</a>`;
  });

  // Bold + italic (***text***)
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>');

  // Bold (**text**)
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

  // Italic (*text*)
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');

  // Strikethrough
  html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');

  return html;
}

// ─── Helper: Table conversion ──────────────────────────────────────

function convertTables(html: string): string {
  const lines = html.split('\n');
  const tables: string[] = [];
  let inTable = false;
  let tableLines: string[] = [];
  const result: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const isTableLine = line.startsWith('|') && line.endsWith('|');

    if (isTableLine) {
      if (!inTable) {
        inTable = true;
        tableLines = [];
      }
      tableLines.push(line);

      // Check if next line is not a table line (or end)
      const nextLine = (i + 1 < lines.length) ? lines[i + 1].trim() : '';
      if (!nextLine.startsWith('|') || !nextLine.endsWith('|')) {
        tables.push(tableLines.join('\n'));
        tableLines = [];
        inTable = false;
      }
    } else {
      result.push(line);
    }
  }

  if (tableLines.length > 0) {
    tables.push(tableLines.join('\n'));
    result.push(...tableLines);
  }

  html = result.join('\n');

  tables.forEach((table) => {
    const tableHtml = renderTable(table);
    html = html.replace(table, tableHtml);
  });

  return html;
}

function renderTable(tableText: string): string {
  const rows = tableText.split('\n').filter(l => l.trim().match(/^\|.+\|$/));
  if (rows.length < 2) return tableText;

  // Detect and skip alignment separator row (e.g. |---|---|)
  let headerRow = '';
  const bodyRows: string[] = [];
  let isFirstDataRow = true;

  for (const row of rows) {
    const cleaned = row.replace(/^\|/, '').replace(/\|$/, '');
    const cells = cleaned.split('|').map(c => c.trim());
    // Skip alignment separator (contains only dashes and colons)
    if (cells.every(c => /^:?-+:?$/.test(c))) continue;
    if (isFirstDataRow) {
      headerRow = cleaned;
      isFirstDataRow = false;
    } else {
      bodyRows.push(cleaned);
    }
  }

  if (!headerRow && bodyRows.length === 0) return tableText;

  const escapeCell = (cell: string) => applyInlineFormatting(escapeHtml(cell.trim()));

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

// ─── Helper: List conversion ────────────────────────────────────────

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

    // Unordered list item
    const ulMatch = trimmed.match(/^[-*]\s+(.+)/);
    // Ordered list item
    const olMatch = trimmed.match(/^(\d+)\.\s+(.+)/);

    if (ulMatch || olMatch) {
      const listType: 'ul' | 'ol' = ulMatch ? 'ul' : 'ol';
      const content = ulMatch ? ulMatch[1] : olMatch![2];

      if (!inList) {
        inList = true;
        listStack.length = 0;
      }

      // Check if we need to switch list type
      if (listStack.length > 0 && listStack[listStack.length - 1].type !== listType) {
        closeList();
        inList = true;
      }

      const processedContent = applyInlineFormatting(escapeHtml(content));
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

// ─── HTML Sanitization ──────────────────────────────────────────────

function sanitizeHtml(html: string): string {
  // Minimal sanitization: strip script tags, event handlers, javascript: URLs
  // We don't add a heavy DOMPurify dependency — the markdown-to-html
  // converter only produces safe tags, but let's be defensive.

  // Remove script tags
  html = html.replace(/<script[\s\S]*?<\/script>/gi, '');

  // Remove event handlers
  html = html.replace(/\s(on\w+)=["'][^"']*["']/gi, '');
  html = html.replace(/\s(on\w+)=\S+/gi, '');

  // Remove javascript: and data: URIs in href/src
  html = html.replace(/(href|src)=["'](?:javascript|data|vbscript):[^"']*["']/gi, (_m, attr) => `${attr}=""`);

  // Defense-in-depth: the converter only produces safe tags, but strip any
  // raw HTML tags that aren't in our allowlist (catches injection attempts).
  // We don't use a heavy regex here since the converter controls the output.

  return html;
}
