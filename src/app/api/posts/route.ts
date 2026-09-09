import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
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

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!(session?.user as any)?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const authorId = (session as any).user.id;
    const data = await request.json();

    const sanitizedData = {
      ...data,
      customHtml: data.customHtml ? sanitizeHtml(data.customHtml) : null,
      content: data.content ? sanitizeHtml(data.content) : data.content,
    };

    const post = await prisma.post.create({ data: { ...sanitizedData, authorId } });
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
