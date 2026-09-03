import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { content, title, slug, excerpt, categoryId, tags, status, featuredImage, postType, readTime } = body;

    if (!content?.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    // Auto-generate missing fields
    const { parseContent } = await import('@/lib/content-parser');
    const parsed = parseContent(content);

    const post = await prisma.post.create({
      data: {
        title: title || parsed.title || 'Untitled Post',
        slug: slug || parsed.slug || `post-${Date.now()}`,
        content: content.includes('<') ? content : parsed.content,
        excerpt: excerpt || parsed.excerpt || '',
        featuredImage: featuredImage || '',
        postType: postType || 'BLOG',
        status: status || 'DRAFT',
        categoryId: categoryId || '',
        authorId: (session.user as any).id,
        readTime: readTime || parsed.readTime,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
      },
      include: {
        author: { select: { name: true, email: true } },
        category: { select: { name: true, slug: true } },
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (err) {
    console.error('Error creating post:', err);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
