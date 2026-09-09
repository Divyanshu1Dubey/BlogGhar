import prisma from '@/lib/prisma';
import PostEditor from '@/components/admin/post-editor';
import AuthorSidebar from '@/app/(main)/author/components/author-sidebar';

export const dynamic = 'force-dynamic';

export default async function AuthorPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolved = await params;

  let categories: { id: string; name: string; slug: string; icon: string }[] = [];
  try {
    categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  } catch { /* non-critical */ }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <AuthorSidebar />
      <div className="ml-64">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <PostEditor initialPostId={resolved.id} categories={categories} />
        </div>
      </div>
    </div>
  );
}
