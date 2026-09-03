import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export async function PATCH(request: Request) {
  const auth = await requireAdmin();
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  try {
    const { id, role, isBanned } = await request.json();
    if (!id || (role !== undefined && !['USER', 'ADMIN', 'EDITOR'].includes(role))) {
      return NextResponse.json({ error: 'Invalid user update' }, { status: 400 });
    }
    const user = await prisma.user.update({
      where: { id },
      data: { ...(role !== undefined ? { role } : {}), ...(isBanned !== undefined ? { isBanned: Boolean(isBanned) } : {}) },
      select: { id: true, name: true, email: true, role: true, isBanned: true },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.error('Admin user update failed', error);
    return NextResponse.json({ error: 'Unable to update user' }, { status: 500 });
  }
}
