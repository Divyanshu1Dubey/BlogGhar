import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://blogghar.com';

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
    // Tool pages
    { url: `${SITE_URL}/tools/bmi-calculator`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/tools/emi-calculator`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/tools/age-calculator`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/tools/percentage-calculator`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/tools/password-generator`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/tools/word-counter`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/tools/qr-code-generator`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/tools/text-case-converter`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    // Horoscope pages
    { url: `${SITE_URL}/horoscope/aries`, lastModified: now, changeFrequency: 'daily', priority: 0.6 },
    { url: `${SITE_URL}/horoscope/taurus`, lastModified: now, changeFrequency: 'daily', priority: 0.6 },
    { url: `${SITE_URL}/horoscope/gemini`, lastModified: now, changeFrequency: 'daily', priority: 0.6 },
    { url: `${SITE_URL}/horoscope/cancer`, lastModified: now, changeFrequency: 'daily', priority: 0.6 },
    { url: `${SITE_URL}/horoscope/leo`, lastModified: now, changeFrequency: 'daily', priority: 0.6 },
    { url: `${SITE_URL}/horoscope/virgo`, lastModified: now, changeFrequency: 'daily', priority: 0.6 },
    { url: `${SITE_URL}/horoscope/libra`, lastModified: now, changeFrequency: 'daily', priority: 0.6 },
    { url: `${SITE_URL}/horoscope/scorpio`, lastModified: now, changeFrequency: 'daily', priority: 0.6 },
    { url: `${SITE_URL}/horoscope/sagittarius`, lastModified: now, changeFrequency: 'daily', priority: 0.6 },
    { url: `${SITE_URL}/horoscope/capricorn`, lastModified: now, changeFrequency: 'daily', priority: 0.6 },
    { url: `${SITE_URL}/horoscope/aquarius`, lastModified: now, changeFrequency: 'daily', priority: 0.6 },
    { url: `${SITE_URL}/horoscope/pisces`, lastModified: now, changeFrequency: 'daily', priority: 0.6 },
  ];

  // Dynamic pages - blog posts
  let blogPosts: MetadataRoute.Sitemap = [];
  try {
    const posts = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
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
    const articles = await prisma.newsArticle.findMany({
      select: { id: true, publishedAt: true, createdAt: true },
      orderBy: { publishedAt: 'desc' },
      take: 500,
    });
    newsArticles = articles.map((a: any) => ({
      url: `${SITE_URL}/news/${a.id}`,
      lastModified: a.publishedAt || a.createdAt || now,
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

  return [...staticPages, ...blogPosts, ...newsArticles, ...games, ...jobs];
}
