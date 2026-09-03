import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import {
  Bookmark, Gamepad2, MessageSquare, Trophy, User, Clock,
  Eye, Shield, Bell, Palette, Trash2
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return {
    title: 'My Profile',
    description: 'Manage your Blog-Ghar profile, bookmarks, and preferences.',
    robots: { index: false, follow: false },
  };
}

interface Props {
  searchParams: Promise<{ tab?: string }>;
}

function getAchievements(scores: any[], commentsCount: number, postsCount: number) {
  const achievements: { title: string; desc: string; icon: string; unlocked: boolean }[] = [];

  // First Steps
  achievements.push({
    title: 'First Steps',
    desc: 'Created your account',
    icon: '👋',
    unlocked: true,
  });

  // Commenter
  achievements.push({
    title: 'Commenter',
    desc: 'Left your first comment',
    icon: '💬',
    unlocked: commentsCount >= 1,
  });

  // Conversationalist
  achievements.push({
    title: 'Conversationalist',
    desc: 'Left 10 comments',
    icon: '🗣️',
    unlocked: commentsCount >= 10,
  });

  // Author
  achievements.push({
    title: 'Author',
    desc: 'Published your first post',
    icon: '✍️',
    unlocked: postsCount >= 1,
  });

  // Prolific Writer
  achievements.push({
    title: 'Prolific Writer',
    desc: 'Published 5 posts',
    icon: '📚',
    unlocked: postsCount >= 5,
  });

  // Gamer
  achievements.push({
    title: 'Gamer',
    desc: 'Played your first game',
    icon: '🎮',
    unlocked: scores.length >= 1,
  });

  // High Scorer
  achievements.push({
    title: 'High Scorer',
    desc: 'Scored above 100 in any game',
    icon: '🏆',
    unlocked: scores.some((s) => s.score >= 100),
  });

  // Dedicated
  achievements.push({
    title: 'Dedicated',
    desc: 'Played 10+ games',
    icon: '💪',
    unlocked: scores.length >= 10,
  });

  // Scholar
  achievements.push({
    title: 'Scholar',
    desc: 'Read 20+ blog posts',
    icon: '🎓',
    unlocked: false,
  });

  // Viral
  achievements.push({
    title: 'Viral',
    desc: 'Got 100+ views on a post',
    icon: '🔥',
    unlocked: false,
  });

  return achievements;
}

