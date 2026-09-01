import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const post = await prisma.post.create({ data });
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
