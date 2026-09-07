import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/dashboard - get author dashboard data
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const requestedUserId = url.searchParams.get('userId');
    const sessionUserId = session.user.id;

    // Allow admins to query any user; otherwise only own data
    const isAdmin = session.user.role === 'ADMIN';
    const targetUserId = (requestedUserId && isAdmin) ? requestedUserId : sessionUserId;

    const [posts, published, drafts, communityCount, postViews, recentPosts, recentCommunity] = await Promise.all([
      prisma.post.count({ where: { authorId: targetUserId } }),
      prisma.post.count({ where: { authorId: targetUserId, status: 'PUBLISHED' } }),
      prisma.post.count({ where: { authorId: targetUserId, status: 'DRAFT' } }),
      prisma.communityPost.count({ where: { authorId: targetUserId } }),
      prisma.post.aggregate({ where: { authorId: targetUserId }, _sum: { views: true } }),
      prisma.post.findMany({
        where: { authorId: targetUserId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          category: { select: { id: true, name: true, slug: true, icon: true } },
          _count: { select: { comments: true } },
        },
      }),
      prisma.communityPost.findMany({
        where: { authorId: targetUserId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    return NextResponse.json({
      stats: {
        posts,
        published,
        drafts,
        views: postViews._sum.views || 0,
        community: communityCount,
      },
      recentPosts,
      recentCommunity,
    });
  } catch (err) {
    console.error('[GET /api/dashboard]', err);
    return NextResponse.json({ stats: { posts: 0, published: 0, drafts: 0, views: 0, community: 0 }, recentPosts: [], recentCommunity: [] });
  }
}
