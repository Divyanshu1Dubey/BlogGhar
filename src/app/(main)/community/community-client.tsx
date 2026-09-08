'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { CommunityPostKindEnum } from '@/lib/validation';
import {
  Lightbulb, Link2, HelpCircle, Compass, Plus,
  Filter, TrendingUp, Pin, MessageSquare, Image as ImageIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { sanitizeHtml, htmlToText } from '@/lib/sanitize';

const KIND_ICONS: Record<string, React.ReactNode> = {
  THOUGHT: <Lightbulb className="w-5 h-5" />,
  LINK: <Link2 className="w-5 h-5" />,
  QUESTION: <HelpCircle className="w-5 h-5" />,
  DISCOVERY: <Compass className="w-5 h-5" />,
};

const KIND_LABELS: Record<string, string> = {
  THOUGHT: 'Thought',
  LINK: 'Link',
  QUESTION: 'Question',
  DISCOVERY: 'Discovery',
};

type Category = { id: string; name: string; slug: string; color: string };
type Post = {
  id: string;
  content: string;
  kind: string;
  linkUrl: string | null;
  linkTitle: string | null;
  linkDesc: string | null;
  imageUrl: string | null;
  isPinned: boolean;
  views: number;
  createdAt: string;
  author: { id: string; name: string | null; username: string | null; image: string | null; role: string };
  category: { id: string; name: string; slug: string; color: string } | null;
  _count?: { reports: number };
};

export default function CommunityClient() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | string>('ALL');
  const [showCreate, setShowCreate] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ content: '', kind: 'THOUGHT', categoryId: '', linkUrl: '', linkTitle: '', linkDesc: '', imageUrl: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || data);
      }
    } catch { /* empty */ }
  }, []);

  const loadPosts = useCallback(async () => {
    try {
      const url = filter === 'ALL' ? '/api/community/posts' : `/api/community/posts?categoryId=${filter}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const list = data.posts || [];
        // Sort: pinned first, then by date
        list.sort((a: Post, b: Post) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setPosts(list);
      }
    } catch { /* empty */ } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { loadCategories(); }, [loadCategories]);
  useEffect(() => { setLoading(true); loadPosts(); }, [loadPosts]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.content.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          categoryId: form.categoryId || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to post');
      }
      setForm({ content: '', kind: 'THOUGHT', categoryId: '', linkUrl: '', linkTitle: '', linkDesc: '', imageUrl: '' });
      setShowCreate(false);
      loadPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-dark-bg">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-extrabold mb-3">Community</h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">Share thoughts, discoveries, questions, and useful links with the Blog-Ghar community.</p>
        </div>

        {/* Create */}
        {session ? (
          <div className="mb-8">
            {!showCreate ? (
              <button onClick={() => setShowCreate(true)} className="w-full bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl p-4 flex items-center gap-3 text-gray-400 hover:border-primary-300 hover:text-primary-600 transition-colors text-left">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="text-sm">Share something with the community...</span>
              </button>
            ) : (
              <form onSubmit={handleCreate} className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  {session.user?.image && (
                    <Image src={session.user.image} alt="" width={40} height={40} className="rounded-full" />
                  )}
                  <div>
                    <p className="font-medium text-sm">{(session.user as any)?.name}</p>
                  </div>
                </div>

                {/* Kind selector */}
                <div className="flex gap-2">
                  {(Object.keys(KIND_LABELS) as string[]).map(k => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, kind: k }))}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors',
                        form.kind === k
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-50 dark:bg-gray-800 text-gray-600 hover:bg-gray-100'
                      )}
                    >
                      {KIND_ICONS[k]} {KIND_LABELS[k]}
                    </button>
                  ))}
                </div>

                {error && <div className="p-3 bg-red-100 text-red-700 rounded-xl text-sm">{error}</div>}

                <textarea
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  placeholder="What's on your mind?"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none bg-white dark:bg-dark-card"
                />

                {form.kind === 'LINK' && (
                  <div className="space-y-3">
                    <input type="url" value={form.linkUrl} onChange={e => setForm(f => ({ ...f, linkUrl: e.target.value }))} placeholder="https://example.com" className="w-full px-4 py-2 border border-gray-200 dark:border-dark-border rounded-xl text-sm" />
                    <input type="text" value={form.linkTitle} onChange={e => setForm(f => ({ ...f, linkTitle: e.target.value }))} placeholder="Link title" className="w-full px-4 py-2 border border-gray-200 dark:border-dark-border rounded-xl text-sm" />
                    <input type="text" value={form.linkDesc} onChange={e => setForm(f => ({ ...f, linkDesc: e.target.value }))} placeholder="Brief description" className="w-full px-4 py-2 border border-gray-200 dark:border-dark-border rounded-xl text-sm" />
                  </div>
                )}

                {form.kind === 'DISCOVERY' && (
                  <input type="url" value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="Image URL (optional)" className="w-full px-4 py-2 border border-gray-200 dark:border-dark-border rounded-xl text-sm" />
                )}

                <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} className="w-full px-4 py-2 border border-gray-200 dark:border-dark-border rounded-xl text-sm">
                  <option value="">No category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>

                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl">Cancel</button>
                  <button type="submit" disabled={submitting || !form.content.trim()} className="px-5 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 disabled:opacity-50">
                    {submitting ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <div className="mb-8 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl p-6 text-center">
            <p className="text-gray-500 mb-3">Join the conversation. Sign in to share with the community.</p>
            <Link href="/login" className="inline-block px-5 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium">Sign In</Link>
          </div>
        )}

        {/* Category filters */}
        {categories.length > 0 && (
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            <button onClick={() => setFilter('ALL')} className={cn('shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors', filter === 'ALL' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-dark-card hover:bg-gray-100')}>
              All
            </button>
            {categories.map(c => (
              <button key={c.id} onClick={() => setFilter(c.slug)} className={cn('shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5', filter === c.slug ? 'bg-primary-600 text-white' : 'bg-white dark:bg-dark-card hover:bg-gray-100')}>
                {c.name}
              </button>
            ))}
          </div>
        )}

        {/* Posts */}
        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-primary-600 rounded-full border-t-transparent" /></div>
        ) : posts.length === 0 ? (
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-16 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-display font-bold mb-2">No posts yet</h3>
            <p className="text-gray-500">Be the first to share something with the community!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map(post => <PostCard key={post.id} post={post} sessionUserId={session?.user?.id} onDelete={loadPosts} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function PostCard({ post, sessionUserId, onDelete }: { post: Post; sessionUserId?: string; onDelete: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isAuthor = post.author.id === sessionUserId;
  const isAdmin = (post.author as any).role === 'ADMIN';

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return;
    try {
      const res = await fetch(`/api/community/posts/${post.id}`, { method: 'DELETE' });
      if (res.ok) onDelete();
    } catch { /* empty */ }
  };

  const handleReport = async () => {
    const reason = prompt('Reason: SPAM, ABUSE, MISINFORMATION, or OTHER');
    if (!reason) return;
    try {
      await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetType: 'community_post', targetId: post.id, communityPostId: post.id, reason }),
      });
      alert('Report submitted. A moderator will review it.');
    } catch { /* empty */ }
  };

  const plainText = htmlToText(post.content, 280);

  return (
    <div className="bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
          {post.author.name?.[0]?.toUpperCase() || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm">{post.author.name || 'Anonymous'}</span>
            <span className="text-xs text-gray-400">@{post.author.name || post.author.email?.split('@')[0] || 'unknown'}</span>
            <span className="text-xs text-gray-400">· {new Date(post.createdAt).toLocaleDateString()}</span>
            {post.isPinned && <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-700 rounded-full flex items-center gap-0.5"><Pin className="w-3 h-3" />Pinned</span>}
            {post.category && <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full">{post.category.name}</span>}
          </div>

          {post.kind === 'LINK' && post.linkUrl && (
            <a href={post.linkUrl} target="_blank" rel="noopener noreferrer" className="block mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 hover:border-primary-300 transition-colors">
              <div className="flex items-center gap-2 text-primary-600 text-sm font-medium">
                <Link2 className="w-4 h-4" /> {post.linkTitle || post.linkUrl}
              </div>
              {post.linkDesc && <p className="text-sm text-gray-500 mt-1">{post.linkDesc}</p>}
            </a>
          )}

          {post.kind === 'DISCOVERY' && post.imageUrl && (
            <div className="mt-2 rounded-xl overflow-hidden max-h-48">
              <img src={post.imageUrl} alt="" className="w-full object-cover" />
            </div>
          )}

          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{plainText}</p>

          <div className="flex items-center gap-4 mt-3">
            <span className="text-xs text-gray-400 flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" />{post.views}</span>
            <button className="text-xs text-gray-400 hover:text-primary-600">Reply</button>
            {!isAuthor && <button onClick={handleReport} className="text-xs text-gray-400 hover:text-red-500 ml-auto">Report</button>}
          </div>
        </div>

        {(isAuthor || isAdmin) && (
          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-1.5 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="6" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="18" r="1.5" /></svg>
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-8 z-20 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl shadow-xl py-1 min-w-[160px]">
                  {(isAuthor || isAdmin) && <button onClick={handleDelete} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Delete</button>}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
