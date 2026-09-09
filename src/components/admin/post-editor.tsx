'use client';

import { useState, useEffect, useCallback, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, Save, Send, Tag, Settings, Sparkles, Trash2, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { parseContent, generateSlug, generateExcerpt, type ParsedContent } from '@/lib/content-parser';
import CustomBlogFrame from '@/components/blog/custom-blog-frame';

export type FormData = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  categoryId: string;
  tags: string;
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED';
  postType: 'BLOG' | 'NEWS';
  format: 'STANDARD' | 'CUSTOM_CODE';
  customHtml: string;
  customCss: string;
  customJs: string;
  seoTitle: string;
  seoDesc: string;
  canonicalUrl: string;
  ogImage: string;
  isFeatured: boolean;
  faqs: string;
  relatedIds: string;
};

export const TABS = [
  { id: 'write' as const, label: 'Write' },
  { id: 'raw' as const, label: 'Smart Import' },
  { id: 'custom-code' as const, label: 'Custom Code' },
  { id: 'faqs' as const, label: 'FAQs' },
  { id: 'related' as const, label: 'Related' },
];

export const INITIAL_FORM: FormData = {
  id: '',
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  featuredImage: '',
  categoryId: '',
  tags: '',
  status: 'DRAFT',
  postType: 'BLOG',
  format: 'STANDARD',
  customHtml: '',
  customCss: '',
  customJs: '',
  seoTitle: '',
  seoDesc: '',
  canonicalUrl: '',
  ogImage: '',
  isFeatured: false,
  faqs: '',
  relatedIds: '',
};

type PostEditorProps = {
  initialPostId?: string;
  categories: { id: string; name: string; slug: string; icon: string }[];
};

