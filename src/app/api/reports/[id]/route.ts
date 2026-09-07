import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/reports/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (session.user.role !== 'ADMIN' && session.user.role !== 'MODERATOR') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const report = await prisma.report.findUnique({
      where: { id: params.id },
      include: {
        reporter: { select: { id: true, name: true, username: true, email: true } },
        moderator: { select: { id: true, name: true, username: true } },
      },
    });
    if (!report) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ report });
  } catch (err) {
    console.error('[GET /api/reports/:id]', err);
    return NextResponse.json({ error: 'Failed to fetch report' }, { status: 500 });
  }
}

// PUT /api/reports/[id] — resolve/dismiss a report (admin/mod only)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (session.user.role !== 'ADMIN' && session.user.role !== 'MODERATOR') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const action = body.action; // 'resolve' | 'dismiss'

    if (!['resolve', 'dismiss'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action. Use "resolve" or "dismiss".' }, { status: 400 });
    }

    const status = action === 'resolve' ? 'RESOLVED' : 'DISMISSED';

    // Get the report to find the communityPost
    const report = await prisma.report.findUnique({
      where: { id: params.id },
      select: { communityPostId: true, targetType: true, targetId: true, status: true },
    });

    const updated = await prisma.report.update({
      where: { id: params.id },
      data: {
        status,
        moderatorId: session.user.id,
        moderatorNote: body.note || null,
        resolvedAt: new Date(),
      },
      include: {
        reporter: { select: { id: true, name: true, username: true, email: true } },
        moderator: { select: { id: true, name: true, username: true } },
      },
    });

    // If resolved and it targets a community post, hide the post
    if (status === 'RESOLVED' && report?.communityPostId) {
      await prisma.communityPost.update({
        where: { id: report.communityPostId },
        data: { status: 'HIDDEN' },
      });
    }

    return NextResponse.json({ report: updated });
  } catch (err) {
    console.error('[PUT /api/reports/:id]', err);
    return NextResponse.json({ error: 'Failed to update report' }, { status: 500 });
  }
}
