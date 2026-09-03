'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Eye, Send, Image as ImageIcon, Tag, Settings, FileText, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { parseContent, generateSlug, generateExcerpt, type ParsedContent } from '@/lib/content-parser';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

export default function NewPostPage({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [rawText, setRawText] = useState('');
  const [parsed, setParsed] = useState<ParsedContent | null>(null);
  const [activeTab, setActiveTab] = useState<'write' | 'raw'>('write');

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    categoryId: '',
    tags: '',
    status: 'DRAFT' as 'DRAFT' | 'PUBLISHED',
    postType: 'BLOG' as 'BLOG' | 'NEWS',
  });

  const handleRawTextChange = useCallback((text: string) => {
    setRawText(text);
    if (text.trim().length > 50) {
      const result = parseContent(text);
      setParsed(result);
      if (!form.title) {
        setForm(f => ({ ...f, title: result.title, slug: result.slug, excerpt: result.excerpt, content: result.content, categoryId: result.suggestedCategory }));
      }
    }
  }, [form.title]);

  const handleTitleChange = (title: string) => {
    setForm(f => ({
      ...f,
      title,
      slug: f.slug && !f._slugManuallyEdited ? f.slug : generateSlug(title),
    }));
  };

  const handleSubmit = async (status: 'DRAFT' | 'PUBLISHED') => {
    if (!form.title.trim() || !form.content.trim()) {
      setMessage({ type: 'error', text: 'Please fill in title and content' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          status,
          excerpt: form.excerpt || generateExcerpt(form.content),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');

      setMessage({ type: 'success', text: status === 'PUBLISHED' ? 'Post published successfully!' : 'Draft saved!' });
      if (status === 'PUBLISHED') {
        setTimeout(() => router.push('/blog'), 1500);
      }
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Something went wrong' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-extrabold">New Post</h1>
          <p className="text-gray-500 mt-1">Create a new blog post or news article</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowPreview(!showPreview)} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
            <Eye className="w-4 h-4" /> Preview
          </button>
          <button onClick={() => handleSubmit('DRAFT')} disabled={isSubmitting} className="flex items-center gap-2 px-4 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 text-sm font-medium">
            <Save className="w-4 h-4" /> Save Draft
          </button>
          <button onClick={() => handleSubmit('PUBLISHED')} disabled={isSubmitting} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium">
            <Send className="w-4 h-4" /> Publish
          </button>
        </div>
      </div>

      {message && (
        <div className={cn('mb-6 p-4 rounded-xl text-sm font-medium', message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
          {message.text}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tab Switcher */}
          <div className="flex border-b border-gray-200">
            <button onClick={() => setActiveTab('write')} className={cn('px-4 py-2 text-sm font-medium border-b-2 transition-colors', activeTab === 'write' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500')}>
              ✍️ Write
            </button>
            <button onClick={() => setActiveTab('raw')} className={cn('px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-1', activeTab === 'raw' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500')}>
              <Sparkles className="w-4 h-4" /> Smart Import
            </button>
          </div>

          {activeTab === 'write' ? (
            <>
              {/* Title */}
              <div>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => handleTitleChange(e.target.value)}
                  placeholder="Enter post title..."
                  className="w-full text-2xl font-display font-bold px-4 py-3 border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-card"
                />
              </div>

              {/* Content */}
              <div>
                <textarea
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  placeholder="Write your content here... Supports HTML tags like <p>, <h2>, <strong>, <ul>, <li>"
                  rows={20}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm leading-relaxed bg-white dark:bg-dark-card resize-y"
                />
                <p className="text-xs text-gray-400 mt-1">Supports HTML: &lt;p&gt;, &lt;h2&gt;, &lt;h3&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;blockquote&gt;</p>
              </div>
            </>
          ) : (
            <div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 rounded-xl p-4 mb-4">
                <p className="text-sm text-blue-700">
                  💡 Paste your article text below. The system will auto-extract the title, excerpt, suggest a category, and convert to HTML.
                </p>
              </div>
              <textarea
                value={rawText}
                onChange={e => handleRawTextChange(e.target.value)}
                placeholder="Paste your article here...

Example:
# My Article Title

This is the first paragraph of my article. It introduces the main topic...

## Section Heading

This is a section with more details. You can write multiple paragraphs.

- Bullet point one
- Bullet point two

> This is a quote

**Bold text** and *italic text* are supported."
                rows={20}
                className="w-full px-4 py-3 border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm leading-relaxed bg-white dark:bg-dark-card resize-y"
              />
              {parsed && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-xl">
                  <h3 className="text-sm font-bold text-green-700 mb-2">✨ Auto-detected:</h3>
                  <div className="text-sm text-green-600 space-y-1">
                    <p><strong>Title:</strong> {parsed.title}</p>
                    <p><strong>Category:</strong> {parsed.suggestedCategory} (auto-detected)</p>
                    <p><strong>Read Time:</strong> {parsed.readTime} min</p>
                    <p><strong>Words:</strong> {parsed.wordCount}</p>
                    {parsed.tags.length > 0 && <p><strong>Tags:</strong> {parsed.tags.join(', ')}</p>}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
            <textarea
              value={form.excerpt}
              onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
              placeholder="Brief description of the post..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white dark:bg-dark-card resize-y"
            />
            <p className="text-xs text-gray-400 mt-1">{form.excerpt.length}/300 characters</p>
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={form.featuredImage}
                onChange={e => setForm(f => ({ ...f, featuredImage: e.target.value }))}
                placeholder="https://example.com/image.jpg"
                className="flex-1 px-4 py-2 border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white dark:bg-dark-card"
              />
              {form.featuredImage && (
                <img src={form.featuredImage} alt="Preview" className="w-16 h-16 rounded-lg object-cover border" />
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Post Settings */}
          <div className="card p-5">
            <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4" /> Post Settings
            </h3>

            <div className="space-y-4">
              {/* Type */}
              <div>
                <label className="block text-sm font-medium mb-1">Post Type</label>
                <select
                  value={form.postType}
                  onChange={e => setForm(f => ({ ...f, postType: e.target.value as 'BLOG' | 'NEWS' }))}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-dark-border rounded-lg text-sm bg-white dark:bg-dark-card"
                >
                  <option value="BLOG">📝 Blog Post</option>
                  <option value="NEWS">📰 News Article</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value as 'DRAFT' | 'PUBLISHED' }))}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-dark-border rounded-lg text-sm bg-white dark:bg-dark-card"
                >
                  <option value="DRAFT">📋 Draft</option>
                  <option value="PUBLISHED">✅ Published</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={form.categoryId}
                  onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-dark-border rounded-lg text-sm bg-white dark:bg-dark-card"
                >
                  <option value="">Select category...</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" /> Tags
                </label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                  placeholder="AI, Tutorial, Tips (comma separated)"
                  className="w-full px-3 py-2 border border-gray-200 dark:border-dark-border rounded-lg text-sm bg-white dark:bg-dark-card"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium mb-1">URL Slug</label>
                <div className="flex items-center">
                  <span className="text-xs text-gray-400 mr-2 shrink-0">/blog/</span>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={e => setForm(f => ({ ...f, slug: e.target.value, _slugManuallyEdited: true }))}
                    placeholder="my-post-title"
                    className="flex-1 px-3 py-2 border border-gray-200 dark:border-dark-border rounded-lg text-sm bg-white dark:bg-dark-card"
                  />
                </div>
              </div>

              {/* Word Count */}
              {form.content && (
                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                  <span>Words: {form.content.split(/\s+/).filter(Boolean).length}</span>
                  <span>Read time: ~{Math.max(1, Math.ceil(form.content.split(/\s+/).filter(Boolean).length / 200))} min</span>
                </div>
              )}
            </div>
          </div>

          {/* SEO */}
          <div className="card p-5">
            <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-4">🔍 SEO</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">SEO Title</label>
                <input
                  type="text"
                  value={form.title}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-gray-50 text-gray-600"
                />
                <p className="text-xs text-gray-400 mt-1">Uses post title ({form.title.length}/60 chars)</p>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Meta Description</label>
                <textarea
                  value={form.excerpt}
                  onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                  placeholder="Auto-generated from excerpt..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-dark-border rounded-lg text-xs bg-white dark:bg-dark-card"
                />
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="card p-5 bg-blue-50 dark:bg-blue-900/10">
            <h3 className="font-bold text-sm text-blue-700 mb-2">💡 Quick Tips</h3>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>• Use # for headings, ** for bold</li>
              <li>• Use - for bullet points</li>
              <li>• Add images with ![alt](url)</li>
              <li>• Smart Import auto-formats text</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
