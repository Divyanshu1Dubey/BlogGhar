import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const game = request.nextUrl.searchParams.get('game');
  const period = request.nextUrl.searchParams.get('period') || 'all';

  try {
    const where: any = {};
    if (game) where.game = game;
    if (period === 'week') {
      where.createdAt = { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
    } else if (period === 'month') {
      where.createdAt = { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
    }

    const scores = await prisma.gameScore.findMany({
      where,
      orderBy: { score: 'desc' },
      take: 50,
      include: {
        user: { select: { name: true, image: true } },
      },
    });

    return NextResponse.json({
      leaderboard: scores.map((s, i) => ({
        rank: i + 1,
        id: s.id,
        playerName: s.playerName || s.user?.name || 'Anonymous',
        playerImage: s.user?.image || null,
        game: s.game,
        score: s.score,
        playedAt: s.createdAt,
      })),
    });
  } catch {
    return NextResponse.json({ leaderboard: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { game, score, playerName, userId } = body;

    if (!game || score === undefined) {
      return NextResponse.json({ error: 'Game and score required' }, { status: 400 });
    }

    const entry = await prisma.gameScore.create({
      data: { game, score: Number(score), playerName: playerName || null, userId: userId || null },
    });

    return NextResponse.json({ success: true, id: entry.id });
  } catch {
    return NextResponse.json({ error: 'Failed to save score' }, { status: 500 });
  }
}
