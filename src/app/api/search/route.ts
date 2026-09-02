import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all';

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const results: any[] = [];

    // Search posts
    if (type === 'all' || type === 'post') {
      const posts = await prisma.post.findMany({
        where: {
          status: 'PUBLISHED',
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
            { excerpt: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 5,
        include: { category: { select: { name: true, slug: true } } },
      });
      posts.forEach((p) => {
        results.push({ type: 'post', title: p.title, slug: p.slug, description: p.excerpt || '', url: `/blog/${p.slug}` });
      });
    }

    // Search games
    if (type === 'all' || type === 'game') {
      const games = await prisma.game.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 3,
      });
      games.forEach((g) => {
        results.push({ type: 'game', title: g.name, slug: g.slug, description: g.description, url: `/games/${g.slug}` });
      });
    }

    // Search news
    if (type === 'all' || type === 'news') {
      const news = await prisma.post.findMany({
        where: {
          postType: 'NEWS',
          status: 'PUBLISHED',
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 5,
      });
      news.forEach((n) => {
        results.push({ type: 'news', title: n.title, slug: n.slug, description: n.excerpt || '', url: `/news/${n.slug}` });
      });
    }

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] });
  }
}
