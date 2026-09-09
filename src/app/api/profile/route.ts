import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { name, bio, username } = body;

    // Check username uniqueness if being changed
    if (username) {
      const existing = await prisma.user.findFirst({
        where: { username, NOT: { id: userId } },
      });
      if (existing) {
        return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
      }
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined && { name }),
        ...(bio !== undefined && { bio }),
        ...(username !== undefined && { username }),
      },
      select: { id: true, name: true, email: true, bio: true, username: true, image: true },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
