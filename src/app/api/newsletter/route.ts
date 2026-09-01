import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const existing = await prisma.subscriber.findUnique({ where: { email } });
    if (existing?.unsubscribedAt) {
      return NextResponse.json({ error: 'This email was previously unsubscribed' }, { status: 400 });
    }
    if (existing) {
      return NextResponse.json({ error: 'Already subscribed!' }, { status: 400 });
    }

    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    await prisma.subscriber.create({
      data: { email, name, token },
    });

    return NextResponse.json({ success: true, message: 'Subscribed successfully!' }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
