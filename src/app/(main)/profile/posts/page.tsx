'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { PostStatusEnum } from '@/lib/validation';
import {
  PlusCircle, FileText, FileJson, Trash2, Eye, ExternalLink,
  BarChart3, BookOpen, Clock, MoreHorizontal, RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Post = {
  id: string;
  title: string;
  slug: string;
  status: string;
  format?: string;
  excerpt: string | null;
  featuredImage: string | null;
  views: number;
  createdAt: string;
  publishedAt: string | null;
  updatedAt: string;
  category?: { id: string; name: string; slug: string } | null;
};

export default function MyPostsPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/login');
      return;
    }
    if (sessionStatus !== 'authenticated') return;
    loadPosts();
  }, [sessionStatus]);

  const loadPosts = async () => {
    try {
      const url = filter === 'ALL'
        ? '/api/blogs?take=50'
        : filter === 'DRAFT'
        ? '/api/blogs?status=DRAFT&take=50'
        : '/api/blogs?status=PUBLISHED&take=50';
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      const data = await res.json();
      // Filter to current user's posts
      const userId = (session?.user as any)?.id;
      const myPosts = data.posts?.filter((p: any) => p.authorId === userId) || [];
      setPosts(myPosts);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete');
      }
      setPosts(posts.filter(p => p.id !== id));
      setMessage({ type: 'success', text: 'Post deleted.' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete post.' });
    }
  };

  const handleDuplicate = async (post: Post) => {
    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...post,
          title: post.title + ' (Copy)',
          slug: '',
          status: 'DRAFT',
          id: undefined,
          publishedAt: undefined,
          createdAt: undefined,
          updatedAt: undefined,
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPosts([data.blog, ...posts]);
      setMessage({ type: 'success', text: 'Post duplicated as draft.' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to duplicate post.' });
    }
  };

  if (sessionStatus === 'loading') {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary-600 rounded-full border-t-transparent" /></div>;
  }

  const isAdmin = (session?.user as any)?.role === 'ADMIN';

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-dark-bg">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-extrabold">My Posts</h1>
            <p className="text-gray-500 mt-1">Manage your blog posts, drafts, and published articles.</p>
          </div>
          <Link
            href="/author/posts/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 text-sm font-medium"
          >
            <PlusCircle className="w-4 h-4" /> New Post
          </Link>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6">
          {(['ALL', 'PUBLISHED', 'DRAFT'] as const).map(f => (
            <button
              key={f}
              onClick={() => { setFilter(f); setLoading(true); }}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                filter === f
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-dark-card text-gray-600 hover:bg-gray-100'
              )}
            >
              {f === 'ALL' ? 'All' : f === 'PUBLISHED' ? 'Published' : 'Drafts'}
            </button>
          ))}
          <div className="flex-1" />
          <span className="text-sm text-gray-500">{posts.length} posts</span>
          <button onClick={() => { setLoading(true); loadPosts(); }} className="p-2 hover:bg-gray-100 rounded-lg">
            <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
          </button>
        </div>

        {message && (
          <div className={cn('mb-6 p-4 rounded-xl text-sm font-medium', message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-primary-600 rounded-full border-t-transparent" /></div>
        ) : posts.length === 0 ? (
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-16 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-display font-bold mb-2">No posts yet</h3>
            <p className="text-gray-500 mb-6">Create your first blog post to get started.</p>
            <Link href="/author/posts/new" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium text-sm">
              <PlusCircle className="w-4 h-4" /> Create Post
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden">
            {posts.map((post) => (
              <div key={post.id} className="flex items-center gap-4 p-4 border-b border-gray-100 dark:border-dark-border last:border-b-0 hover:bg-gray-50/50 transition-colors">
                {post.featuredImage && (
                  <img src={post.featuredImage} alt="" className="w-20 h-14 rounded-lg object-cover hidden sm:block" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link href={`/blog/${post.slug}`} className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 truncate">
                      {post.title}
                    </Link>
                    {post.format === 'CUSTOM_CODE' && <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full shrink-0">CUSTOM</span>}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span className={cn(
                      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full',
                      post.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    )}>
                      {post.status === 'PUBLISHED' ? <Eye className="w-3 h-3" /> : <FileJson className="w-3 h-3" />}
                      {post.status}
                    </span>
                    {post.category && <span>{post.category.name}</span>}
                    <span><Clock className="w-3 h-3 inline mr-0.5" />{new Date(post.updatedAt).toLocaleDateString()}</span>
                    <span><BarChart3 className="w-3 h-3 inline mr-0.5" />{post.views}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {isAdmin && (
                    <Link href={`/admin/posts/new?id=${post.id}`} className="p-2 hover:bg-gray-200 rounded-lg" title="Edit">
                      <FileText className="w-4 h-4 text-gray-500" />
                    </Link>
                  )}
                  {post.status === 'PUBLISHED' && (
                    <Link href={`/blog/${post.slug}`} className="p-2 hover:bg-gray-200 rounded-lg" title="View">
                      <ExternalLink className="w-4 h-4 text-gray-500" />
                    </Link>
                  )}
                  <button onClick={() => handleDuplicate(post)} className="p-2 hover:bg-gray-200 rounded-lg" title="Duplicate">
                    <FileText className="w-4 h-4 text-gray-500" />
                  </button>
                  {isAdmin && (
                    <button onClick={() => handleDelete(post.id)} className="p-2 hover:bg-red-50 rounded-lg" title="Delete">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
