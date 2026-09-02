import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
    if (existing?.isVerified) {
      return NextResponse.json({ error: 'Already subscribed!' }, { status: 400 });
    }

    const token = crypto.randomUUID();

    if (existing) {
      await prisma.newsletterSubscriber.update({
        where: { email },
        data: { isVerified: true, subscribedAt: new Date() },
      });
    } else {
      const session = await auth();
      const userId = session?.user?.id || null;
      await prisma.newsletterSubscriber.create({
        data: { email, name: name || null, isVerified: true, userId },
      });
    }

    return NextResponse.json({ success: true, message: 'Subscribed successfully!' }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
