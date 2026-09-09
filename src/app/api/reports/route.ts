import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    const body = await request.json();
    const { targetType, targetId, reason, details, communityPostId } = body;

    if (!targetType || !targetId || !reason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const validTypes = ['post', 'comment', 'community_post', 'user'];
    if (!validTypes.includes(targetType)) {
      return NextResponse.json({ error: 'Invalid target type' }, { status: 400 });
    }

    const validReasons = ['SPAM', 'ABUSE', 'MISINFORMATION', 'OTHER'];
    const normalizedReason = validReasons.includes(reason.toUpperCase()) ? reason.toUpperCase() : 'OTHER';

    const report = await prisma.report.create({
      data: {
        reporterId: userId || 'anonymous',
        targetType,
        targetId,
        reason: normalizedReason,
        details: details || null,
        communityPostId: communityPostId || null,
      },
      include: {
        reporter: { select: { name: true, email: true } },
      },
    });

    return NextResponse.json({ success: true, report }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 });
  }
}
