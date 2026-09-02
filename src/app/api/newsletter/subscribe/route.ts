import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { name, email } = await request.json();

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const displayName = name || 'Subscriber';
    const subscriber = await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { name: displayName !== 'Subscriber' ? displayName : undefined },
      create: { name: displayName, email },
    });

    return new Response(JSON.stringify({ success: true, subscriber }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to subscribe' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
