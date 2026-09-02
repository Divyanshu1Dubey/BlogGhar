import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { Bookmark, Gamepad2, MessageSquare, Trophy, User } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Profile',
  description: 'Manage your Blog-Ghar profile, bookmarks, and preferences.',
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<{ tab?: string }>;
}

export default async function ProfilePage({ searchParams }: Props) {
  const params = await searchParams;
  const activeTab = params.tab || 'saved';

  // Get session from cookies
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('authjs.session-token')?.value;

  if (!sessionToken) {
    redirect('/login');
  }

  let user: any;
  try {
    // This is a simplified version - in production you'd properly decode the session
    user = await prisma.user.findFirst({
      include: {
        _count: { select: { posts: true, comments: true, gameScores: true, bookmarks: true } },
      },
    });
  } catch {
    redirect('/login');
  }

  const tabs = [
    { id: 'saved', label: 'Saved', icon: <Bookmark className="w-4 h-4" /> },
    { id: 'games', label: 'Game Scores', icon: <Gamepad2 className="w-4 h-4" /> },
    { id: 'comments', label: 'Comments', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'achievements', label: 'Achievements', icon: <Trophy className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <User className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="card p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-4xl">
            {user?.image ? (
              <img src={user.image} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              user?.name?.charAt(0).toUpperCase()
            )}
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-display font-bold">{user?.name || 'User'}</h1>
            <p className="text-gray-500">{user?.email}</p>
            <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 text-sm">
              <span className="px-3 py-1 bg-gray-100 dark:bg-dark-bg rounded-full">
                📝 {user?._count.posts} posts
              </span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-dark-bg rounded-full">
                💬 {user?._count.comments} comments
              </span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-dark-bg rounded-full">
                🎮 {user?._count.gameScores} games
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-primary-600 text-white'
                : 'bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border hover:border-primary-300'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="card p-8">
        {activeTab === 'saved' && (
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Saved Content</h3>
            <p className="text-gray-500 text-center py-8">Your saved posts, articles, and more will appear here.</p>
          </div>
        )}
        {activeTab === 'games' && (
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Game Scores</h3>
            <p className="text-gray-500 text-center py-8">Your game scores and achievements will appear here.</p>
          </div>
        )}
        {activeTab === 'comments' && (
          <div>
            <h3 className="font-display font-bold text-lg mb-4">My Comments</h3>
            <p className="text-gray-500 text-center py-8">Your comments will appear here.</p>
          </div>
        )}
        {activeTab === 'achievements' && (
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Achievements</h3>
            <p className="text-gray-500 text-center py-8">Play games to earn achievements!</p>
          </div>
        )}
        {activeTab === 'settings' && (
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Account Settings</h3>
            <p className="text-gray-500 text-center py-8">Profile settings coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
