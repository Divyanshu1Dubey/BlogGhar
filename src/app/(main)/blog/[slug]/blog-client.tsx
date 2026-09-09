'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { MessageSquare, Send, ThumbsUp, Flag } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  user: { id: string; name: string | null };
  _count?: { replies: number };
};

type Props = {
  postId: string;
};

export default function CommentSection({ postId }: Props) {
  const { data: session, status } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const loadComments = async () => {
    try {
      const res = await fetch(`/api/comments?postId=${postId}`);
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.comments || [];
        const topLevel = list.filter((c: Comment) => !c.parentId);
        setComments(topLevel);
      }
    } catch { /* empty */ } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadComments(); }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !session) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, content: newComment.trim(), parentId: null }),
      });
      if (res.ok) {
        setNewComment('');
        loadComments();
      }
    } catch { /* empty */ } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) {
    return (
      <div className="mt-16">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-6 bg-primary-500 rounded-full" />
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Comments</h2>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-8 text-center">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  const isAuthenticated = status === 'authenticated';

  return (
    <div className="mt-16">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-6 bg-primary-500 rounded-full" />
        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
          Comments ({comments.length})
        </h2>
      </div>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-5">
            <textarea
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-bg resize-y text-sm"
            />
            <div className="flex justify-end mt-3">
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" /> Post Comment
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-8 text-center mb-8">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Sign in to join the conversation</p>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-5 animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-12 text-center">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
                  {(comment.user.name || '?').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">{comment.user.name}</span>
                    <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{comment.content}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-primary-600 transition-colors">
                      <ThumbsUp className="w-3.5 h-3.5" /> Helpful
                    </button>
                    <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-600 transition-colors">
                      <Flag className="w-3.5 h-3.5" /> Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
