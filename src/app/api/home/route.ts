import { NextResponse } from 'next/server';
import { db, getAvailable } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function safeCount(model: 'post' | 'game' | 'tool' | 'pageView', where?: any): Promise<number> {
  const result = await db[model].count(where);
  return typeof result === 'number' ? result : 0;
}

export async function GET() {
  if (!getAvailable()) {
    return NextResponse.json({
      error: 'Database not configured',
      categories: [],
      featuredPosts: [],
      trendingPosts: [],
      games: [],
      news: [],
      popularTools: [],
      stats: { blogCount: 0, gameCount: 0, toolCount: 0, dailyVisitors: 0 },
    });
  }

  try {
    const [categories, featuredPosts, trendingPosts, games, news, popularTools] = await Promise.all([
      db.category.findMany({
        take: 20,
        include: { _count: { select: { posts: true } } },
        orderBy: { posts: { _count: 'desc' } },
      }),
      db.post.findMany({
        where: { postType: 'BLOG', status: 'PUBLISHED' },
        take: 3,
        orderBy: { publishedAt: 'desc' },
        include: {
          author: { select: { name: true, image: true } },
          category: { select: { name: true, slug: true, icon: true } },
        },
      }),
      db.post.findMany({
        where: { postType: 'BLOG', status: 'PUBLISHED' },
        take: 6,
        orderBy: { views: 'desc' },
        include: {
          author: { select: { name: true } },
          category: { select: { name: true, slug: true, icon: true } },
        },
      }),
      db.game.findMany({
        where: { isActive: true },
        orderBy: { playCount: 'desc' },
        take: 8,
      }),
      db.post.findMany({
        where: { postType: 'NEWS', status: 'PUBLISHED' },
        take: 8,
        orderBy: { publishedAt: 'desc' },
        include: { category: { select: { name: true, slug: true } } },
      }),
      db.tool.findMany({
        where: { isActive: true },
        orderBy: { usages: { _count: 'desc' } },
        take: 8,
      }).catch(() =>
        db.tool.findMany({
          where: { isActive: true },
          take: 8,
        }),
      ),
    ]);

    const [blogCount, gameCount, toolCount, dailyVisitors] = await Promise.all([
      safeCount('post', { where: { status: 'PUBLISHED', postType: 'BLOG' } }),
      safeCount('game', { where: { isActive: true } }),
      safeCount('tool', { where: { isActive: true } }),
      safeCount('pageView', {
        where: { visitedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
      }),
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
