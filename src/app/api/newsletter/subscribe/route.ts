import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { name, email } = await request.json();

    if (!name || !email) {
      return new Response(JSON.stringify({ error: 'Name and email are required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const subscriber = await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { name },
      create: { name, email },
    });

    return new Response(JSON.stringify({ success: true, subscriber }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to subscribe' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
