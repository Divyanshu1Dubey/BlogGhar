'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  FileText, Eye, TrendingUp, PlusCircle, BarChart3,
  Clock, ChevronRight, PenLine, BookOpen, FileJson, MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  status: string;
  format?: string;
  views: number;
  publishedAt: string | null;
  createdAt: string;
  category: { id: string; name: string; slug: string; icon: string | null } | null;
  _count: { comments: number };
};

type CommunityPost = {
  id: string;
  content: string;
  kind: string;
  views: number;
  createdAt: string;
};

export default function AuthorDashboardPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ posts: 0, published: 0, drafts: 0, views: 0, community: 0 });
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [recentCommunity, setRecentCommunity] = useState<CommunityPost[]>([]);

  useEffect(() => {
    if (sessionStatus === 'unauthenticated') { router.push('/login'); return; }
    if (sessionStatus !== 'authenticated') return;
    const userId = (session?.user as any)?.id;
    if (!userId) return;
    loadData(userId);
  }, [sessionStatus]);

  const loadData = async (userId: string) => {
    try {
      const res = await fetch(`/api/dashboard?userId=${userId}`);
      const data = await res.json();
      setStats(data.stats);
      setRecentPosts(data.recentPosts || []);
      setRecentCommunity(data.recentCommunity || []);
    } catch {
      // silently handle
    } finally {
      setLoading(false);
    }
  };

  if (sessionStatus === 'loading' || loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary-600 rounded-full border-t-transparent" /></div>;
  }

  if (!session) return null;

  const isAdmin = (session.user as any)?.role === 'ADMIN';

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-extrabold">
            {isAdmin ? 'Admin Dashboard' : 'My Dashboard'}
          </h1>
          <p className="text-gray-500 mt-1">
            {isAdmin ? 'Manage your content and platform.' : 'Create, manage, and track your content.'}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Link href="/author/posts/new" className="inline-flex items-center gap-2 px-5 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium text-sm shadow-md hover:shadow-lg transition-all">
            <PlusCircle className="w-4 h-4" /> Write Post
          </Link>
          <Link href="/community" className="inline-flex items-center gap-2 px-5 py-3 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl hover:border-primary-300 font-medium text-sm transition-all">
            <MessageSquare className="w-4 h-4" /> Community
          </Link>
          {isAdmin && <Link href="/admin" className="inline-flex items-center gap-2 px-5 py-3 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl hover:border-primary-300 font-medium text-sm transition-all">Admin Panel</Link>}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          {[
            { label: 'Posts', value: stats.posts, icon: FileText, color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' },
            { label: 'Published', value: stats.published, icon: Eye, color: 'bg-green-50 dark:bg-green-900/20 text-green-600' },
            { label: 'Drafts', value: stats.drafts, icon: FileJson, color: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600' },
            { label: 'Total Views', value: formatViews(stats.views), icon: TrendingUp, color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600' },
            { label: 'Community', value: stats.community, icon: BarChart3, color: 'bg-pink-50 dark:bg-pink-900/20 text-pink-600' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-5 hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Two Columns: Recent Posts + Community */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Posts */}
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-dark-border">
              <h2 className="font-display font-bold text-lg">Recent Posts</h2>
              <Link href="/profile/posts" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-0.5">View All <ChevronRight className="w-4 h-4" /></Link>
            </div>
            {recentPosts.length === 0 ? (
              <div className="p-12 text-center">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-3">No posts yet</p>
                <Link href="/admin/posts/new" className="text-sm text-primary-600 font-medium">Create your first post →</Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-dark-border">
                {recentPosts.slice(0, 5).map(post => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="flex items-center gap-4 p-4 hover:bg-gray-50/50 transition-colors">
                    <div className={cn('w-2 h-10 rounded-full shrink-0', post.status === 'PUBLISHED' ? 'bg-green-500' : 'bg-yellow-400')} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{post.title}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                        <span>{post.category?.name || 'Uncategorized'}</span>
                        <span><TrendingUp className="w-3 h-3 inline" />{post.views}</span>
                        <span><Clock className="w-3 h-3 inline" />{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {post.status === 'PUBLISHED' && <Eye className="w-4 h-4 text-gray-400 shrink-0" />}
                    {post.format === 'CUSTOM_CODE' && <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full shrink-0">CUSTOM</span>}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recent Community */}
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-dark-border">
              <h2 className="font-display font-bold text-lg">Recent Community Posts</h2>
              <Link href="/community" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-0.5">View All <ChevronRight className="w-4 h-4" /></Link>
            </div>
            {recentCommunity.length === 0 ? (
              <div className="p-12 text-center">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-3">No community posts yet</p>
                <Link href="/community" className="text-sm text-primary-600 font-medium">Share something →</Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-dark-border">
                {recentCommunity.slice(0, 5).map(post => (
                  <div key={post.id} className="p-4">
                    <p className="text-sm line-clamp-2">{post.content}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span className="px-2 py-0.5 bg-gray-100 rounded-full">{post.kind}</span>
                      <span><TrendingUp className="w-3 h-3 inline" />{post.views}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatViews(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}
