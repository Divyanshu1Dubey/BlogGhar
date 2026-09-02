import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const data = await request.json();
    const post = await prisma.post.create({ data: { ...data, authorId: session.user.id } });
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
