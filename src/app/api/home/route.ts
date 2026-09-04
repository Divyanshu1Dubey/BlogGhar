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
        orderBy: { usages: { _count: 'desc' } },
        take: 8,
      }),
      Promise.all([
        prisma.post.count({ where: { status: 'PUBLISHED', postType: 'BLOG' } }).catch(() => 0),
        prisma.game.count({ where: { isActive: true } }).catch(() => 0),
        prisma.tool.count({ where: { isActive: true } }).catch(() => 0),
        prisma.pageView.count({
          where: { visitedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
        }).catch(() => 0),
      ]).then(([blogCount, gameCount, toolCount, dailyVisitors]) => ({
        blogCount,
        gameCount,
        toolCount,
        dailyVisitors,
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
