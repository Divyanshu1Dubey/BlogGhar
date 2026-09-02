import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { topicId, content } = body;

    if (!topicId || !content?.trim()) {
      return NextResponse.json({ error: 'Topic ID and content required' }, { status: 400 });
    }

    const topic = await prisma.forumPost.findUnique({ where: { id: topicId } });
    if (!topic) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }

    const reply = await prisma.forumPost.create({
      data: {
        title: 'Re: ' + topic.title,
        content: content.trim(),
        parentId: topicId,
        forumId: topic.forumId,
        userId: session.user.id,
      },
      include: {
        user: { select: { name: true } },
      },
    });

    return NextResponse.json(reply, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to post reply' }, { status: 500 });
  }
}
