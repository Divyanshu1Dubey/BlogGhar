import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const GAME_SLUG_ALIASES: Record<string, string> = {
  '/games/dice': '/games/dice-game',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const target = GAME_SLUG_ALIASES[pathname];
  if (target) {
    const url = request.nextUrl.clone();
    url.pathname = target;
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/games/dice'],
};
