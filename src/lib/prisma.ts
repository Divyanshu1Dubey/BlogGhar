/**
 * Safe Prisma wrapper — returns empty results instead of throwing when the
 * database is unavailable (e.g. no DATABASE_URL at build/runtime on Vercel).
 */

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// ── No-op stub so callers never hit "Cannot read properties of undefined" ────
function createNoopStub(): PrismaClient {
  const noop = () => Promise.resolve([]);
  const noopOne = () => Promise.resolve(null);
  const noopCount = () => Promise.resolve(0);
  return {
    $disconnect: async () => {},
    $connect: async () => {},
    $transaction: async (fn: any) => fn({} as PrismaClient),
    post:      { findMany: noop, findUnique: noopOne, count: noopCount, create: noopOne, update: noopOne },
    game:      { findMany: noop, findUnique: noopOne, count: noopCount, update: noopOne },
    gameScore: { findMany: noop, create: noopOne },
    category:  { findMany: noop, findUnique: noopOne, count: noopCount },
    tool:      { findMany: noop, findUnique: noopOne, count: noopCount },
    pageView:  { count: noopCount, create: noopOne },
    newsArticle: { findMany: noop, findUnique: noopOne },
    comment:   { findMany: noop, findUnique: noopOne, create: noopOne, count: noopCount },
    user:      { findUnique: noopOne, findMany: noop },
    jobListing:{ findMany: noop, findUnique: noopOne, count: noopCount },
    forum:     { findMany: noop, findUnique: noopOne },
    forumPost: { findMany: noop, findUnique: noopOne, create: noopOne },
    qnaQuestion: { findMany: noop },
    tag:       { findUnique: noopOne },
    bookmark:  { findMany: noop },
    newsletterSubscriber: { findMany: noop, findUnique: noopOne, create: noopOne, count: noopCount },
    siteConfig:{ findMany: noop, findUnique: noopOne, upsert: noopOne },
    achievement: { findMany: noop },
    subscription: { findMany: noop },
    toolUsage: { findMany: noop },
    account:   { findMany: noop },
    session:   { findMany: noop },
    profile:   { findMany: noop },
    like:      { findMany: noop },
    newsCategory: { findMany: noop },
    jobApplication: { findMany: noop },
    affiliateLink: { findMany: noop },
    qnaAnswer: { findMany: noop },
  } as unknown as PrismaClient;
}

let _prismaInternal: PrismaClient;
try {
  _prismaInternal = globalForPrisma.prisma || (globalForPrisma.prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  }));
  (_prismaInternal as any)._isReal = true;
} catch {
  _prismaInternal = createNoopStub();
}

if (process.env.NODE_ENV !== 'production' && globalForPrisma.prisma) {
  globalForPrisma.prisma = _prismaInternal;
}

/**
 * Raw Prisma client. When the database is unavailable this is a no-op stub
 * that returns empty results rather than crashing.
 */
export const prisma: PrismaClient = _prismaInternal;
export default prisma;

// ── Safe query helpers ────────────────────────────────────────────────────────

const SAFE_EMPTY: any[] = [];
const SAFE_ZERO = 0;
const _available = () => (_prismaInternal as any)._isReal === true;

async function safeQuery<T>(
  fn: (client: PrismaClient) => Promise<T>,
  fallback: T,
): Promise<T> {
  if (!_available()) return fallback;
  try {
    return await fn(_prismaInternal);
  } catch {
    return fallback;
  }
}

export function getAvailable() {
  // The raw `prisma` export is always defined (real client or stub).
  // We mark availability with a boolean flag set during construction.
  return (_prismaInternal as any)._isReal === true;
}

