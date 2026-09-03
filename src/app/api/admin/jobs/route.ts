import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export async function PATCH(request: Request) {
  const auth = await requireAdmin();
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  try {
    const { id, isActive } = await request.json();
    if (!id || typeof isActive !== 'boolean') return NextResponse.json({ error: 'Invalid job update' }, { status: 400 });
    return NextResponse.json(await prisma.jobListing.update({ where: { id }, data: { isActive } }));
  } catch (error) {
    console.error('Admin job update failed', error);
    return NextResponse.json({ error: 'Unable to update job' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin();
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Job id is required' }, { status: 400 });
    await prisma.jobListing.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin job deletion failed', error);
    return NextResponse.json({ error: 'Unable to delete job' }, { status: 500 });
  }
}
