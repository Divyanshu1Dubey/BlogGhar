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
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

  return (
    <div className="mt-16">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-6 bg-primary-500 rounded-full" />
        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
          Comments ({comments.length})
        </h2>
      </div>

      {session ? (
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
                disabled={!newComment.trim() || submitting}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-5 bg-gray-50 dark:bg-dark-bg rounded-2xl border border-gray-100 dark:border-dark-border text-center">
          <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Please <a href="/login" className="text-primary-600 font-medium">log in</a> to leave a comment.</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm">No comments yet. Be the first to share your thoughts!</div>
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
