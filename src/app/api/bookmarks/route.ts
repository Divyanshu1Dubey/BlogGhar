import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { postId } = await request.json();
    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const existing = await prisma.bookmark.findUnique({
      where: { userId_postId: { userId: session.user.id, postId } },
    });

    if (existing) {
      await prisma.bookmark.delete({ where: { id: existing.id } });
      return NextResponse.json({ success: true, bookmarked: false });
    }

    await prisma.bookmark.create({
      data: { userId: session.user.id, postId },
    });

    return NextResponse.json({ success: true, bookmarked: true });
  } catch {
    return NextResponse.json({ error: 'Failed to toggle bookmark' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: session.user.id },
      select: { postId: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ bookmarks: bookmarks.map((b) => b.postId) });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch bookmarks' }, { status: 500 });
  }
}
