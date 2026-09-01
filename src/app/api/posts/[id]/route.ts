import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

type PostIdParams = Promise<{ id: string }>;

export async function GET(
  request: Request,
  { params }: { params: PostIdParams }
) {
  try {
    const { id } = await params;
    const post = await prisma.post.findUnique({
      where: { id },
      include: { user: { select: { name: true } }, category: { select: { name: true, slug: true } } },
    });
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: PostIdParams }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const post = await prisma.post.update({ where: { id }, data });
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: PostIdParams }
) {
  try {
    const { id } = await params;
    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