export default async function ProfilePage({ searchParams }: Props) {
  const params = await searchParams;
  const activeTab = params.tab || 'saved';

  const session = await auth();
  if (!(session?.user as any)?.id) {
    redirect('/login');
  }
  const userId = (session as any).user.id;

  let user: any;
  let bookmarks: any[] = [];
  let comments: any[] = [];
  let scores: any[] = [];
  try {
    user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: { select: { posts: true, comments: true, gameScores: true, bookmarks: true } },
      },
    });
    bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        post: {
          select: {
            id: true,
            title: true,
            excerpt: true,
            slug: true,
            postType: true,
            featuredImage: true,
            publishedAt: true,
            views: true,
            category: { select: { name: true, slug: true } },
            author: { select: { name: true } },
          },
        },
      },
    });
    comments = await prisma.comment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
            postType: true,
          },
        },
      },
    });
    scores = await prisma.gameScore.findMany({
      where: { userId },
      orderBy: { score: 'desc' },
      take: 20,
      include: {
        game: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
          },
        },
      },
    });
  } catch {
    redirect('/login');
  }

  if (!user) redirect('/login');

  const tabs = [
    { id: 'saved', label: 'Saved', icon: <Bookmark className="w-4 h-4" /> },
    { id: 'games', label: 'Game Scores', icon: <Gamepad2 className="w-4 h-4" /> },
    { id: 'comments', label: 'Comments', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'achievements', label: 'Achievements', icon: <Trophy className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <User className="w-4 h-4" /> },
  ];

  const achievements = getAchievements(scores, user._count.comments, user._count.posts);
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

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
              <span className="px-3 py-1 bg-gray-100 dark:bg-dark-bg rounded-full">
                🔖 {user?._count.bookmarks} saved
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={`/profile?tab=${tab.id}`}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-primary-600 text-white'
                : 'bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border hover:border-primary-300'
            }`}
          >
            {tab.icon}
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Content */}
      <div className="card p-8">
        {activeTab === 'saved' && (
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Saved Content</h3>
            {bookmarks.length > 0 ? (
              <div className="space-y-3">
                {bookmarks.map((b) => (
                  <div key={b.id} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-dark-bg rounded-lg">
                    {b.post.featuredImage && (
                      <img src={b.post.featuredImage} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <Link href={`/${b.post.postType === 'NEWS' ? 'news' : 'blog'}/${b.post.slug}`} className="font-medium hover:text-primary-600 line-clamp-2">
                        {b.post.title}
                      </Link>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                        {b.post.category && <span className="px-2 py-0.5 bg-gray-200 dark:bg-dark-border rounded-full">{b.post.category.name}</span>}
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {b.post.views}</span>
                        <span>{formatDate(b.post.publishedAt || new Date())}</span>
                      </div>
                    </div>
                    <form action="/api/bookmarks" method="POST">
                      <input type="hidden" name="postId" value={b.post.id} />
                      <button type="submit" className="text-gray-400 hover:text-red-500 p-1" title="Remove bookmark">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No saved posts yet. Bookmark posts to read them later!</p>
                <Link href="/blog" className="btn-primary mt-4 inline-block">Browse Blog</Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'games' && (
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Game Scores</h3>
            {scores.length > 0 ? (
              <div className="space-y-3">
                {scores.map((s) => (
                  <div key={s.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-dark-bg rounded-lg">
                    <div className="text-3xl">{s.game.icon}</div>
                    <div className="flex-1">
                      <Link href={`/games/${s.game.slug}`} className="font-medium hover:text-primary-600">
                        {s.game.name}
                      </Link>
                      <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {formatDate(s.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary-600">{s.score}</p>
                      <p className="text-xs text-gray-500">points</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Gamepad2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No game scores yet. Start playing!</p>
                <Link href="/games" className="btn-primary mt-4 inline-block">Play Games</Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'comments' && (
          <div>
            <h3 className="font-display font-bold text-lg mb-4">My Comments</h3>
            {comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((c) => (
                  <div key={c.id} className="p-4 bg-gray-50 dark:bg-dark-bg rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Link href={`/${c.post.postType === 'NEWS' ? 'news' : 'blog'}/${c.post.slug}`} className="text-sm font-medium hover:text-primary-600 line-clamp-1">
                        {c.post.title}
                      </Link>
                      <span className="text-xs text-gray-400 flex-shrink-0 ml-3">{formatDate(c.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{c.content}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {c.postType === 'NEWS' ? 'News' : 'Blog'}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No comments yet. Join the conversation!</p>
                <Link href="/blog" className="btn-primary mt-4 inline-block">Browse Posts</Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'achievements' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-lg">Achievements</h3>
              <span className="text-sm text-gray-500">{unlockedCount}/{achievements.length} unlocked</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {achievements.map((a) => (
                <div
                  key={a.title}
                  className={`p-4 rounded-xl text-center transition-all ${
                    a.unlocked
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50'
                      : 'bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border opacity-50'
                  }`}
                >
                  <p className="text-3xl mb-2">{a.icon}</p>
                  <p className="font-medium text-sm">{a.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{a.desc}</p>
                  {a.unlocked && (
                    <span className="inline-block mt-2 text-xs text-yellow-600 font-medium">Unlocked</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h3 className="font-display font-bold text-lg mb-6">Account Settings</h3>
            <div className="space-y-6">
              {/* Profile Info */}
              <div>
                <h4 className="font-medium text-sm uppercase tracking-wider text-gray-500 mb-3">Profile Information</h4>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Display Name</label>
                    <input
                      type="text"
                      defaultValue={user.name || ''}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg dark:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      defaultValue={user.email || ''}
                      disabled
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg dark:bg-dark-bg text-gray-500"
                    />
                    <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                  </div>
                </div>
              </div>

              <hr className="border-gray-200 dark:border-dark-border" />

              {/* Preferences */}
              <div>
                <h4 className="font-medium text-sm uppercase tracking-wider text-gray-500 mb-3">Preferences</h4>
                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">Email notifications</span>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary-600" />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">Dark mode (follows system)</span>
                    </div>
                    <input type="checkbox" className="w-4 h-4 accent-primary-600" />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">Two-factor authentication</span>
                    </div>
                    <input type="checkbox" className="w-4 h-4 accent-primary-600" />
                  </label>
                </div>
              </div>

              <hr className="border-gray-200 dark:border-dark-border" />

              {/* Account info */}
              <div>
                <h4 className="font-medium text-sm uppercase tracking-wider text-gray-500 mb-3">Account Info</h4>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>Member since {formatDate(user.createdAt)}</p>
                  {user.updatedAt && <p>Last updated {formatDate(user.updatedAt)}</p>}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
