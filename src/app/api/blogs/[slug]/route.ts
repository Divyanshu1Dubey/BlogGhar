import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PostMetaSchema, PostStatusEnum, PostFormatEnum } from '@/lib/validation';
import { sanitizeHtml, htmlToText } from '@/lib/sanitize';

// Public GET by slug; auth required GET by id available via ?id=
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const url = new URL(req.url);
    const byId = url.searchParams.get('id');

    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    const userRole = (session?.user as any)?.role;

    let post: any = null;

    if (byId) {
      // Fetching by id — used by admin editors
      if (userRole !== 'ADMIN' && userRole !== 'MODERATOR') {
        const post2 = await prisma.post.findUnique({ where: { id: byId } });
        if (!post2) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        const ownsIt = post2.authorId === userId;
        const isPublished = post2.status === 'PUBLISHED';
        if (!ownsIt && !isPublished) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
        post = post2;
      } else {
        post = await prisma.post.findUnique({ where: { id: byId } });
      }
    } else {
      post = await prisma.post.findUnique({
        where: { slug: params.slug },
        include: {
          author: { select: { id: true, name: true, image: true, role: true } },
          category: { select: { id: true, name: true, slug: true, color: true } },
        },
      });
      if (!post || post.status !== 'PUBLISHED') {
        post = null;
      }
    }

    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Increment views when fetched publicly by slug
    if (!byId && post.status === 'PUBLISHED') {
      prisma.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } }).catch(() => {});
    }

    return NextResponse.json({ post });
  } catch (err) {
    console.error('[GET /api/blogs/[slug]]', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

// PUT /api/blogs/[slug] — update a post (author or admin)
export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existing = await prisma.post.findUnique({
      where: { slug: params.slug },
      select: { id: true, authorId: true, status: true },
    });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const isAuthor = existing.authorId === session.user.id;
    const isAdmin = (session.user as any).role === 'ADMIN';
    if (!isAuthor && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = PostMetaSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', issues: parsed.error.issues },
        { status: 400 }
      );
    }
    const data = parsed.data;

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
    if (data.featuredImage !== undefined) updateData.featuredImage = data.featuredImage || null;
    if (data.seoTitle !== undefined) updateData.seoTitle = data.seoTitle;
    if (data.seoDesc !== undefined) updateData.seoDesc = data.seoDesc;
    if (data.canonicalUrl !== undefined) updateData.canonicalUrl = data.canonicalUrl || null;
    if (data.ogImage !== undefined) updateData.ogImage = data.ogImage || null;
    if (data.focusKeyword !== undefined) updateData.focusKeyword = data.focusKeyword;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    if (data.format !== undefined && isAdmin) updateData.format = data.format;
    if (data.relatedIds !== undefined) updateData.relatedIds = data.relatedIds;
    if (data.faqs !== undefined) updateData.faqs = data.faqs;
    if (data.isFeatured !== undefined && isAdmin) updateData.isFeatured = data.isFeatured;
    if (data.customHtml !== undefined) updateData.customHtml = sanitizeHtml(data.customHtml || '');
    if (data.customCss !== undefined) updateData.customCss = data.customCss;
    if (data.customJs !== undefined) updateData.customJs = data.customJs;
    if (data.customMeta !== undefined) updateData.customMeta = data.customMeta;

    // Handle content change
    if (data.content !== undefined) {
      updateData.content = sanitizeHtml(data.content);

      // Auto-set status transitions for non-admins
      if (!isAdmin) {
        if (existing.status === 'PUBLISHED' && data.content) {
          // Anyone who owns the post can edit content; published stays published
        }
      }
    }

    // Status / scheduledFor
    if (data.status !== undefined) {
      updateData.status = data.status;
      if (data.status === 'PUBLISHED') {
        updateData.publishedAt = new Date();
      }
    }
    if (data.scheduledFor !== undefined) {
      updateData.scheduledFor = data.scheduledFor ? new Date(data.scheduledFor) : null;
    }

    if (data.slug && data.slug !== params.slug) {
      updateData.slug = data.slug;
    }

    const post = await prisma.post.update({
      where: { id: existing.id },
      data: updateData,
    });

    return NextResponse.json({ post });
  } catch (err) {
    console.error('[PUT /api/blogs/[slug]]', err);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

// DELETE /api/blogs/[slug]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const existing = await prisma.post.findUnique({
      where: { slug: params.slug },
      select: { id: true, authorId: true },
    });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const isAuthor = existing.authorId === session.user.id;
    const isAdmin = (session.user as any).role === 'ADMIN';
    if (!isAuthor && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.post.delete({ where: { id: existing.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[DELETE /api/blogs/[slug]]', err);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
