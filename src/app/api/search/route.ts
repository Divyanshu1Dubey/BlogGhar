import { NextResponse } from 'next/server';
import { db, getAvailable } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all';

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const results: any[] = [];

    if (type === 'all' || type === 'post') {
      const posts = await db.post.findMany({
        where: {
          status: 'PUBLISHED',
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
            { excerpt: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 5,
        include: { author: { select: { name: true } }, category: { select: { name: true, slug: true } } },
      });
      posts.forEach((p: any) => {
        results.push({ type: 'post', title: p.title, slug: p.slug, description: p.excerpt || '', url: `/blog/${p.slug}` });
      });
    }

    if (type === 'all' || type === 'game') {
      const games = await db.game.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 3,
      });
      games.forEach((g: any) => {
        results.push({ type: 'game', title: g.name, slug: g.slug, description: g.description, url: `/games/${g.slug}` });
      });
    }

    if (type === 'all' || type === 'news') {
      const news = await db.post.findMany({
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
      news.forEach((n: any) => {
        results.push({ type: 'news', title: n.title, slug: n.slug, description: n.excerpt || '', url: `/news/${n.slug}` });
      });
    }

    if (type === 'all' || type === 'community') {
      const posts = await db.communityPost.findMany({
        where: {
          status: 'PUBLISHED',
          content: { contains: query, mode: 'insensitive' },
        },
        take: 5,
        include: { author: { select: { name: true } } },
      });
      posts.forEach((p: any) => {
        results.push({ type: 'community', title: p.content.slice(0, 100), slug: p.id, description: `by ${p.author?.name || 'Anonymous'}`, url: `/community` });
      });
    }

    if (type === 'all' || type === 'user') {
      const users = await db.user.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 3,
        select: { id: true, name: true },
      });
      users.forEach((u: any) => {
        const username = u.email?.split('@')[0] || u.id;
        results.push({ type: 'user', title: u.name || 'User', slug: username, description: `Creator`, url: `/profile/${username}` });
      });
    }

    return NextResponse.json({ results });
  } catch (err) {
    console.error('[GET /api/search]', err);
    return NextResponse.json({ results: [] });
  }
}
