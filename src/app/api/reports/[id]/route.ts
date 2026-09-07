import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// PATCH /api/reports/[id] — moderator action: resolve or dismiss
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session?.user?.id || !['ADMIN', 'MODERATOR'].includes(role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const status = (body.status || body.action || '').toUpperCase();

    if (!['RESOLVED', 'DISMISSED', 'OPEN'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updated = await prisma.report.update({
      where: { id: params.id },
      data: {
        status: status === 'OPEN' ? 'OPEN' : (status as 'RESOLVED' | 'DISMISSED'),
        moderatorId: session.user.id,
        moderatorNote: body.note || null,
        resolvedAt: status !== 'OPEN' ? new Date() : null,
      },
    });

    return NextResponse.json({ report: updated });
  } catch (err) {
    console.error('[PATCH /api/reports/[id]]', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

// POST with form-encoded data (HTML form submissions)
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session?.user?.id || !['ADMIN', 'MODERATOR'].includes(role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const contentType = req.headers.get('content-type') || '';
    let action: string = '';

    if (contentType.includes('application/json')) {
      const body = await req.json();
      action = (body.action || body.status || '').toUpperCase();
    } else {
      const formData = await req.formData();
      action = (formData.get('action') as string || '').toUpperCase();
    }

    if (!['RESOLVED', 'DISMISSED', 'OPEN'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const updated = await prisma.report.update({
      where: { id: params.id },
      data: {
        status: action === 'OPEN' ? 'OPEN' : (action as 'RESOLVED' | 'DISMISSED'),
        moderatorId: session.user.id,
        resolvedAt: action !== 'OPEN' ? new Date() : null,
      },
    });

    return NextResponse.json({ report: updated });
  } catch (err) {
    console.error('[POST /api/reports/[id]]', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