export default function PostEditor({ initialPostId, categories }: PostEditorProps) {
  const router = useRouter();
  const isNew = !initialPostId || initialPostId === 'new';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState<'write' | 'raw' | 'custom-code' | 'faqs' | 'related'>('write');
  const [loading, setLoading] = useState(!isNew);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [rawText, setRawText] = useState('');
  const [parsed, setParsed] = useState<ParsedContent | null>(null);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const autosaveTimer = useRef<ReturnType<typeof setTimeout>>();

  // Autosave to localStorage every 3 seconds of inactivity
  useEffect(() => {
    if (isNew && form.title) {
      clearTimeout(autosaveTimer.current);
      setSaveStatus('saving');
      autosaveTimer.current = setTimeout(() => {
        try {
          const drafts = JSON.parse(localStorage.getItem('blog-drafts') || '[]');
          const existing = drafts.findIndex((d: any) => d.title === form.title);
          const entry = { ...form, savedAt: Date.now() };
          if (existing >= 0) drafts[existing] = entry; else drafts.unshift(entry);
          localStorage.setItem('blog-drafts', JSON.stringify(drafts.slice(0, 10)));
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus('idle'), 3000);
        } catch {
          setSaveStatus('error');
          setTimeout(() => setSaveStatus('idle'), 5000);
        }
      }, 3000);
    }
    return () => clearTimeout(autosaveTimer.current);
  }, [form, isNew]);

  // Load existing post
  useEffect(() => {
    if (isNew) { setLoading(false); return; }
    fetch(`/api/blogs/${initialPostId}`)
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        const post = data.post || data;
        setForm({
          ...INITIAL_FORM,
          id: post.id || initialPostId,
          title: post.title || '',
          slug: post.slug || '',
          excerpt: post.excerpt || '',
          content: post.content || '',
          featuredImage: post.featuredImage || '',
          categoryId: post.categoryId || '',
          tags: post.tags?.name || post.tags || '',
          status: post.status || 'DRAFT',
          postType: post.postType || 'BLOG',
          format: post.format || 'STANDARD',
          customHtml: post.customHtml || '',
          customCss: post.customCss || '',
          customJs: post.customJs || '',
          seoTitle: post.seoTitle || '',
          seoDesc: post.seoDesc || '',
          canonicalUrl: post.canonicalUrl || '',
          ogImage: post.ogImage || '',
          isFeatured: post.isFeatured || false,
          faqs: post.faqs || '',
          relatedIds: post.relatedIds || '',
        });
        setSlugManuallyEdited(true);
        setLoading(false);
      })
      .catch(() => { setLoading(false); });
  }, [isNew, initialPostId]);

  const updateForm = useCallback((updater: (f: FormData) => FormData) => {
    setForm(prev => updater(prev));
  }, []);

  const handleTitleChange = useCallback((title: string) => {
    setForm(prev => ({
      ...prev,
      title,
      slug: slugManuallyEdited && prev.slug ? prev.slug : generateSlug(title),
      seoTitle: prev.seoTitle || title,
    }));
  }, [slugManuallyEdited]);

  const handleSubmit = useCallback(async (status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') => {
    if (!form.title.trim() || (!form.content.trim() && form.format !== 'CUSTOM_CODE')) {
      setMessage({ type: 'error', text: 'Please fill in title and content' });
      return;
    }
    setIsSubmitting(true);
    setMessage(null);
    try {
      const url = isNew ? '/api/blogs' : `/api/blogs/${form.id}`;
      const method = isNew ? 'POST' : 'PUT';
      const body = isNew
        ? { ...form, status, excerpt: form.excerpt || generateExcerpt(form.content), id: undefined }
        : { ...form, status };
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');
      setMessage({ type: 'success', text: isNew
        ? (status === 'PUBLISHED' ? 'Post published!' : 'Draft saved!')
        : 'Post updated!' });
      if (isNew && status === 'PUBLISHED') {
        setTimeout(() => router.push('/blog'), 1500);
      }
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Something went wrong' });
    } finally {
      setIsSubmitting(false);
    }
  }, [form, isNew, router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin w-8 h-8 border-4 border-primary-600 rounded-full border-t-transparent" /></div>;
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-display font-extrabold">{isNew ? 'New Post' : 'Edit Post'}</h1>
            <SaveStatus status={saveStatus} />
          </div>
          <p className="text-gray-500 mt-1">
            {isNew ? 'Create a new blog post or news article' : `Editing: ${form.title || 'Untitled'}`}
            {form.format === 'CUSTOM_CODE' && <span className="ml-2 text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">CUSTOM CODE</span>}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            <button onClick={() => { setShowPreview(true); setPreviewMode('desktop'); }} className={`px-3 py-2 text-sm font-medium ${showPreview && previewMode === 'desktop' ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'}`} title="Desktop preview">🖥️</button>
            <button onClick={() => { setShowPreview(true); setPreviewMode('mobile'); }} className={`px-3 py-2 text-sm font-medium ${showPreview && previewMode === 'mobile' ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'}`} title="Mobile preview">📱</button>
          </div>
          <button onClick={() => setShowPreview(!showPreview)} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
            <Eye className="w-4 h-4" /> {showPreview ? 'Hide' : 'Preview'}
          </button>
          <button onClick={() => handleSubmit('DRAFT')} disabled={isSubmitting} className="flex items-center gap-2 px-4 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 text-sm font-medium">
            <Save className="w-4 h-4" /> Save Draft
          </button>
          <button onClick={() => handleSubmit('PUBLISHED')} disabled={isSubmitting} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium">
            <Send className="w-4 h-4" /> Publish
          </button>
          {!isNew && (
            <button onClick={() => {
              if (confirm('Delete this post?')) {
                fetch(`/api/blogs/${form.id}`, { method: 'DELETE' }).then(() => router.push('/profile/posts'));
              }
            }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {message && (
        <div className={cn('mb-6 p-4 rounded-xl text-sm font-medium', message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
          {message.text}
        </div>
      )}

      {/* Preview */}
      {showPreview && (
        <div className="mb-6">
          <h3 className="font-bold text-sm mb-3 text-gray-500 uppercase tracking-wide">Live Preview</h3>
          {form.format === 'CUSTOM_CODE' ? (
            <div className="card p-6 rounded-xl border border-gray-200 dark:border-dark-border">
              <CustomBlogFrame customHtml={form.customHtml} customCss={form.customCss} customJs={form.customJs} />
            </div>
          ) : (
            <div className={`card rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden ${previewMode === 'mobile' ? 'max-w-[375px] mx-auto' : ''}`}>
              <div className="p-6 md:p-8">
                <div className="mb-6">
                  <h1 className="text-2xl md:text-4xl font-display font-extrabold text-gray-900 dark:text-white mb-3">{form.title || 'Untitled'}</h1>
                  {form.excerpt && <p className="text-gray-600 dark:text-gray-400 text-lg">{form.excerpt}</p>}
                </div>
                {form.featuredImage && (
                  <img src={form.featuredImage} alt="" className="w-full h-64 object-cover rounded-xl mb-8" />
                )}
                {form.content ? (
                  <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: form.content }} />
                ) : (
                  <p className="text-gray-400 italic">No content yet. Start writing to see preview.</p>
                )}
                {form.faqs && (
                  <div className="mt-12 pt-8 border-t border-gray-200 dark:border-dark-border">
                    <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                      {JSON.parse(form.faqs).map((faq: any, i: number) => (
                        <div key={i} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{faq.question}</h3>
                          <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Format Toggle */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Content Format</label>
        <div className="flex gap-3">
          {[
            { value: 'STANDARD', label: 'Standard Blog', desc: 'Rich text editor' },
            { value: 'CUSTOM_CODE', label: 'Custom Code', desc: 'HTML/CSS/JS with sandbox' },
          ].map(opt => (
            <button key={opt.value} type="button" onClick={() => updateForm(f => ({ ...f, format: opt.value as 'STANDARD' | 'CUSTOM_CODE' }))}
              className={cn('flex-1 p-4 rounded-xl border-2 text-left transition-colors', form.format === opt.value ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300')}>
              <p className="font-medium text-sm">{opt.label}</p>
              <p className="text-xs text-gray-500">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {form.format === 'CUSTOM_CODE' ? (
            <CustomCodeEditor form={form} updateForm={updateForm} />
          ) : (
            <>
              <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
                {TABS.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={cn('px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap', activeTab === tab.id ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500')}>
                    {tab.id === 'raw' ? <><Sparkles className="w-3.5 h-3.5 inline mr-1" />{tab.label}</> : tab.label}
                  </button>
                ))}
              </div>
              {activeTab === 'write' ? (
                <div>
                  <input type="text" value={form.title} onChange={e => handleTitleChange(e.target.value)} placeholder="Enter post title..."
                    className="w-full text-2xl font-display font-bold px-4 py-3 border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-card mb-4" />
                  <textarea value={form.content} onChange={e => updateForm(f => ({ ...f, content: e.target.value }))}
                    placeholder="Write your content... Use HTML or Markdown"
                    rows={20}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm leading-relaxed bg-white dark:bg-dark-card resize-y" />
                  <p className="text-xs text-gray-400 mt-1">Supports HTML and Markdown: p, h2, h3, strong, em, ul, li, blockquote, img, table</p>
                </div>
              ) : activeTab === 'raw' ? (
                <SmartImport rawText={rawText} setRawText={setRawText} parsed={parsed} setParsed={setParsed} form={form} updateForm={updateForm} categories={categories} />
              ) : activeTab === 'faqs' ? (
                <FaqEditor faqs={form.faqs} setFaqs={v => updateForm(f => ({ ...f, faqs: v }))} />
              ) : (
                <RelatedEditor relatedIds={form.relatedIds} setRelatedIds={v => updateForm(f => ({ ...f, relatedIds: v }))} />
              )}
            </>
          )}
        </div>
        <div className="space-y-6">
          <PostSettingsPanel form={form} updateForm={updateForm} categories={categories} setSlugManuallyEdited={setSlugManuallyEdited} />
          <SeoPanel form={form} updateForm={updateForm} />
        </div>
      </div>
    </>
  );
}

// ──────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────

function CustomCodeEditor({ form, updateForm }: { form: FormData; updateForm: (u: (f: FormData) => FormData) => void }) {
  const [activeEditor, setActiveEditor] = useState<'html' | 'css' | 'js'>('html');
  return (
    <div>
      <div className="flex border-b border-gray-200 mb-4">
        {(['html', 'css', 'js'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveEditor(tab)} className={cn('px-4 py-2 text-sm font-medium border-b-2 uppercase', activeEditor === tab ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500')}>{tab}</button>
        ))}
      </div>
      {activeEditor === 'html' && (
        <div>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 mb-3 text-xs text-purple-700">Custom HTML replaces the standard article renderer. Sanitized server-side.</div>
          <textarea value={form.customHtml} onChange={e => updateForm(f => ({ ...f, customHtml: e.target.value }))} placeholder="<div>Your custom HTML here...</div>" rows={18} className="w-full px-4 py-3 border border-gray-200 rounded-xl font-mono text-sm leading-relaxed bg-white dark:bg-dark-card resize-y" />
        </div>
      )}
      {activeEditor === 'css' && (
        <div>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 mb-3 text-xs text-purple-700">CSS is scoped to this blog post and cannot leak.</div>
          <textarea value={form.customCss} onChange={e => updateForm(f => ({ ...f, customCss: e.target.value }))} placeholder="/* Scoped CSS */" rows={18} className="w-full px-4 py-3 border border-gray-200 rounded-xl font-mono text-sm leading-relaxed bg-white dark:bg-dark-card resize-y" />
        </div>
      )}
      {activeEditor === 'js' && (
        <div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-3 text-xs text-yellow-700">JavaScript runs in a sandboxed iframe and cannot access the main page, cookies, or localStorage.</div>
          <textarea value={form.customJs} onChange={e => updateForm(f => ({ ...f, customJs: e.target.value }))} placeholder="// Sandboxed JavaScript" rows={18} className="w-full px-4 py-3 border border-gray-200 rounded-xl font-mono text-sm leading-relaxed bg-white dark:bg-dark-card resize-y" />
        </div>
      )}
    </div>
  );
}

function SmartImport({ rawText, setRawText, parsed, setParsed, form, updateForm, categories }: {
  rawText: string; setRawText: (v: string) => void; parsed: ParsedContent | null; setParsed: (p: ParsedContent | null) => void; form: FormData; updateForm: (u: (f: FormData) => FormData) => void; categories: { id: string; name: string; icon: string }[];
}) {
  return (
    <div>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 text-sm text-blue-700">Paste article text. The system auto-extracts title, excerpt, suggests a category, and converts to HTML.</div>
      <textarea value={rawText} onChange={e => { setRawText(e.target.value); if (e.target.value.trim().length > 50) { const r = parseContent(e.target.value); setParsed(r); } }} placeholder="Paste your article here..." rows={20} className="w-full px-4 py-3 border border-gray-200 rounded-xl font-mono text-sm leading-relaxed bg-white dark:bg-dark-card resize-y" />
      {parsed && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-sm font-bold text-green-700 mb-2">Auto-detected:</p>
          <div className="text-sm text-green-600 space-y-1">
            <p><strong>Title:</strong> {parsed.title}</p>
            <p><strong>Category:</strong> {parsed.suggestedCategory}</p>
            <p><strong>Read Time:</strong> {parsed.readTime} min</p>
            <p><strong>Words:</strong> {parsed.wordCount}</p>
          </div>
          <button onClick={() => updateForm(f => ({ ...f, title: parsed.title, excerpt: parsed.excerpt, content: parsed.content }))} className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">Apply to Form</button>
        </div>
      )}
    </div>
  );
}

function FaqEditor({ faqs, setFaqs }: { faqs: string; setFaqs: (val: string) => void }) {
  const initial = (() => { try { const p = JSON.parse(faqs || '[]'); return Array.isArray(p) ? p : []; } catch { return []; } })();
  const [items, setItems] = useState<{ q: string; a: string }[]>(initial);
  const update = (next: { q: string; a: string }[]) => { setItems(next); setFaqs(JSON.stringify(next)); };
  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">Add FAQs. These render as expandable sections and generate FAQPage structured data.</p>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-2">
            <input value={item.q} onChange={e => update(items.map((x, j) => j === i ? { ...x, q: e.target.value } : x))} placeholder="Question?" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            <textarea value={item.a} onChange={e => update(items.map((x, j) => j === i ? { ...x, a: e.target.value } : x))} placeholder="Answer..." rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-y" />
            <button onClick={() => update(items.filter((_, j) => j !== i))} className="text-xs text-red-600">Remove</button>
          </div>
        ))}
        <button onClick={() => update([...items, { q: '', a: '' }])} className="text-sm text-primary-600 font-medium">+ Add FAQ</button>
      </div>
    </div>
  );
}

function RelatedEditor({ relatedIds, setRelatedIds }: { relatedIds: string; setRelatedIds: (val: string) => void }) {
  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">Link related posts by slug (comma-separated).</p>
      <input type="text" value={relatedIds} onChange={e => setRelatedIds(e.target.value)} placeholder="my-other-post, another-slug" className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm" />
    </div>
  );
}

function PostSettingsPanel({ form, updateForm, categories, setSlugManuallyEdited }: {
  form: FormData; updateForm: (u: (f: FormData) => FormData) => void; categories: { id: string; name: string; icon: string }[]; setSlugManuallyEdited: (v: boolean) => void;
}) {
  return (
    <div className="card p-5">
      <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2"><Settings className="w-4 h-4" /> Post Settings</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select value={form.postType} onChange={e => updateForm(f => ({ ...f, postType: e.target.value as 'BLOG' | 'NEWS' }))} className="w-full px-3 py-2 border border-gray-200 dark:border-dark-border rounded-lg text-sm bg-white dark:bg-dark-card">
            <option value="BLOG">Blog Post</option><option value="NEWS">News Article</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select value={form.status} onChange={e => updateForm(f => ({ ...f, status: e.target.value as FormData['status'] }))} className="w-full px-3 py-2 border border-gray-200 dark:border-dark-border rounded-lg text-sm bg-white dark:bg-dark-card">
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="SCHEDULED">Schedule for later</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select value={form.categoryId} onChange={e => updateForm(f => ({ ...f, categoryId: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 dark:border-dark-border rounded-lg text-sm bg-white dark:bg-dark-card">
            <option value="">Select...</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1"><Tag className="w-3.5 h-3.5 inline mr-1" /> Tags</label>
          <input type="text" value={form.tags} onChange={e => updateForm(f => ({ ...f, tags: e.target.value }))} placeholder="tag1, tag2" className="w-full px-3 py-2 border border-gray-200 dark:border-dark-border rounded-lg text-sm bg-white dark:bg-dark-card" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">URL Slug</label>
          <div className="flex items-center">
            <span className="text-xs text-gray-400 mr-2 shrink-0">/blog/</span>
            <input type="text" value={form.slug} onChange={e => { setSlugManuallyEdited(true); updateForm(f => ({ ...f, slug: e.target.value })); }} className="flex-1 px-3 py-2 border border-gray-200 dark:border-dark-border rounded-lg text-sm bg-white dark:bg-dark-card" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Featured Image URL</label>
          <div className="flex gap-3">
            <input type="text" value={form.featuredImage} onChange={e => updateForm(f => ({ ...f, featuredImage: e.target.value }))} placeholder="https://..." className="flex-1 px-3 py-2 border border-gray-200 dark:border-dark-border rounded-lg text-sm bg-white dark:bg-dark-card" />
            {form.featuredImage && <img src={form.featuredImage} alt="" className="w-12 h-12 rounded-lg object-cover border" />}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Open Graph Image</label>
          <input type="text" value={form.ogImage} onChange={e => updateForm(f => ({ ...f, ogImage: e.target.value }))} placeholder="https://..." className="w-full px-3 py-2 border border-gray-200 dark:border-dark-border rounded-lg text-sm bg-white dark:bg-dark-card" />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.isFeatured} onChange={e => updateForm(f => ({ ...f, isFeatured: e.target.checked }))} className="w-4 h-4 accent-primary-600" />
          <span className="text-sm">Featured post</span>
        </label>
      </div>
    </div>
  );
}

function SaveStatus({ status }: { status: 'idle' | 'saving' | 'saved' | 'error' }) {
  if (status === 'idle') return null;
  const config = {
    saving: { label: 'Saving...', className: 'text-yellow-600 animate-pulse' },
    saved: { label: 'Saved', className: 'text-green-600' },
    error: { label: 'Save failed', className: 'text-red-600' },
  }[status];
  return (
    <span className={`text-xs font-medium ${config.className}`} title="Autosave status">
      {status === 'saving' && <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />}
      {status === 'saved' && <span className="mr-1">✓</span>}
      {status === 'error' && <span className="mr-1">⚠</span>}
      {config.label}
    </span>
  );
}

function SeoPanel({ form, updateForm }: { form: FormData; updateForm: (u: (f: FormData) => FormData) => void }) {
  return (
    <div className="card p-5">
      <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-4">SEO</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">SEO Title</label>
          <input type="text" value={form.seoTitle} onChange={e => updateForm(f => ({ ...f, seoTitle: e.target.value }))} placeholder={form.title} className="w-full px-3 py-2 border border-gray-200 dark:border-dark-border rounded-lg text-xs bg-white dark:bg-dark-card" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Meta Description</label>
          <textarea value={form.seoDesc} onChange={e => updateForm(f => ({ ...f, seoDesc: e.target.value }))} placeholder="Auto from excerpt..." rows={2} className="w-full px-3 py-2 border border-gray-200 dark:border-dark-border rounded-lg text-xs bg-white dark:bg-dark-card" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Canonical URL</label>
          <input type="text" value={form.canonicalUrl} onChange={e => updateForm(f => ({ ...f, canonicalUrl: e.target.value }))} placeholder="https://..." className="w-full px-3 py-2 border border-gray-200 dark:border-dark-border rounded-lg text-xs bg-white dark:bg-dark-card" />
        </div>
      </div>
    </div>
  );
}
