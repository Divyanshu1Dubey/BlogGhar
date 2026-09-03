'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { parseContent, readFiles, generateSlug, type ParsedContent } from '@/lib/content-parser';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  { name: 'Technology', slug: 'technology', icon: '💻', color: '#3b82f6' },
  { name: 'Lifestyle', slug: 'lifestyle', icon: '🌟', color: '#ec4899' },
  { name: 'Education', slug: 'education', icon: '📚', color: '#10b981' },
  { name: 'Finance', slug: 'finance', icon: '💰', color: '#f59e0b' },
  { name: 'Entertainment', slug: 'entertainment', icon: '🎬', color: '#8b5cf6' },
  { name: 'Health', slug: 'health', icon: '🏥', color: '#ef4444' },
  { name: 'Travel', slug: 'travel', icon: '✈️', color: '#06b6d4' },
  { name: 'Food', slug: 'food', icon: '🍳', color: '#f97316' },
  { name: 'Sports', slug: 'sports', icon: '⚽', color: '#14b8a6' },
  { name: 'Science', slug: 'science', icon: '🔬', color: '#6366f1' },
];

function AdminSidebar() {
  const items = [
    'Dashboard', 'Posts', 'Import', 'News', 'Users',
    'Games', 'Tools', 'Comments', 'Subscribers', 'Settings',
  ];
  return (
    <aside className="fixed w-64 bg-white dark:bg-dark-card border-r border-gray-200 dark:border-dark-border min-h-screen">
      <div className="p-4 border-b border-gray-200 dark:border-dark-border">
        <a href="/admin" className="text-xl font-display font-extrabold text-primary-600">🌿 Blog-Ghar</a>
        <p className="text-xs text-gray-500">Admin</p>
      </div>
      <nav className="p-2 space-y-1">
        {items.map((item) => (
          <a
            key={item}
            href={`/admin${item === 'Dashboard' ? '' : item === 'Import' ? '/import' : '/' + item.toLowerCase()}`}
            className={cn(
              'block px-3 py-2 rounded-lg text-sm',
              item === 'Import' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-bg'
            )}
          >
            {item}
          </a>
        ))}
      </nav>
    </aside>
  );
}

type Toast = { type: 'success' | 'error'; message: string };

interface ImportedPost {
  id: string;
  title: string;
  status: string;
  createdAt: Date;
  slug: string;
}

