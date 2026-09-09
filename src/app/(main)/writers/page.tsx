import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Users, FileText, MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Writers — Blog-Ghar',
  description: 'Discover writers and creators on Blog-Ghar.',
  alternates: { canonical: 'https://bloghar.com/writers' },
};

export const dynamic = 'force-dynamic';

export default async function WritersPage() {
  const writers = await prisma.user.findMany({
    where: {
      posts: { some: { status: 'PUBLISHED' } },
    },
    include: {
      _count: { select: { posts: true, comments: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-dark-bg">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-indigo-100 dark:from-primary-900/30 dark:to-indigo-900/20 mb-4">
            <Users className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-4xl font-display font-extrabold text-gray-900 dark:text-white mb-3">Writers</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">Discover talented writers and creators sharing their knowledge on Blog-Ghar.</p>
        </div>

        {writers.length === 0 ? (
          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-12 text-center">
            <p className="text-gray-500 text-lg">No writers yet. Be the first to publish!</p>
            <Link href="/author/posts/new" className="btn-primary inline-block mt-4">Start Writing</Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {writers.map((writer) => (
              <Link
                key={writer.id}
                href={`/writers/${writer.username || writer.id}`}
                className="group bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow-lg ring-4 ring-primary-50 dark:ring-primary-900/50 shrink-0">
                    {(writer.name || writer.email || '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display font-bold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors truncate">
                      {writer.name || 'Anonymous Writer'}
                    </h3>
                    {writer.username && (
                      <p className="text-sm text-gray-400">@{writer.username}</p>
                    )}
                  </div>
                </div>

                {writer.bio && (
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">{writer.bio}</p>
                )}

                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    {writer._count.posts} posts
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {writer._count.comments} comments
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
