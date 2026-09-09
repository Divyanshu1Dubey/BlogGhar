import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import PostEditor from '@/components/admin/post-editor';

export const metadata: Metadata = {
  title: 'Write Post',
  description: 'Create or edit a blog post on Blog-Ghar.',
};

export const dynamic = 'force-dynamic';

export default async function AuthorPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolved = await params;
  const isNew = resolved.id === 'new';

  let categories: { id: string; name: string; slug: string; icon: string }[] = [];
  try {
    categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  } catch { /* non-critical */ }

  return <PostEditor initialPostId={resolved.id} categories={categories} />;
}
