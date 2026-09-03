'use client';

import { useState, useEffect, useRef } from 'react';
import { Sparkles, Loader2, CheckCircle, AlertCircle, FileText, Upload, X } from 'lucide-react';
import { create } from 'zustand';

type ImpStep = 'input' | 'processing' | 'review' | 'done';

interface BlogImportStore {
  step: ImpStep;
  rawContent: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string;
  status: string;
  setStep: (s: ImpStep) => void;
  setRawContent: (c: string) => void;
  setTitle: (t: string) => void;
  setSlug: (s: string) => void;
  setExcerpt: (e: string) => void;
  setCategory: (c: string) => void;
  setTags: (t: string) => void;
  setStatus: (s: string) => void;
  reset: () => void;
}

const useBlogImportStore = create<BlogImportStore>((set) => ({
  step: 'input',
  rawContent: '',
  title: '',
  slug: '',
  excerpt: '',
  category: 'technology',
  tags: '',
  status: 'PUBLISHED',
  setStep: (step) => set({ step }),
  setRawContent: (rawContent) => set({ rawContent }),
  setTitle: (title) => set({ title }),
  setSlug: (slug) => set({ slug }),
  setExcerpt: (excerpt) => set({ excerpt }),
  setCategory: (category) => set({ category }),
  setTags: (tags) => set({ tags }),
  setStatus: (status) => set({ status }),
  reset: () => set({ step: 'input', rawContent: '', title: '', slug: '', excerpt: '', category: 'technology', tags: '', status: 'PUBLISHED' }),
}));

