import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { gameId, score, metadata } = await request.json();

    if (!gameId || score === undefined) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const gameScore = await prisma.gameScore.create({
      data: { gameId, score: Number(score), metadata: metadata || null, userId: session.user.id },
      include: { user: { select: { name: true } } },
    });

    return NextResponse.json({ success: true, score: gameScore });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
