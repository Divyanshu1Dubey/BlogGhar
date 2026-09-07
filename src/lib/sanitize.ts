/**
 * Minimal but effective HTML sanitizer for user-generated content.
 *
 * The full content of long-form blog articles is already sanitized at write time
 * via DOMPurify on the server (see admin posts API). This helper handles
 * short-form content where we want to allow a tiny set of safe tags.
 */

const ALLOWED_TAGS = new Set([
  'b', 'strong', 'i', 'em', 'u', 'br', 'p', 'a', 'code', 'pre', 'span', 'blockquote',
]);

const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(['href', 'title', 'rel', 'target']),
  span: new Set([]),
};

const URL_SAFE_RE = /^(https?:|mailto:|#|\/)/i;

function sanitizeUrl(url: string): string {
  const trimmed = (url || '').trim();
  if (!trimmed) return '';
  if (URL_SAFE_RE.test(trimmed)) return trimmed;
  // block javascript:, data:, vbscript: and unknown protocols
  return '';
}

function escapeText(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function sanitizeHtml(input: string): string {
  if (!input) return '';
  const text = String(input);
  // Strip out script/style blocks entirely first
  const stripped = text
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, '')
    .replace(/<object\b[^>]*>[\s\S]*?<\/object>/gi, '')
    .replace(/<embed\b[^>]*>/gi, '')
    .replace(/<form\b[^>]*>[\s\S]*?<\/form>/gi, '');

  // Walk tag-by-tag, allow only whitelisted elements
  const tagRe = /<\/?([a-zA-Z0-9]+)([^>]*)>/g;
  let out = '';
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = tagRe.exec(stripped)) !== null) {
    const before = stripped.slice(lastIndex, match.index);
    out += escapeText(before);

    const isClose = match[0].startsWith('</');
    const tag = match[1].toLowerCase();
    const attrs = match[2] || '';

    if (ALLOWED_TAGS.has(tag)) {
      if (isClose) {
        out += `</${tag}>`;
      } else {
        const allowed = ALLOWED_ATTRS[tag] || new Set<string>();
        const cleanedAttrs: string[] = [];
        const attrRe = /([a-zA-Z\-:]+)\s*=\s*("([^"]*)"|'([^']*)')/g;
        let a: RegExpExecArray | null;
        while ((a = attrRe.exec(attrs)) !== null) {
          const name = a[1].toLowerCase();
          const value = a[3] ?? a[4] ?? '';
          if (!allowed.has(name)) continue;
          if (name === 'href') {
            const safe = sanitizeUrl(value);
            if (!safe) continue;
            cleanedAttrs.push(`href="${escapeText(safe)}"`);
            if (safe.startsWith('http')) {
              cleanedAttrs.push('rel="nofollow noopener noreferrer"');
              cleanedAttrs.push('target="_blank"');
            }
          } else {
            cleanedAttrs.push(`${name}="${escapeText(value)}"`);
          }
        }
        out += `<${tag}${cleanedAttrs.length ? ' ' + cleanedAttrs.join(' ') : ''}>`;
      }
    } else {
      // Drop tag entirely; preserve inner text via next iteration
    }
    lastIndex = match.index + match[0].length;
  }
  out += escapeText(stripped.slice(lastIndex));

  return out;
}

/** Plain-text extract used for previews/excerpts from untrusted HTML */
export function htmlToText(input: string, max = 300): string {
  if (!input) return '';
  const text = input
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > max ? text.slice(0, max - 1) + '…' : text;
}
