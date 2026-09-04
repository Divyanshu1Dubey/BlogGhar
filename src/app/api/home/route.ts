import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function safeCount<T>(
  promise: Promise<number>,
  fallback = 0,
): Promise<number> {
  try {
    const result = await promise;
    return typeof result === 'number' ? result : fallback;
  } catch {
    return fallback;
  }
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      take: 20,
      include: { _count: { select: { posts: true } } },
      orderBy: { posts: { _count: 'desc' } },
    });

    const featuredPosts = await prisma.post.findMany({
      where: { postType: 'BLOG', status: 'PUBLISHED' },
      take: 3,
      orderBy: { publishedAt: 'desc' },
      include: {
        author: { select: { name: true, image: true } },
        category: { select: { name: true, slug: true, icon: true } },
      },
    });

    const trendingPosts = await prisma.post.findMany({
      where: { postType: 'BLOG', status: 'PUBLISHED' },
      take: 6,
      orderBy: { views: 'desc' },
      include: {
        author: { select: { name: true } },
        category: { select: { name: true, slug: true, icon: true } },
      },
    });

    const games = await prisma.game.findMany({
      where: { isActive: true },
      orderBy: { playCount: 'desc' },
      take: 8,
    });

    const news = await prisma.post.findMany({
      where: { postType: 'NEWS', status: 'PUBLISHED' },
      take: 8,
      orderBy: { publishedAt: 'desc' },
      include: { category: { select: { name: true, slug: true } } },
    });

    let popularTools: any[] = [];
    try {
      popularTools = await prisma.tool.findMany({
        where: { isActive: true },
        orderBy: { usages: { _count: 'desc' } },
        take: 8,
      });
    } catch {
      popularTools = await prisma.tool.findMany({
        where: { isActive: true },
        take: 8,
      });
    }

    const [blogCount, gameCount, toolCount, dailyVisitors] = await Promise.all([
      safeCount(prisma.post.count({ where: { status: 'PUBLISHED', postType: 'BLOG' } })),
      safeCount(prisma.game.count({ where: { isActive: true } })),
      safeCount(prisma.tool.count({ where: { isActive: true } })),
      safeCount(
        prisma.pageView.count({
          where: { visitedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
        }),
      ),
    ]);

    return NextResponse.json({
      categories,
      featuredPosts,
      trendingPosts,
      games,
      news,
      popularTools,
      stats: {
        blogCount,
        gameCount,
        toolCount,
        dailyVisitors,
      },
    });
  } catch (error) {
    console.error('Home API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch home data',
        categories: [],
        featuredPosts: [],
        trendingPosts: [],
        games: [],
        news: [],
        popularTools: [],
        stats: { blogCount: 0, gameCount: 0, toolCount: 0, dailyVisitors: 0 },
      },
      { status: 200 },
    );
  }
}