export default function AdminImportPage() {
  const [content, setContent] = useState('');
  const [parsed, setParsed] = useState<ParsedContent | null>(null);
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT');
  const [featuredImage, setFeaturedImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [bulkFiles, setBulkFiles] = useState<File[]>([]);
  const [bulkResults, setBulkResults] = useState<{ file: string; parsed: ParsedContent | null; error?: string }[]>([]);
  const [recentImports, setRecentImports] = useState<ImportedPost[]>([]);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (toast) {
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(null), 4000);
    }
  }, [toast]);

  const handlePaste = useCallback((text: string) => {
    setContent(text);
    const result = parseContent(text);
    setParsed(result);
    if (!category) setCategory(result.suggestedCategory);
    if (!tags && result.tags.length > 0) setTags(result.tags.slice(0, 5).join(', '));
  }, [category, tags]);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    const valid = fileArray.filter((f) => f.name.endsWith('.txt'));
    if (valid.length === 0) {
      setToast({ type: 'error', message: 'Please select .txt files' });
      return;
    }
    setLoading(true);
    try {
      const texts = await readFiles(valid);
      const first = texts[0];
      setContent(first);
      const result = parseContent(first);
      setParsed(result);
      if (!category) setCategory(result.suggestedCategory);
      if (!tags && result.tags.length > 0) setTags(result.tags.slice(0, 5).join(', '));
      setBulkFiles(fileArray);
      setToast({ type: 'success', message: `Loaded ${valid.length} file(s). First file loaded into editor.` });
    } catch (err) {
      setToast({ type: 'error', 'Failed to read files.' });
    } finally {
      setLoading(false);
    }
  }, [category, tags]);

  const handleBulkConvert = useCallback(async () => {
    if (bulkFiles.length === 0 && !content.trim()) {
      setToast({ type: 'error', message: 'No content to convert' });
      return;
    }
    setLoading(true);
    try {
      const cat = CATEGORIES.find((c) => c.slug === category);
      const tagArr = tags.split(',').map((t) => t.trim()).filter(Boolean);

      const allFiles = bulkFiles.length > 0
        ? bulkFiles
        : [{ name: 'pasted-content.txt' } as File];

      const results: { file: string; parsed: ParsedContent | null; error?: string }[] = [];
      let successCount = 0;

      for (const file of allFiles) {
        try {
          let fileContent: string;
          if (file.text) {
            fileContent = await file.text();
          } else {
            fileContent = content;
          }
          const p = parseContent(fileContent);
          results.push({ file: file.name, parsed: p });

          const res = await fetch('/api/admin/import', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              content: fileContent.trim(),
              title: p.title,
              excerpt: p.excerpt,
              categoryId: cat?.slug || undefined,
              tags: tagArr.length > 0 ? tagArr : p.tags,
              status: status,
              featuredImage: featuredImage.trim() || undefined,
            }),
          });

          if (res.ok) {
            successCount++;
            const data = await res.json();
            setRecentImports((prev) => [
              { id: data.id, title: data.title, status: data.status, createdAt: new Date(data.createdAt), slug: data.slug },
              ...prev.slice(0, 19),
            ]);
          } else {
            const err = await res.json();
            results[results.length - 1].error = err.error || 'Failed';
          }
        } catch (err) {
          results.push({ file: file.name, parsed: null, error: 'Failed to process' });
        }
      }

      setBulkResults(results);
      if (successCount > 0) {
        setToast({ type: 'success', `Successfully imported ${successCount} post(s)` });
        setContent('');
        setParsed(null);
        setCategory('');
        setTags('');
        setFeaturedImage('');
        setBulkFiles([]);
      }
    } catch {
      setToast({ type: 'error', message: 'Bulk import failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  }, [bulkFiles, content, category, tags, status, featuredImage]);

  const handleSave = async (publish: boolean) => {
    if (!content.trim()) { setToast({ type: 'error', message: 'Content is required' }); return; }
    setLoading(true);
    try {
      const finalStatus = publish ? 'PUBLISHED' : 'DRAFT';
      const cat = CATEGORIES.find((c) => c.slug === category);
      const tagArr = tags.split(',').map((t) => t.trim()).filter(Boolean);
      const res = await fetch('/api/admin/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: content.trim(),
          title: parsed?.title || title || undefined,
          excerpt: parsed?.excerpt || undefined,
          categoryId: cat?.slug || undefined,
          tags: tagArr.length > 0 ? tagArr : parsed?.tags,
          status: finalStatus,
          featuredImage: featuredImage.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setToast({ type: 'error', message: data.error || 'Failed to save' });
      } else {
        setRecentImports((prev) => [
          { id: data.id, title: data.title, status: data.status, createdAt: new Date(data.createdAt), slug: data.slug },
          ...prev,
        ]);
        setToast({ type: 'success', message: publish ? 'Post published!' : 'Draft saved!' });
        setContent('');
        setParsed(null);
        setCategory('');
        setTags('');
        setFeaturedImage('');
      }
    } catch {
      setToast({ type: 'error', message: 'Network error.' });
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type: Toast['type'], message: string) => setToast({ type, message });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <AdminSidebar />
      <main className="ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold">Content Import</h1>
            <p className="text-gray-500 text-sm mt-1">Paste text, upload .txt files, or bulk-import content into blog posts.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleSave(false)}
              disabled={loading || !content.trim()}
              className="px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={loading || !content.trim()}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>

        {toast && (
          <div
            className={cn(
              'mb-6 px-4 py-3 rounded-lg text-sm font-medium',
              toast.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
            )}
          >
            {toast.message}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Content Input */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-4">
              <label className="block text-sm font-medium mb-2">Paste Article Content</label>
              <textarea
                value={content}
                onChange={(e) => handlePaste(e.target.value)}
                placeholder="Paste your article content here...&#10;&#10;Supports markdown:&#10;# Heading&#10;**bold** *italic*&#10;- bullet points&#10;1. numbered list&#10;[link](url)"
                className="w-full h-80 resize-none border border-gray-200 dark:border-dark-border rounded-lg dark:bg-dark-bg p-3 text-sm leading-relaxed focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* File Upload */}
            <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-4">
              <label className="block text-sm font-medium mb-2">Upload .txt Files</label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer px-4 py-2 border border-dashed border-gray-300 dark:border-dark-border rounded-lg hover:border-primary-400 text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  📄 Choose File(s)
                  <input
                    type="file"
                    accept=".txt"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                {bulkFiles.length > 0 && (
                  <span className="text-sm text-gray-500">{bulkFiles.length} file(s) selected</span>
                )}
              </div>
            </div>

            {/* Bulk Convert Section */}
            {bulkFiles.length > 0 && (
              <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-4">
                <h3 className="font-bold text-sm mb-3">Bulk Convert & Import</h3>
                <p className="text-xs text-gray-500 mb-3">{bulkFiles.length} file(s) will be processed with the same category, tags, and status.</p>
                <button
                  onClick={handleBulkConvert}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 disabled:opacity-50"
                >
                  {loading ? 'Importing...' : `Convert & Import ${bulkFiles.length} File(s)`}
                </button>
                {bulkResults.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {bulkResults.map((r, i) => (
                      <div key={i} className="flex items-center justify-between text-xs p-2 rounded bg-gray-50 dark:bg-dark-bg">
                        <span className="truncate max-w-xs">{r.file}</span>
                        {r.error ? (
                          <span className="text-red-500">{r.error}</span>
                        ) : (
                          <span className="text-green-600">{r.parsed?.title}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Preview */}
            {parsed && (
              <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-4">
                <h3 className="font-bold text-sm mb-3">Content Preview</h3>
                <div
                  className="prose prose-sm max-w-none text-sm max-h-80 overflow-y-auto p-3 bg-gray-50 dark:bg-dark-bg rounded-lg"
                  dangerouslySetInnerHTML={{ __html: parsed.content }}
                />
              </div>
            )}
          </div>

          {/* Right: Metadata */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-dark-card rounded-xl p-5 border border-gray-200 dark:border-dark-border space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-wide text-gray-500">Auto-Detected Metadata</h3>

              {parsed && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Title</label>
                    <input
                      type="text"
                      value={parsed.title}
                      onChange={(e) => setParsed({ ...parsed, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg dark:bg-dark-bg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Slug</label>
                    <input
                      type="text"
                      value={parsed.slug}
                      onChange={(e) => setParsed({ ...parsed, slug: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg dark:bg-dark-bg text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Excerpt</label>
                    <textarea
                      value={parsed.excerpt}
                      onChange={(e) => setParsed({ ...parsed, excerpt: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg dark:bg-dark-bg text-sm resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Suggested Category</label>
                    <div className="flex items-center gap-2">
                      {CATEGORIES.filter((c) => c.slug === parsed.suggestedCategory).map((c) => (
                        <span key={c.slug} className="text-xs px-2 py-1 bg-gray-100 dark:bg-dark-bg rounded">
                          {c.icon} {c.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Detected Tags</label>
                    <div className="flex flex-wrap gap-1">
                      {parsed.tags.map((t) => (
                        <span key={t} className="text-xs px-2 py-0.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>~{parsed.readTime} min read</span>
                    <span>{parsed.wordCount} words</span>
                  </div>
                </div>
              )}

              {!parsed && (
                <p className="text-sm text-gray-400">Paste content to see auto-detected metadata</p>
              )}
            </div>

            <div className="bg-white dark:bg-dark-card rounded-xl p-5 border border-gray-200 dark:border-dark-border space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-wide text-gray-500">Override Settings</h3>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg dark:bg-dark-bg text-sm"
                >
                  <option value="">Use auto-detected</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="tech, programming, tutorial"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg dark:bg-dark-bg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Featured Image URL</label>
                <input
                  type="text"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg dark:bg-dark-bg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <div className="flex gap-2">
                  {(['DRAFT', 'PUBLISHED'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(s)}
                      className={cn(
                        'flex-1 px-3 py-2 rounded-lg text-sm font-medium border',
                        status === s ? 'bg-primary-50 border-primary-200 text-primary-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Imports */}
            {recentImports.length > 0 && (
              <div className="bg-white dark:bg-dark-card rounded-xl p-5 border border-gray-200 dark:border-dark-border">
                <h3 className="font-bold text-sm mb-3">Recently Imported</h3>
                <div className="space-y-2">
                  {recentImports.map((post) => (
                    <a key={post.id} href={`/blog/${post.slug}`} target="_blank" rel="noopener" className="block p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
                      <p className="text-sm font-medium truncate">{post.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={cn('text-xs px-2 py-0.5 rounded-full', post.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600')}>
                          {post.status}
                        </span>
                        <span className="text-xs text-gray-400">{post.createdAt.toLocaleDateString()}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
