import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bloghar.com';

const FORUM_SLUGS = ['general', 'tech', 'lifestyle', 'gaming', 'help'];

// All 30 tools that have dynamic routes at /tools/[slug]
const TOOL_SLUGS = [
  'bmi-calculator', 'age-calculator', 'percentage-calculator', 'emi-calculator',
  'gst-calculator', 'compound-interest', 'date-difference', 'gpa-calculator',
  'tip-calculator', 'discount-calculator', 'timezone-converter', 'currency-converter',
  'length-converter', 'weight-converter', 'temperature-converter', 'speed-converter',
  'area-converter', 'number-to-words', 'roman-numeral', 'word-counter',
  'text-case-converter', 'json-formatter', 'password-generator', 'uuid-generator',
  'markdown-editor', 'online-notepad', 'qr-code-generator', 'color-palette',
  'base64-encoder', 'hash-generator',
];

const SIGNS = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/news`, lastModified: now, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${SITE_URL}/games`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/tools`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/horoscope`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/forum`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: `${SITE_URL}/qa`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: `${SITE_URL}/jobs`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: `${SITE_URL}/wallpapers`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/advertise`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    // All 30 tool pages (dynamic [slug] route)
    ...TOOL_SLUGS.map((slug) => ({
      url: `${SITE_URL}/tools/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    // Forum category pages
    ...FORUM_SLUGS.map((slug) => ({
      url: `${SITE_URL}/forum/category/${slug}`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.7,
    })),
    // All 12 horoscope sign pages
    ...SIGNS.map((sign) => ({
      url: `${SITE_URL}/horoscope/${sign}`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.6,
    })),
  ];

  // Dynamic - blog posts
  let blogPosts: MetadataRoute.Sitemap = [];
  try {
    const posts = await prisma.post.findMany({
      where: { postType: 'BLOG', status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true, publishedAt: true },
      orderBy: { publishedAt: 'desc' },
      take: 1000,
    });
    blogPosts = posts.map((p: any) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.updatedAt || p.publishedAt || now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch {}

  // Dynamic - news articles
  let newsArticles: MetadataRoute.Sitemap = [];
  try {
    const articles = await prisma.post.findMany({
      where: { postType: 'NEWS', status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true, publishedAt: true },
      orderBy: { publishedAt: 'desc' },
      take: 500,
    });
    newsArticles = articles.map((a: any) => ({
      url: `${SITE_URL}/news/${a.slug}`,
      lastModified: a.updatedAt || a.publishedAt || now,
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }));
  } catch {}

  // Dynamic - games
  let games: MetadataRoute.Sitemap = [];
  try {
    const gameList = await prisma.game.findMany({
      where: { isActive: true },
      select: { slug: true, createdAt: true },
    });
    games = gameList.map((g: any) => ({
      url: `${SITE_URL}/games/${g.slug}`,
      lastModified: g.createdAt || now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } catch {}

  // Dynamic - forum posts (top-level only)
  let forumPosts: MetadataRoute.Sitemap = [];
  try {
    const posts = await prisma.forumPost.findMany({
      where: { parentId: null },
      select: { id: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 500,
    });
    forumPosts = posts.map((p: any) => ({
      url: `${SITE_URL}/forum/post/${p.id}`,
      lastModified: p.createdAt || now,
      changeFrequency: 'daily' as const,
      priority: 0.5,
    }));
  } catch {}

  // Dynamic - Q&A pages
  let qaPages: MetadataRoute.Sitemap = [];
  try {
    const questions = await prisma.qnAQuestion.findMany({
      select: { id: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 500,
    });
    qaPages = questions.map((q: any) => ({
      url: `${SITE_URL}/qa/${q.id}`,
      lastModified: q.createdAt || now,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }));
  } catch {}

  // Dynamic - job listings
  let jobs: MetadataRoute.Sitemap = [];
  try {
    const jobList = await prisma.jobListing.findMany({
      where: { isActive: true },
      select: { id: true, postedAt: true },
      orderBy: { postedAt: 'desc' },
      take: 500,
    });
    jobs = jobList.map((j: any) => ({
      url: `${SITE_URL}/jobs/${j.id}`,
      lastModified: j.postedAt || now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } catch {}

  return [...staticPages, ...blogPosts, ...newsArticles, ...games, ...forumPosts, ...qaPages, ...jobs];
}