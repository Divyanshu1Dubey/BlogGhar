import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { gameId, score, metadata } = await request.json();

    if (!gameId || score === undefined) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Update play count
    await prisma.game.update({
      where: { id: gameId },
      data: { playCount: { increment: 1 } },
    });

    // Record score
    const gameScore = await prisma.gameScore.create({
      data: { gameId, score: Number(score), metadata: metadata || null },
      include: { user: { select: { name: true } } },
    });

    return NextResponse.json({ success: true, score: gameScore });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
