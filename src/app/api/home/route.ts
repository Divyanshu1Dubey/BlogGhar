import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [
      categories,
      featuredPosts,
      trendingPosts,
      games,
      news,
      popularTools,
      stats,
    ] = await Promise.all([
      prisma.category.findMany({ take: 20, include: { _count: { select: { posts: true } } }, orderBy: { posts: { _count: 'desc' } } }),
      prisma.post.findMany({
        where: { postType: 'BLOG', status: 'PUBLISHED' },
        take: 3,
        orderBy: { publishedAt: 'desc' },
        include: {
          author: { select: { name: true, image: true } },
          category: { select: { name: true, slug: true, icon: true } },
        },
      }),
      prisma.post.findMany({
        where: { postType: 'BLOG', status: 'PUBLISHED' },
        take: 6,
        orderBy: { views: 'desc' },
        include: {
          author: { select: { name: true } },
          category: { select: { name: true, slug: true, icon: true } },
        },
      }),
      prisma.game.findMany({
        where: { isActive: true },
        orderBy: { playCount: 'desc' },
        take: 8,
      }),
      prisma.post.findMany({
        where: { postType: 'NEWS', status: 'PUBLISHED' },
        take: 8,
        orderBy: { publishedAt: 'desc' },
        include: { category: { select: { name: true, slug: true } } },
      }),
      prisma.tool.findMany({
        where: { isActive: true },
        orderBy: { usageCount: 'desc' },
        take: 8,
      }),
      Promise.all([
        prisma.post.count({ where: { status: 'PUBLISHED', postType: 'BLOG' } }),
        prisma.game.count({ where: { isActive: true } }),
        prisma.tool.count({ where: { isActive: true } }),
        prisma.toolUsage.count(),
      ]).then(([blogCount, gameCount, toolCount, usageCount]) => ({
        blogCount,
        gameCount,
        toolCount,
        dailyVisitors: usageCount > 0 ? Math.max(3200, Math.floor(usageCount / 30)) : 3200,
      })),
    ]);

    return NextResponse.json({
      categories,
      featuredPosts,
      trendingPosts,
      games,
      news,
      popularTools,
      stats,
    });
  } catch (error) {
    console.error('Home API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch home data' },
      { status: 500 }
    );
  }
}