export default function BlogImporter() {
  const {
    step, rawContent, title, slug, excerpt, category, tags, status,
    setStep, setRawContent, setTitle, setSlug, setExcerpt, setCategory, setTags, setStatus, reset,
  } = useBlogImportStore();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const generateSlug = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setRawContent(text);
  };

  const handleParse = () => {
    if (!rawContent.trim()) return;
    setLoading(true);
    setStep('processing');

    setTimeout(() => {
      const lines = rawContent.split('\n').filter(l => l.trim());
      const firstLine = lines[0]?.trim() || '';

      let detectedTitle = firstLine.replace(/^#+\s*/, '').trim();
      let bodyStart = 0;

      if (firstLine.startsWith('#')) {
        bodyStart = 1;
      } else if (firstLine.length > 10 && !firstLine.startsWith('---')) {
        detectedTitle = firstLine.slice(0, 80);
        bodyStart = 1;
      }

      while (bodyStart < lines.length && lines[bodyStart].startsWith('---')) {
        bodyStart++;
      }

      const body = lines.slice(bodyStart).join('\n').trim();
      const autoSlug = generateSlug(detectedTitle);
      const autoExcerpt = body.slice(0, 200).replace(/[#*_]/g, '').trim() + (body.length > 200 ? '...' : '');

      const categoryKeywords: Record<string, string[]> = {
        'technology': ['tech', 'ai', 'software', 'code', 'programming', 'web', 'app', 'computer', 'digital'],
        'finance': ['money', 'invest', 'stock', 'crypto', 'bank', 'tax', 'saving', 'financial'],
        'health': ['health', 'fitness', 'diet', 'exercise', 'medical', 'wellness', 'mental'],
        'education': ['learn', 'study', 'education', 'course', 'exam', 'college', 'student'],
        'lifestyle': ['lifestyle', 'fashion', 'travel', 'food', 'recipe', 'style', 'trend'],
        'sports': ['sport', 'cricket', 'football', 'match', 'player', 'team', 'score'],
        'science': ['science', 'research', 'space', 'discovery', 'experiment', 'planet'],
        'entertainment': ['movie', 'music', 'celebrity', 'film', 'actor', 'show', 'netflix'],
      };

      let detectedCategory = 'technology';
      const lowerContent = rawContent.toLowerCase();
      for (const [cat, keywords] of Object.entries(categoryKeywords)) {
        if (keywords.some(kw => lowerContent.includes(kw))) {
          detectedCategory = cat;
          break;
        }
      }

      setTitle(detectedTitle || 'Untitled Post');
      setSlug(autoSlug || 'untitled-post');
      setExcerpt(autoExcerpt || detectedTitle);
      setCategory(detectedCategory);
      setTags(detectedCategory);
      setStep('review');
      setLoading(false);
    }, 600);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: rawContent,
          title,
          slug,
          excerpt,
          categoryId: category,
          status,
          postType: 'BLOG',
        }),
      });

      if (res.ok) {
        setResult({ success: true, message: `Blog post "${title}" published successfully!` });
        setStep('done');
      } else {
        const data = await res.json().catch(() => ({}));
        setResult({ success: false, message: data.error || 'Failed to publish. Please try again.' });
      }
    } catch {
      setResult({ success: false, message: 'Network error. Please check your connection.' });
    }
    setLoading(false);
  };

  const resetAll = () => {
    reset();
    setResult(null);
  };

  const steps = [
    { id: 'input', label: 'Content', icon: FileText },
    { id: 'review', label: 'Review', icon: Sparkles },
    { id: 'done', label: 'Done', icon: CheckCircle },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xl shadow-lg">
          📝
        </div>
        <div>
          <h1 className="text-2xl font-display font-extrabold text-gray-900 dark:text-white">
            Blog Importer
          </h1>
          <p className="text-sm text-gray-500">Paste content or upload a file to create a blog post instantly</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map(({ id, label, icon: Icon }, i) => (
          <div key={id} className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all
              ${step === id ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' :
                steps.findIndex(s => s.id === step) > i ?
                'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
              <Icon className="w-3.5 h-3.5" />
              {label}
            </div>
            {i < steps.length - 1 && <div className="w-4 h-px bg-gray-200" />}
          </div>
        ))}
      </div>

      {result && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${result.success ? 'bg-green-50 dark:bg-green-900/20 text-green-700' : 'bg-red-50 dark:bg-red-900/20 text-red-700'}`}>
          {result.success ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p className="text-sm font-medium">{result.message}</p>
          {result.success && (
            <a href="/admin/posts" className="ml-auto text-xs underline font-medium">View Posts →</a>
          )}
        </div>
      )}

      {step === 'input' && (
        <div className="space-y-4">
          <div className="card p-1">
            <textarea
              value={rawContent}
              onChange={(e) => setRawContent(e.target.value)}
              placeholder="Paste your blog content here...

Supports plain text, Markdown, or any format. Our AI will:
• Auto-detect the title
• Generate a URL slug
• Write an excerpt
• Detect the category
• Suggest tags

Example:
# How to Build a Successful Blog in 2026

Starting a blog is one of the best ways..."
              className="w-full h-80 p-4 rounded-xl bg-transparent text-sm leading-relaxed resize-none focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <p className="text-xs text-gray-400">
                {rawContent.length > 0 ? `${rawContent.length} characters` : 'Paste your content above'}
              </p>
              <input ref={fileRef} type="file" accept=".txt,.md,.html" onChange={handleFileUpload} className="hidden" />
              <button onClick={() => fileRef.current?.click()} className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                <Upload className="w-3 h-3" /> Upload .txt/.md file
              </button>
            </div>
            <button
              onClick={handleParse}
              disabled={!rawContent.trim() || loading}
              className="px-6 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? 'Analyzing...' : 'Parse & Continue →'}
            </button>
          </div>
        </div>
      )}

      {step === 'review' && (
        <div className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">URL Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(generateSlug(e.target.value))}
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-sm font-mono focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Excerpt / Meta Description</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="w-full p-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none resize-none"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
              >
                {['technology', 'lifestyle', 'education', 'finance', 'entertainment', 'health', 'travel', 'food', 'sports', 'science'].map(c => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Tags (comma-separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="ai, tutorial, beginner"
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Publish Status</label>
            <div className="flex gap-2">
              {['PUBLISHED', 'DRAFT'].map(s => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${status === s ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-dark-bg text-gray-600'}`}
                >
                  {s === 'PUBLISHED' ? '✅ Publish Now' : '📋 Save as Draft'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Content Preview</label>
            <div className="card p-4 max-h-64 overflow-y-auto">
              <div className="prose dark:prose-invert prose-sm max-w-none">
                {rawContent.split('\n').slice(0, 30).map((line, i) => (
                  <p key={i} className={line.startsWith('#') ? 'font-bold text-lg text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400 text-xs'}>
                    {line || ' '}
                  </p>
                ))}
                {rawContent.split('\n').length > 30 && <p className="text-xs text-gray-400 mt-2">... and {rawContent.split('\n').length - 30} more lines</p>}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setStep('input')} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
              ← Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !title || !slug}
              className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {loading ? 'Publishing...' : status === 'PUBLISHED' ? '🚀 Publish Post' : '💾 Save Draft'}
            </button>
          </div>
        </div>
      )}

      {step === 'done' && (
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-4xl animate-bounce">
            {result?.success ? '🎉' : '😅'}
          </div>
          <h3 className="text-xl font-display font-bold mb-2">
            {result?.success ? 'Post Published!' : 'Something went wrong'}
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">{result?.message}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={resetAll} className="px-6 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700">
              Import Another Post
            </button>
            <a href="/admin/posts" className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">
              View All Posts
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
