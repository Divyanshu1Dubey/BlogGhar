import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

type PostIdParams = Promise<{ id: string }>;

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session || !(session?.user as any)?.id) {
    return null;
  }
  return session;
}

export async function GET(
  { params }: { params: PostIdParams }
) {
  try {
    const { id } = await params;
    const post = await prisma.post.findUnique({
      where: { id },
      include: { author: { select: { name: true } }, category: { select: { name: true, slug: true } } },
    });
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: PostIdParams }
) {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = (session as any).user.id;
    const { id } = await params;
    const data = await request.json();
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (post.authorId !== userId && (session as any).user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const allowed = ['title', 'slug', 'content', 'excerpt', 'featuredImage', 'postType', 'status', 'categoryId', 'readTime', 'seoTitle', 'seoDesc', 'focusKeyword'];
    const safeData = Object.fromEntries(Object.entries(data).filter(([key]) => allowed.includes(key)));
    if (safeData.status === 'PUBLISHED' && !post.publishedAt) safeData.publishedAt = new Date();
    const updated = await prisma.post.update({ where: { id }, data: safeData });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(
  { params }: { params: PostIdParams }
) {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = (session as any).user.id;
    const { id } = await params;
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (post.authorId !== userId && (session as any).user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
