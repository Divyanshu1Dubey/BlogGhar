'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText, Type, Settings, Eye, Save, RefreshCw, Loader2 } from 'lucide-react';

interface BlogFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string;
  coverImage: string;
  isPublished: boolean;
  isFeatured: boolean;
  seoTitle: string;
  seoDescription: string;
}

const CATEGORIES = [
  'Technology',
  'Business',
  'Health',
  'Lifestyle',
  'Entertainment',
  'Sports',
  'Education',
  'Travel',
  'Food',
  'Science',
  'Gaming',
  'Finance',
  'News',
  'Other',
];

export default function BlogImporter() {
  const [mode, setMode] = useState<'paste' | 'file'>('paste');
  const [rawInput, setRawInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: 'Technology',
    tags: '',
    coverImage: '',
    isPublished: true,
    isFeatured: false,
    seoTitle: '',
    seoDescription: '',
  });

  // ─── Auto-generate slug from title ───────────────────────────────────

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // ─── Auto-generate excerpt from content ──────────────────────────────

  const generateExcerpt = (content: string, title: string): string => {
    const plainText = content.replace(/<[^>]*>/g, '').replace(/\n/g, ' ').trim();
    if (plainText.length > 0) {
      return plainText.slice(0, 160) + (plainText.length > 160 ? '...' : '');
    }
    return `${title} - Read the full article on BlogGhar.`;
  };

  // ─── Auto-generate SEO from content ──────────────────────────────────

  const generateSEO = (title: string, content: string) => {
    const plainText = content.replace(/<[^>]*>/g, '').replace(/\n/g, ' ').trim();
    return {
      seoTitle: title.length > 60 ? title.slice(0, 57) + '...' : title,
      seoDescription: plainText.slice(0, 155) + (plainText.length > 155 ? '...' : ''),
    };
  };

  // ─── Process raw input → structured blog ─────────────────────────────

  const processInput = useCallback((input: string): { title: string; content: string } => {
    const trimmed = input.trim();

    // Try to extract title from first line or heading
    const lines = trimmed.split('\n').filter((l) => l.trim());
    let title = '';
    let content = '';
    let contentStart = 0;

    // Check if first line looks like a title (no HTML, short, all caps or title case)
    if (lines.length > 0) {
      const firstLine = lines[0].trim();
      const isHTML = firstLine.startsWith('<');
      const isReasonableTitle = firstLine.length > 3 && firstLine.length < 200;

      if (!isHTML && isReasonableTitle) {
        title = firstLine.replace(/^#+\s*/, '').replace(/\*+/g, '').trim();
        contentStart = 1;
      }
    }

    // If no title found from first line, look for H1/H2 heading
    if (!title) {
      const headingMatch = trimmed.match(/^#{1,2}\s+(.+)$/m);
      if (headingMatch) {
        title = headingMatch[1].replace(/\*+/g, '').trim();
      }
    }

    // Build content
    let contentBody = trimmed;

    // Remove title line from content if we found it
    if (title && contentStart > 0) {
      const firstLine = lines[0].trim();
      contentBody = trimmed.slice(trimmed.indexOf(firstLine) + firstLine.length).trim();
    }

    // If no title found, use first sentence as title
    if (!title) {
      const sentences = trimmed.replace(/<[^>]*>/g, '').split(/[.!?]/).filter((s) => s.trim().length > 5);
      if (sentences.length > 0) {
        title = sentences[0].trim().slice(0, 100);
      }
    }

    // Convert markdown-like formatting to HTML
    let htmlContent = contentBody;

    // Headings
    htmlContent = htmlContent.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    htmlContent = htmlContent.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    htmlContent = htmlContent.replace(/^# (.+)$/gm, '<h1>$1</h1>');

    // Bold and italic
    htmlContent = htmlContent.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    htmlContent = htmlContent.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    htmlContent = htmlContent.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Links
    htmlContent = htmlContent.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');

    // Images
    htmlContent = htmlContent.replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1" class="w-full rounded-lg my-4" />');

    // Lists
    htmlContent = htmlContent.replace(/^[-•]\s+(.+)$/gm, '<li>$1</li>');
    htmlContent = htmlContent.replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul class="list-disc pl-6 my-3">${match}</ul>`);

    // Numbered lists
    htmlContent = htmlContent.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');

    // Blockquotes
    htmlContent = htmlContent.replace(/^>\s+(.+)$/gm, '<blockquote class="border-l-4 border-primary-500 pl-4 italic my-4 text-gray-600 dark:text-gray-300">$1</blockquote>');

    // Code blocks
    htmlContent = htmlContent.replace(/```[\s\S]*?```/g, (match) => {
      const code = match.slice(3, -3).trim();
      return `<pre class="bg-gray-900 text-green-400 p-4 rounded-lg my-4 overflow-x-auto"><code>${code}</code></pre>`;
    });

    // Inline code
    htmlContent = htmlContent.replace(/`(.+?)`/g, '<code class="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');

    // Line breaks → paragraphs
    const paragraphs = htmlContent.split('\n\n').filter((p) => p.trim());
    htmlContent = paragraphs
      .map((p) => {
        const trimmed = p.trim();
        if (trimmed.startsWith('<')) return trimmed;
        return `<p class="mb-4 leading-relaxed">${trimmed}</p>`;
      })
      .join('\n');

    content = htmlContent;

    return { title, content };
  }, []);

  // ─── Handle paste/file upload ────────────────────────────────────────

  const handleProcess = () => {
    if (!rawInput.trim()) {
      setMessage({ type: 'error', text: 'Please paste some content or upload a file.' });
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    try {
      const { title, content } = processInput(rawInput);

      const seo = generateSEO(title, content.replace(/<[^>]*>/g, ''));

      setFormData((prev) => ({
        ...prev,
        title: title || 'Untitled Blog Post',
        slug: generateSlug(title || 'untitled-blog-post'),
        content,
        excerpt: generateExcerpt(content, title),
        seoTitle: seo.seoTitle,
        seoDescription: seo.seoDescription,
      }));

      setMessage({ type: 'success', text: 'Content processed! Review and adjust below, then publish.' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to process content. Please check the format.' });
    } finally {
      setIsProcessing(false);
    }
  };

  // ─── Handle file upload ──────────────────────────────────────────────

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['text/plain', 'text/html', 'text/markdown', 'application/json'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(txt|html|md|json|docx)$/)) {
      setMessage({ type: 'error', text: 'Please upload a valid file (.txt, .html, .md, .json)' });
      return;
    }

    try {
      const text = await file.text();
      setRawInput(text);
      setMode('paste');
    } catch {
      setMessage({ type: 'error', text: 'Failed to read file.' });
    }
  };

  // ─── Save blog post ──────────────────────────────────────────────────

  const handleSave = async () => {
    if (!formData.title || !formData.content) {
      setMessage({ type: 'error', text: 'Title and content are required.' });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        coverImage: formData.coverImage || `/api/placeholder?text=${encodeURIComponent(formData.title)}`,
      };

      const res = await fetch('/api/admin/blogs/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save');

      setMessage({ type: 'success', text: 'Blog post published successfully!' });
      // Reset
      setRawInput('');
      setFormData({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        category: 'Technology',
        tags: '',
        coverImage: '',
        isPublished: true,
        isFeatured: false,
        seoTitle: '',
        seoDescription: '',
      });
    } catch {
      setMessage({ type: 'error', text: 'Failed to publish. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      {/* Header */}
      <div className="bg-white dark:bg-dark-card shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-7 h-7 text-primary-500" />
              Blog Importer
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Convert any text, HTML, or Markdown file into a professional blog post
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? 'Edit' : 'Preview'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ─── Left: Input ───────────────────────────────────────────── */}
          <div className="space-y-4">
            {/* Mode Toggle */}
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setMode('paste')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition ${
                    mode === 'paste'
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 border-b-2 border-primary-500'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <Type className="w-4 h-4" />
                  Paste Text
                </button>
                <button
                  onClick={() => setMode('file')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition ${
                    mode === 'file'
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 border-b-2 border-primary-500'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  Upload File
                </button>
              </div>

              <div className="p-4">
                {mode === 'paste' ? (
                  <textarea
                    value={rawInput}
                    onChange={(e) => setRawInput(e.target.value)}
                    placeholder="Paste your blog content here...

You can paste:
• Plain text
• HTML content
• Markdown
• Content copied from any website

Tips:
- First line = Title (or use # Heading)
- Use markdown formatting (**bold**, *italic*, ## headings)
- Links: [text](url)
- Images: ![alt](url)

BlogGhar will auto-format everything into a beautiful blog post!"
                    className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg
                      bg-white dark:bg-dark-bg text-gray-900 dark:text-white
                      placeholder-gray-400 text-sm leading-relaxed resize-y
                      focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                ) : (
                  <div>
                    <label className="block w-full cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center hover:border-primary-400 dark:hover:border-primary-500 transition">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Drop your file here or click to browse
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Supports .txt, .html, .md, .json, .docx
                        </p>
                      </div>
                      <input
                        type="file"
                        accept=".txt,.html,.md,.json,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    {rawInput && (
                      <div className="mt-3 text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                        ✓ File loaded! ({rawInput.length} characters)
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="px-4 pb-4">
                <button
                  onClick={handleProcess}
                  disabled={isProcessing || !rawInput.trim()}
                  className="w-full bg-primary-500 text-white py-2.5 rounded-lg font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Convert to Blog Post
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* ─── Raw Input Preview (for file mode) ─────────────────── */}
            {mode === 'file' && rawInput && (
              <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Raw Content Preview</h3>
                </div>
                <pre className="p-4 text-xs text-gray-600 dark:text-gray-400 overflow-auto max-h-64 whitespace-pre-wrap">
                  {rawInput.slice(0, 2000)}
                  {rawInput.length > 2000 && '\n... (truncated)'}
                </pre>
              </div>
            )}
          </div>

          {/* ─── Right: Blog Editor ──────────────────────────────────── */}
          <div className="space-y-4">
            {/* Basic Info */}
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                <Settings className="w-4 h-4 text-gray-400" />
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Blog Settings</h3>
              </div>
              <div className="p-4 space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({
                      ...prev,
                      title: e.target.value,
                      slug: prev.slug || generateSlug(e.target.value),
                    }))}
                    placeholder="Enter blog title..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">URL Slug</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs">
                      blogghar.com/blog/
                    </span>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                      className="flex-1 px-3 py-2 rounded-r-lg border border-gray-300 dark:border-gray-600 text-sm bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
                    placeholder="technology, gaming, news, tips"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Cover Image URL */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Cover Image URL</label>
                  <input
                    type="text"
                    value={formData.coverImage}
                    onChange={(e) => setFormData((prev) => ({ ...prev, coverImage: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  />
                  {formData.coverImage && (
                    <img
                      src={formData.coverImage}
                      alt="Cover preview"
                      className="mt-2 w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                </div>

                {/* SEO Title */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">SEO Title</label>
                  <input
                    type="text"
                    value={formData.seoTitle}
                    onChange={(e) => setFormData((prev) => ({ ...prev, seoTitle: e.target.value }))}
                    placeholder="SEO optimized title..."
                    maxLength={60}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="text-[10px] text-gray-400 mt-0.5">{formData.seoTitle.length}/60 characters</p>
                </div>

                {/* SEO Description */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">SEO Description</label>
                  <textarea
                    value={formData.seoDescription}
                    onChange={(e) => setFormData((prev) => ({ ...prev, seoDescription: e.target.value }))}
                    placeholder="Brief description for search engines..."
                    rows={2}
                    maxLength={160}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 resize-none"
                  />
                  <p className="text-[10px] text-gray-400 mt-0.5">{formData.seoDescription.length}/160 characters</p>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Excerpt</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Short description shown in blog cards..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 resize-none"
                  />
                </div>

                {/* Checkboxes */}
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData((prev) => ({ ...prev, isPublished: e.target.checked }))}
                      className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Published</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))}
                      className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Featured</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Content Editor */}
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Content (HTML)</h3>
              </div>
              <div className="p-4">
                <textarea
                  value={formData.content}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, content: e.target.value }));
                    // Auto-update excerpt
                    if (!formData.excerpt || formData.excerpt === generateExcerpt(prev.content, prev.title)) {
                      const newExcerpt = generateExcerpt(e.target.value, prev.title);
                      setFormData((p) => ({ ...p, excerpt: newExcerpt }));
                    }
                  }}
                  placeholder="Blog content in HTML format..."
                  rows={16}
                  className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-xs leading-relaxed bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 resize-y"
                />
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={isSaving || !formData.title || !formData.content}
              className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 text-base"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {formData.isPublished ? 'Publish Blog Post' : 'Save as Draft'}
                </>
              )}
            </button>
          </div>
        </div>

        {/* ─── Full Preview Modal ────────────────────────────────────── */}
        {showPreview && formData.content && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Preview</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                  ×
                </button>
              </div>
              <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
                <article className="max-w-3xl mx-auto">
                  {formData.coverImage && (
                    <img
                      src={formData.coverImage}
                      alt={formData.title}
                      className="w-full h-64 object-cover rounded-xl mb-6"
                    />
                  )}
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">{formData.title}</h1>
                  <div className="flex items-center gap-3 mb-6 text-sm text-gray-500">
                    <span className="px-2.5 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium">
                      {formData.category}
                    </span>
                    <span>Just now</span>
                    <span>Admin</span>
                  </div>
                  <div
                    className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formData.content }}
                  />
                </article>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
