import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const tags = await db.tag.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, slug: true, _count: { select: { posts: true } } },
    });
    return NextResponse.json({ tags });
  } catch {
    return NextResponse.json({ tags: [] });
  }
}
