import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/community/posts/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.communityPost.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true, name: true, image: true, role: true,
          },
        },
        category: {
          select: { id: true, name: true, slug: true, color: true },
        },
      },
    });
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ post });
  } catch (err) {
    console.error('[GET /api/community/posts/:id]', err);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

// PUT /api/community/posts/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const post = await prisma.communityPost.findUnique({
      where: { id: params.id },
      select: { authorId: true, status: true },
    });
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const isAuthor = post.authorId === session.user.id;
    const isMod = session.user.role === 'ADMIN' || session.user.role === 'MODERATOR';

    if (!isAuthor && !isMod) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const update: any = {};
    if (body.content !== undefined) update.content = body.content;
    if (body.kind !== undefined) update.kind = body.kind;
    if (body.linkUrl !== undefined) update.linkUrl = body.linkUrl || null;
    if (body.linkTitle !== undefined) update.linkTitle = body.linkTitle || null;
    if (body.linkDesc !== undefined) update.linkDesc = body.linkDesc || null;
    if (body.imageUrl !== undefined) update.imageUrl = body.imageUrl || null;
    if (body.categoryId !== undefined) update.categoryId = body.categoryId || null;

    // Only mods/admins can change status or pin
    if (isMod) {
      if (body.status !== undefined) update.status = body.status;
      if (body.isPinned !== undefined) update.isPinned = body.isPinned;
    }

    const updated = await prisma.communityPost.update({
      where: { id: params.id },
      data: update,
      include: {
        author: {
          select: {
            id: true, name: true, image: true, role: true,
          },
        },
        category: {
          select: { id: true, name: true, slug: true, color: true },
        },
      },
    });
    return NextResponse.json({ post: updated });
  } catch (err) {
    console.error('[PUT /api/community/posts/:id]', err);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

// DELETE /api/community/posts/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const post = await prisma.communityPost.findUnique({
      where: { id: params.id },
      select: { authorId: true },
    });
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const isAuthor = post.authorId === session.user.id;
    const isMod = session.user.role === 'ADMIN' || session.user.role === 'MODERATOR';

    if (!isAuthor && !isMod) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.communityPost.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[DELETE /api/community/posts/:id]', err);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
