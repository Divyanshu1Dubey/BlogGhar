import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { Eye, Pin, Lock } from 'lucide-react';
import { Metadata } from 'next';

type ForumParams = Promise<{ slug: string }>;

interface Props {
  params: ForumParams;
}

export async function generateMetadata({ params }: { params: ForumParams }): Promise<Metadata> {
  try {
    const { slug } = await params;
    const forum = await prisma.forum.findUnique({ where: { slug }, select: { name: true, description: true } });
    if (!forum) return { title: 'Forum Not Found' };
    return {
      title: `${forum.name} - Forum`,
      description: forum.description || `Join the ${forum.name} discussion on Blog-Ghar.`,
      openGraph: { title: forum.name, description: forum.description || undefined, type: 'website' },
    };
  } catch { return {}; }
}

export default async function ForumCategoryPage({ params }: Props) {
  const { slug } = await params;
  const forum: {
    id: string;
    name: string;
    description: string | null;
    icon: string | null;
    posts: Array<{
      id: string;
      title: string;
      content: string;
      views: number;
      createdAt: Date;
      updatedAt: Date;
      isPinned: boolean;
      isLocked: boolean;
      user: { name: string | null; image: string | null };
    }>;
  } | null = await prisma.forum.findUnique({
    where: { slug },
    include: {
      posts: {
        where: { parentId: null },
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
        include: { user: { select: { name: true, image: true } } },
      },
    },
  });

  if (!forum) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-extrabold">{forum.name}</h1>
          <p className="text-gray-500 mt-1">{forum.description || 'Discussion forum'}</p>
        </div>
        <Link href={`/forum/${slug}/new`} className="btn-primary text-sm whitespace-nowrap">
          + New Post
        </Link>
      </div>

      {/* Posts */}
      {forum.posts.length > 0 ? (
        <div className="space-y-3">
          {forum.posts.map((post) => (
            <article key={post.id} className="card p-5 hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-1 text-gray-400">
                  {post.isPinned && <Pin className="w-4 h-4 text-orange-500" />}
                  {post.isLocked && <Lock className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <Link href={`/forum/${slug}/${post.id}`}>
                    <h3 className="font-medium hover:text-primary-600 transition-colors">{post.title}</h3>
                  </Link>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span>{post.user.name}</span>
                    <span>•</span>
                    <span>{formatDate(post.createdAt)}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {post.views}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <p className="text-4xl mb-3">💬</p>
          <p className="text-gray-500">No posts yet. Start the conversation!</p>
        </div>
      )}
    </div>
  );
}
