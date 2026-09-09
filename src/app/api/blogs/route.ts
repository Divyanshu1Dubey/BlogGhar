import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Simple HTML sanitizer for server-side use
function sanitizeHtml(html: string): string {
  if (!html) return html;
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '');
}

// GET /api/custom-blogs — list custom code blogs (auth required for authoring)
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const status = url.searchParams.get('status'); // DRAFT | PUBLISHED | etc.
    const authorId = url.searchParams.get('authorId');
    const cursor = url.searchParams.get('cursor');
    const take = Math.min(parseInt(url.searchParams.get('take') || '20'), 50);
    const session = await getServerSession(authOptions);

    const where: any = {};
    // If not logged in, only show published
    if (!session?.user?.id) {
      where.status = 'PUBLISHED';
    } else if (status) {
      where.status = status;
    } else {
      // Logged in but no filter: show own drafts + published
      where.OR = [{ status: 'PUBLISHED' }, { AND: [{ status: 'DRAFT' }, { authorId: session.user.id }] }];
    }
    if (authorId) where.authorId = authorId;

    const blogs = await prisma.post.findMany({
      where,
      take: take + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: [{ createdAt: 'desc' }],
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        seoTitle: true,
        seoDesc: true,
        status: true,
        format: true,
        isFeatured: true,
        views: true,
        createdAt: true,
        updatedAt: true,
        publishedAt: true,
        scheduledFor: true,
        categoryId: true,
        category: { select: { id: true, name: true, slug: true, color: true } },
        tags: true,
        author: {
          select: { id: true, name: true, image: true, role: true },
        },
      },
    });

    const nextCursor = blogs.length > take ? blogs[blogs.length - 2]?.id : null;
    return NextResponse.json({
      posts: blogs.slice(0, take),
      nextCursor,
    });
  } catch (err) {
    console.error('[GET /api/custom-blogs]', err);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

// POST /api/custom-blogs — create a new blog
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isBanned: true, role: true },
    });

    if (user?.isBanned) {
      return NextResponse.json({ error: 'Your account is currently restricted.' }, { status: 403 });
    }

    const body = await req.json();
    const isAdmin = user?.role === 'ADMIN';
    // Non-admins cannot use CUSTOM_CODE format
    const format = body.format === 'CUSTOM_CODE' && isAdmin ? 'CUSTOM_CODE' : 'STANDARD';

    const data: any = {
      authorId: session.user.id,
      title: body.title || 'Untitled',
      slug: body.slug || generateSlug(body.title || 'untitled'),
      content: body.content || '',
      status: body.status || 'DRAFT',
      format,
      postType: body.postType || 'BLOG',
      categoryId: body.categoryId || null,
    };

    if (body.excerpt) data.excerpt = body.excerpt;
    if (body.seoTitle) data.seoTitle = body.seoTitle;
    if (body.seoDesc) data.seoDesc = body.seoDesc;
    if (body.canonicalUrl) data.canonicalUrl = body.canonicalUrl;
    if (body.ogImage) data.ogImage = body.ogImage;
    if (body.focusKeyword) data.focusKeyword = body.focusKeyword;
    if (body.tags) data.tags = body.tags;
    if (body.featuredImage) data.featuredImage = body.featuredImage;
    if (body.isFeatured !== undefined) data.isFeatured = body.isFeatured;
    if (body.scheduledFor) data.scheduledFor = body.scheduledFor ? new Date(body.scheduledFor) : null;

    if (format === 'CUSTOM_CODE') {
      data.customHtml = sanitizeHtml(body.customHtml || '');
      data.customCss = body.customCss || '';
      data.customJs = body.customJs || '';
      data.customMeta = body.customMeta ? JSON.stringify(body.customMeta) : null;
      data.content = data.customHtml || data.content;
    }

    const blog = await prisma.post.create({ data });
    return NextResponse.json({ blog }, { status: 201 });
  } catch (err: any) {
    console.error('[POST /api/custom-blogs]', err);
    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'A blog with this slug already exists.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
  }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
}
