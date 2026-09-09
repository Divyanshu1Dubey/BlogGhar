import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Calendar, FileText, MessageSquare, Eye } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const author = await prisma.user.findUnique({
    where: { username },
    select: { name: true, bio: true },
  });
  if (!author) return {};
  return {
    title: `${author.name} — Blog-Ghar`,
    description: author.bio || `Posts by ${author.name} on Blog-Ghar.`,
    alternates: { canonical: `https://bloghar.com/writers/${username}` },
  };
}

export default async function WriterProfilePage({ params }: Props) {
  const { username } = await params;
  const author = await prisma.user.findUnique({
    where: { username },
    include: {
      _count: { select: { posts: true, comments: true } },
    },
  });
  if (!author) {
    return (
      <div className="min-h-screen bg-gray-50/50 dark:bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">👤</p>
          <h1 className="text-2xl font-display font-bold mb-2">Author not found</h1>
          <p className="text-gray-500 mb-6">No author with username &ldquo;{username}&rdquo; exists.</p>
          <Link href="/blog" className="btn-primary">Browse Blogs</Link>
        </div>
      </div>
    );
  }

  const publishedPosts = await prisma.post.findMany({
    where: { authorId: author.id, status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
    take: 20,
    include: {
      category: { select: { name: true, slug: true, icon: true } },
    },
  });

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-dark-bg">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-dark-border p-8 md:p-12 mb-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-100/50 to-indigo-100/30 dark:from-primary-900/10 dark:to-indigo-900/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl" />
          <div className="relative flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-4xl font-bold text-white shadow-xl ring-4 ring-primary-100 dark:ring-primary-900/50 shrink-0">
              {author.image ? (
                <img src={author.image} alt="" className="w-full h-full rounded-3xl object-cover" />
              ) : (
                (author.name || '?').charAt(0).toUpperCase()
              )}
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-display font-extrabold text-gray-900 dark:text-white mb-2">{author.name}</h1>
              <p className="text-gray-500 mb-4">@{author.username}</p>
              {author.bio && (
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed max-w-2xl">{author.bio}</p>
              )}
              <div className="flex items-center justify-center md:justify-start gap-6 mt-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5"><FileText className="w-4 h-4" /> {author._count.posts} posts</span>
                <span className="flex items-center gap-1.5"><MessageSquare className="w-4 h-4" /> {author._count.comments} comments</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-display font-bold mb-6 text-gray-900 dark:text-white">Published Posts</h2>
          {publishedPosts.length === 0 ? (
            <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-12 text-center">
              <p className="text-gray-400 text-lg">No published posts yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {publishedPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-lg transition-all"
                >
                  {post.featuredImage ? (
                    <div className="aspect-[16/9] bg-gray-100 overflow-hidden">
                      <img src={post.featuredImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ) : (
                    <div className="aspect-[16/9] bg-gradient-to-br from-primary-600 via-indigo-600 to-purple-700" />
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-0.5 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full font-medium">
                        {post.category.icon} {post.category.name}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors line-clamp-2">{post.title}</h3>
                    {post.excerpt && <p className="text-sm text-gray-500 mt-2 line-clamp-2">{post.excerpt}</p>}
                    <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {post.views}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
