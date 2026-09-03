import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!(session?.user as any)?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const authorId = (session as any).user.id;
    const data = await request.json();
    const comment = await prisma.comment.create({ data: { ...data, userId: authorId } });
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
