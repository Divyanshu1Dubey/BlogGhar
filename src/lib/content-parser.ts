// Content Parser - Converts raw text into structured blog post data

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  TECHNOLOGY: ['code', 'software', 'app', 'tech', 'digital', 'AI', 'computer', 'web', 'data', 'cloud', 'programming', 'developer', 'API', 'software', 'machine learning', 'blockchain', 'cyber'],
  LIFESTYLE: ['health', 'fitness', 'diet', 'travel', 'food', 'fashion', 'wellness', 'mindfulness', 'yoga', 'meditation', 'self-care', 'routine', 'habits'],
  EDUCATION: ['learn', 'study', 'course', 'exam', 'school', 'college', 'university', 'student', 'tutorial', 'guide', 'tips', 'career', 'skill'],
  FINANCE: ['money', 'invest', 'stock', 'market', 'save', 'tax', 'budget', 'crypto', 'bitcoin', 'portfolio', 'income', 'wealth', 'trading'],
  ENTERTAINMENT: ['movie', 'music', 'game', 'celebrity', 'fun', 'film', 'series', 'streaming', 'review', 'actor', 'director', 'album'],
  HEALTH: ['medical', 'doctor', 'disease', 'treatment', 'symptom', 'mental health', 'therapy', 'medicine', 'hospital', 'fitness', 'nutrition'],
  TRAVEL: ['destination', 'flight', 'hotel', 'vacation', 'trip', 'tourist', 'backpacking', 'resort', 'airport', 'passport'],
  FOOD: ['recipe', 'cook', 'kitchen', 'restaurant', 'cuisine', 'ingredient', 'baking', 'meal', 'chef', 'delicious'],
  SPORTS: ['match', 'player', 'team', 'score', 'championship', 'league', 'tournament', 'coach', 'athlete', 'fitness'],
  SCIENCE: ['research', 'discovery', 'experiment', 'space', 'nasa', 'quantum', 'physics', 'biology', 'chemistry', 'study'],
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

  // Parse title (first line or first sentence)
  const lines = text.split('\n').filter(l => l.trim());
  let title = '';
  let contentStart = 0;

  // Check for markdown heading
  const firstLine = lines[0].trim();
  if (firstLine.startsWith('# ')) {
    title = firstLine.replace(/^#+\s*/, '').trim();
    contentStart = 1;
  } else if (firstLine.length < 120 && !firstLine.includes('. ')) {
    title = firstLine;
    contentStart = 1;
  } else {
    // Use first sentence as title
    const firstSentenceMatch = text.match(/^(.+?[.!?])\s/);
    if (firstSentenceMatch && firstSentenceMatch[1].length < 120) {
      title = firstSentenceMatch[1].trim();
    } else {
      title = firstLine.substring(0, 80).trim();
    }
  }

  // Generate slug
  const slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 60);

  // Parse content
  const contentLines = lines.slice(contentStart);
  const htmlContent = parseMarkdownToHtml(contentLines.join('\n'));

  // Generate excerpt from first 2-3 sentences
  const plainText = text.replace(/[#*_`]/g, '').replace(/\n+/g, ' ');
  const sentences = plainText.match(/[^.!?]+[.!?]+/g) || [plainText];
  const excerpt = sentences.slice(0, 3).join(' ').substring(0, 300).trim();

  // Detect category
  const suggestedCategory = detectCategory(text);

  // Extract tags
  const tags = extractTags(text);

  // Calculate read time
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

function parseMarkdownToHtml(text: string): string {
  let html = text;

  // Escape HTML
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Headings
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');

  const sanitizeUrl = (url: string): string | null => {
    const trimmed = url.trim();
    if (!trimmed || /^(?:javascript|data|vbscript):/i.test(trimmed)) return null;
    if (/^(?:https?:|mailto:)/i.test(trimmed) || trimmed.startsWith('/') || trimmed.startsWith('./') || trimmed.startsWith('../') || trimmed.startsWith('#')) {
      return trimmed.replace(/"/g, '&quot;');
    }
    return null;
  };

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt, url) => {
    const safeUrl = sanitizeUrl(url);
    return safeUrl ? `<img src="${safeUrl}" alt="${alt}" style="max-width:100%;border-radius:8px;margin:12px 0;" />` : '';
  });

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, url) => {
    const safeUrl = sanitizeUrl(url);
    return safeUrl ? `<a href="${safeUrl}" target="_blank" rel="noopener">${label}</a>` : label;
  });

  // Lists
  const lines = html.split('\n');
  let inList = false;
  const result: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const listMatch = line.match(/^[-*]\s+(.+)/);

    if (listMatch) {
      if (!inList) { result.push('<ul>'); inList = true; }
      result.push(`<li>${listMatch[1]}</li>`);
    } else {
      if (inList) { result.push('</ul>'); inList = false; }

      if (line.trim() === '') {
        result.push('');
      } else if (line.match(/^<h[1-6]/)) {
        result.push(line);
      } else if (line.match(/^<[uo]l/)) {
        result.push(line);
      } else if (line.match(/^<\/[uo]l>/)) {
        result.push(line);
      } else {
        // Wrap in paragraph
        const trimmed = line.trim();
        if (trimmed && !trimmed.match(/^<[hup]/)) {
          result.push(`<p>${trimmed}</p>`);
        } else {
          result.push(trimmed);
        }
      }
    }
  }
  if (inList) result.push('</ul>');

  // Blockquotes
  let final = result.join('\n');
  final = final.replace(/^&gt;\s*(.+)$/gm, '<blockquote>$1</blockquote>');

  // Merge consecutive blockquotes
  final = final.replace(/<\/blockquote>\n<blockquote>/g, '\n');

  // Merge consecutive paragraphs
  final = final.replace(/<\/p>\n<p>/g, '</p>\n\n<p>');

  // Clean up empty paragraphs
  final = final.replace(/<p>\s*<\/p>/g, '');

  return final;
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
