import { NextResponse } from 'next/server';
import { db, getAvailable } from '@/lib/prisma';

export async function GET() {
  if (!getAvailable()) {
    return NextResponse.json({ games: [] });
  }
  try {
    const games = await db.game.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      include: { _count: { select: { scores: true } } },
    });
    return NextResponse.json({ games });
  } catch {
    return NextResponse.json({ games: [] });
  }
}
