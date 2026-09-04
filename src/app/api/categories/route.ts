import { NextResponse } from 'next/server';
import { db, getAvailable } from '@/lib/prisma';

export async function GET() {
  if (!getAvailable()) {
    return NextResponse.json({ categories: [] });
  }
  try {
    const categories = await db.category.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, slug: true, icon: true },
    });
    return NextResponse.json({ categories });
  } catch {
    return NextResponse.json({ categories: [] });
  }
}
