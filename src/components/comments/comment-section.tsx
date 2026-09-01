'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Heart, Reply, MoreHorizontal } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  likes: number;
  user: { name: string; image?: string };
  replies?: Comment[];
}

export default function CommentSection({ postId }: { postId: string }) {
  const [comments] = useState<Comment[]>([
    { id: '1', content: 'Great article! Very informative and well-written. Looking forward to more content like this.', createdAt: new Date(Date.now() - 3600000), likes: 12, user: { name: 'Rahul', image: '' } },
    { id: '2', content: 'This helped me a lot. Thanks for sharing this valuable information!', createdAt: new Date(Date.now() - 7200000), likes: 8, user: { name: 'Priya', image: '' } },
    { id: '3', content: 'I had a question about the third point. Can someone elaborate?', createdAt: new Date(Date.now() - 10800000), likes: 3, user: { name: 'Amit', image: '' }, replies: [
      { id: '3-1', content: 'Sure! The third point refers to...', createdAt: new Date(Date.now() - 9000000), likes: 5, user: { name: 'Author', image: '' } },
    ] },
  ]);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState<string[]>([]);

  const handleLike = (id: string) => {
    if (!liked.includes(id)) setLiked([...liked, id]);
  };

  return (
    <section id="comments" className="mt-8 pt-8 border-t border-gray-200 dark:border-dark-border">
      <h3 className="text-2xl font-display font-bold mb-6">💬 Comments ({comments.length})</h3>

      {/* New Comment */}
      <div className="mb-8">
        <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Write a comment..." className="w-full h-24 px-4 py-3 border border-gray-300 dark:border-dark-border rounded-xl bg-white dark:bg-dark-card resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 mb-3" />
        <div className="flex justify-end">
          <button onClick={() => signIn()} className="btn-primary text-sm">Sign in to Comment</button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center font-medium text-sm shrink-0">
              {comment.user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="bg-gray-50 dark:bg-dark-bg rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{comment.user.name}</span>
                    {comment.user.name === 'Author' && <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-600 px-2 py-0.5 rounded-full">Author</span>}
                    <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal className="w-4 h-4" /></button>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
              </div>
              <div className="flex items-center gap-4 mt-2 ml-4">
                <button onClick={() => handleLike(comment.id)} className={`flex items-center gap-1 text-xs ${liked.includes(comment.id) ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}>
                  <Heart className={`w-3.5 h-3.5 ${liked.includes(comment.id) ? 'fill-current' : ''}`} /> {comment.likes + (liked.includes(comment.id) ? 1 : 0)}
                </button>
                <button onClick={() => signIn()} className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary-600">
                  <Reply className="w-3.5 h-3.5" /> Reply
                </button>
              </div>

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-3 ml-4 space-y-3">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-3">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center font-medium text-xs shrink-0">{reply.user.name.charAt(0)}</div>
                      <div className="flex-1">
                        <div className="bg-gray-50 dark:bg-dark-bg rounded-xl p-3">
                          <span className="font-medium text-sm">{reply.user.name}</span>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{reply.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
