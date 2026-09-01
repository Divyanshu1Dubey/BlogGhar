import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const games = await prisma.game.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      include: { _count: { select: { scores: true } } },
    });
    return NextResponse.json({ games });
  } catch {
    return NextResponse.json({ games: [] });
  }
}
