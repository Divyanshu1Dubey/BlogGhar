import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET() {
  const auth = await requireAdmin();
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  try {
    const rows = await prisma.siteConfig.findMany();
    return NextResponse.json(Object.fromEntries(rows.map((row) => [row.key, row.value])));
  } catch (error) {
    console.error('Admin settings read failed', error);
    return NextResponse.json({ error: 'Unable to load settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const auth = await requireAdmin();
  if ('error' in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  try {
    const values = await request.json();
    if (!values || typeof values !== 'object' || Array.isArray(values)) return NextResponse.json({ error: 'Invalid settings' }, { status: 400 });
    await prisma.$transaction(Object.entries(values).map(([key, value]) =>
      prisma.siteConfig.upsert({ where: { key }, create: { key, value: String(value ?? '') }, update: { value: String(value ?? '') } }),
    ));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin settings save failed', error);
    return NextResponse.json({ error: 'Unable to save settings' }, { status: 500 });
  }
}
