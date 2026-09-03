import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export async function PATCH(request: Request) {
  const auth = await requireAdmin();
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  try {
    const { id, isApproved } = await request.json();
    if (!id || typeof isApproved !== 'boolean') return NextResponse.json({ error: 'Invalid comment update' }, { status: 400 });
    return NextResponse.json(await prisma.comment.update({ where: { id }, data: { isApproved } }));
  } catch (error) {
    console.error('Admin comment update failed', error);
    return NextResponse.json({ error: 'Unable to update comment' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin();
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Comment id is required' }, { status: 400 });
    await prisma.comment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin comment deletion failed', error);
    return NextResponse.json({ error: 'Unable to delete comment' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Comment id is required' }, { status: 400 });
  const auth = await requireAdmin();
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  try {
    await prisma.comment.delete({ where: { id } });
    return NextResponse.redirect(new URL('/admin/comments', request.url), 303);
  } catch (error) {
    console.error('Admin comment deletion failed', error);
    return NextResponse.json({ error: 'Unable to delete comment' }, { status: 500 });
  }
}