export const db = {
  get available() { return (_prismaInternal as any)._isReal === true; },

  // ── post ────────────────────────────────────────────────────────────────────
  post: {
    findMany:   (args?: any, opts?: { fallback?: any[] })  => safeQuery(c => c.post.findMany(args), opts?.fallback ?? SAFE_EMPTY),
    findUnique: (args?: any, opts?: { fallback?: any })    => safeQuery(c => c.post.findUnique(args), opts?.fallback ?? null),
    count:      (args?: any, opts?: { fallback?: number }) => safeQuery(c => c.post.count(args), opts?.fallback ?? SAFE_ZERO),
    create:     (args?: any, opts?: { fallback?: any })    => safeQuery(c => c.post.create(args), opts?.fallback ?? null),
    update:     (args?: any, opts?: { fallback?: any })    => safeQuery(c => c.post.update(args), opts?.fallback ?? null),
  },

  // ── game ────────────────────────────────────────────────────────────────────
  game: {
    findMany:   (args?: any, opts?: { fallback?: any[] })  => safeQuery(c => c.game.findMany(args), opts?.fallback ?? SAFE_EMPTY),
    findUnique: (args?: any, opts?: { fallback?: any })    => safeQuery(c => c.game.findUnique(args), opts?.fallback ?? null),
    count:      (args?: any, opts?: { fallback?: number }) => safeQuery(c => c.game.count(args), opts?.fallback ?? SAFE_ZERO),
    update:     (args?: any, opts?: { fallback?: any })    => safeQuery(c => c.game.update(args), opts?.fallback ?? null),
  },

  // ── gameScore ───────────────────────────────────────────────────────────────
  gameScore: {
    findMany: (args?: any, opts?: { fallback?: any[] }) => safeQuery(c => c.gameScore.findMany(args), opts?.fallback ?? SAFE_EMPTY),
    create:   (args?: any, opts?: { fallback?: any })   => safeQuery(c => c.gameScore.create(args), opts?.fallback ?? null),
  },

  // ── category ────────────────────────────────────────────────────────────────
  category: {
    findMany:   (args?: any, opts?: { fallback?: any[] })  => safeQuery(c => c.category.findMany(args), opts?.fallback ?? SAFE_EMPTY),
    findUnique: (args?: any, opts?: { fallback?: any })    => safeQuery(c => c.category.findUnique(args), opts?.fallback ?? null),
    count:      (args?: any, opts?: { fallback?: number }) => safeQuery(c => c.category.count(args), opts?.fallback ?? SAFE_ZERO),
  },

  // ── tool ────────────────────────────────────────────────────────────────────
  tool: {
    findMany:   (args?: any, opts?: { fallback?: any[] })  => safeQuery(c => c.tool.findMany(args), opts?.fallback ?? SAFE_EMPTY),
    findUnique: (args?: any, opts?: { fallback?: any })    => safeQuery(c => c.tool.findUnique(args), opts?.fallback ?? null),
    count:      (args?: any, opts?: { fallback?: number }) => safeQuery(c => c.tool.count(args), opts?.fallback ?? SAFE_ZERO),
  },

  // ── pageView ────────────────────────────────────────────────────────────────
  pageView: {
    count:   (args?: any, opts?: { fallback?: number }) => safeQuery(c => c.pageView.count(args), opts?.fallback ?? SAFE_ZERO),
    create:  (args?: any, opts?: { fallback?: any })   => safeQuery(c => c.pageView.create(args), opts?.fallback ?? null),
  },

  // ── newsArticle (NewsArticle model) ────────────────────────────────────────
  newsArticle: {
    findMany:   (args?: any, opts?: { fallback?: any[] })  => safeQuery(c => c.newsArticle.findMany(args), opts?.fallback ?? SAFE_EMPTY),
    findUnique: (args?: any, opts?: { fallback?: any })    => safeQuery(c => c.newsArticle.findUnique(args), opts?.fallback ?? null),
  },

  // ── comment ────────────────────────────────────────────────────────────────
  comment: {
    findMany:   (args?: any, opts?: { fallback?: any[] })  => safeQuery(c => c.comment.findMany(args), opts?.fallback ?? SAFE_EMPTY),
    findUnique: (args?: any, opts?: { fallback?: any })    => safeQuery(c => c.comment.findUnique(args), opts?.fallback ?? null),
    create:     (args?: any, opts?: { fallback?: any })    => safeQuery(c => c.comment.create(args), opts?.fallback ?? null),
    count:      (args?: any, opts?: { fallback?: number }) => safeQuery(c => c.comment.count(args), opts?.fallback ?? SAFE_ZERO),
  },

  // ── user / author ──────────────────────────────────────────────────────────
  user: {
    findUnique: (args?: any, opts?: { fallback?: any })    => safeQuery(c => c.user.findUnique(args), opts?.fallback ?? null),
    findMany:   (args?: any, opts?: { fallback?: any[] })  => safeQuery(c => c.user.findMany(args), opts?.fallback ?? SAFE_EMPTY),
  },

  // ── jobListing (JobListing model) ──────────────────────────────────────────
  jobListing: {
    findMany:   (args?: any, opts?: { fallback?: any[] })  => safeQuery(c => c.jobListing.findMany(args), opts?.fallback ?? SAFE_EMPTY),
    findUnique: (args?: any, opts?: { fallback?: any })    => safeQuery(c => c.jobListing.findUnique(args), opts?.fallback ?? null),
    count:      (args?: any, opts?: { fallback?: number }) => safeQuery(c => c.jobListing.count(args), opts?.fallback ?? SAFE_ZERO),
  },

  // ── forum (Forum model) ────────────────────────────────────────────────────
  forum: {
    findMany:   (args?: any, opts?: { fallback?: any[] })  => safeQuery(c => c.forum.findMany(args), opts?.fallback ?? SAFE_EMPTY),
    findUnique: (args?: any, opts?: { fallback?: any })    => safeQuery(c => c.forum.findUnique(args), opts?.fallback ?? null),
  },

  // ── forumPost (ForumPost model) ─────────────────────────────────────────────
  forumPost: {
    findMany:   (args?: any, opts?: { fallback?: any[] })  => safeQuery(c => c.forumPost.findMany(args), opts?.fallback ?? SAFE_EMPTY),
    findUnique: (args?: any, opts?: { fallback?: any })    => safeQuery(c => c.forumPost.findUnique(args), opts?.fallback ?? null),
    create:     (args?: any, opts?: { fallback?: any })    => safeQuery(c => c.forumPost.create(args), opts?.fallback ?? null),
  },

  // ── qnaQuestion (QnAQuestion model — Prisma names it qnAQuestion) ──────────
  qnaQuestion: {
    findMany: (args?: any, opts?: { fallback?: any[] }) => safeQuery(c => c.qnAQuestion.findMany(args), opts?.fallback ?? SAFE_EMPTY),
  },

  // ── tag (Tag model) ────────────────────────────────────────────────────────
  tag: {
    findUnique: (args?: any, opts?: { fallback?: any }) => safeQuery(c => c.tag.findUnique(args), opts?.fallback ?? null),
  },

  // ── bookmark (Bookmark model) ──────────────────────────────────────────────
  bookmark: {
    findMany: (args?: any, opts?: { fallback?: any[] }) => safeQuery(c => c.bookmark.findMany(args), opts?.fallback ?? SAFE_EMPTY),
  },

  // ── newsletterSubscriber (NewsletterSubscriber model) ──────────────────────
  newsletterSubscriber: {
    findMany:   (args?: any, opts?: { fallback?: any[] })  => safeQuery(c => c.newsletterSubscriber.findMany(args), opts?.fallback ?? SAFE_EMPTY),
    findUnique: (args?: any, opts?: { fallback?: any })    => safeQuery(c => c.newsletterSubscriber.findUnique(args), opts?.fallback ?? null),
    create:     (args?: any, opts?: { fallback?: any })    => safeQuery(c => c.newsletterSubscriber.create(args), opts?.fallback ?? null),
    count:      (args?: any, opts?: { fallback?: number }) => safeQuery(c => c.newsletterSubscriber.count(args), opts?.fallback ?? SAFE_ZERO),
  },

  // ── siteConfig (SiteConfig model) ──────────────────────────────────────────
  siteConfig: {
    findMany:   (args?: any, opts?: { fallback?: any[] })  => safeQuery(c => c.siteConfig.findMany(args), opts?.fallback ?? SAFE_EMPTY),
    findUnique: (args?: any, opts?: { fallback?: any })    => safeQuery(c => c.siteConfig.findUnique(args), opts?.fallback ?? null),
    upsert:     (args?: any, opts?: { fallback?: any })    => safeQuery(c => c.siteConfig.upsert(args), opts?.fallback ?? null),
  },
};
