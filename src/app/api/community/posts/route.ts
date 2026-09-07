import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CommunityPostSchema } from '@/lib/validation';
import { sanitizeHtml } from '@/lib/sanitize';

// GET /api/community/posts - list community posts (public)
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const kind = url.searchParams.get('kind');
    const authorId = url.searchParams.get('authorId');
    const categoryId = url.searchParams.get('categoryId');
    const cursor = url.searchParams.get('cursor');
    const take = Math.min(parseInt(url.searchParams.get('take') || '20'), 50);
    const session = await getServerSession(authOptions);

    const where: any = {
      status: 'PUBLISHED',
    };
    if (kind) where.kind = kind;
    if (authorId) where.authorId = authorId;
    if (categoryId) where.categoryId = categoryId;

    const posts = await prisma.communityPost.findMany({
      where,
      take: take + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
      include: {
        author: {
          select: {
            id: true, name: true, image: true, role: true,
          },
        },
        category: {
          select: { id: true, name: true, slug: true, color: true },
        },
        _count: {
          select: { reports: true },
        },
      },
    });

    const nextCursor = posts.length > take ? posts[posts.length - 2]?.id : null;
    const visible = posts.slice(0, take);

    return NextResponse.json({
      posts: visible.map((p) => ({
        ...p,
        content: sanitizeHtml(p.content),
        author: {
          ...p.author,
          isAdmin: p.author.role === 'ADMIN' || p.author.role === 'MODERATOR',
        },
      })),
      nextCursor,
    });
  } catch (err) {
    console.error('[GET /api/community/posts]', err);
    return NextResponse.json(
      { error: 'Failed to fetch community posts', posts: [] },
      { status: 200 }
    );
  }
}

// POST /api/community/posts - create a community post (auth required)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = CommunityPostSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isBanned: true, role: true },
    });

    if (user?.isBanned) {
      return NextResponse.json(
        { error: 'Your account is currently restricted from posting.' },
        { status: 403 }
      );
    }

    // For now we publish immediately; a future moderator queue can move to a PENDING status.
    const cleanContent = sanitizeHtml(parsed.data.content).slice(0, 2000);

    const post = await prisma.communityPost.create({
      data: {
        authorId: session.user.id,
        content: cleanContent,
        kind: parsed.data.kind,
        linkUrl: parsed.data.linkUrl || null,
        linkTitle: parsed.data.linkTitle || null,
        linkDesc: parsed.data.linkDesc || null,
        imageUrl: parsed.data.imageUrl || null,
        categoryId: parsed.data.categoryId || null,
        status: 'PUBLISHED',
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/community/posts]', err);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
