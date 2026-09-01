import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { postId, content, parentId } = await request.json();
    if (!content) return NextResponse.json({ error: 'Content required' }, { status: 400 });
    const comment = await prisma.comment.create({ data: { content, postId, parentId } });
    return NextResponse.json(comment);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    const comments = await prisma.comment.findMany({
      where: postId ? { postId } : undefined,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } } },
    });
    return NextResponse.json(comments);
  } catch {
    return NextResponse.json([]);
  }
}
