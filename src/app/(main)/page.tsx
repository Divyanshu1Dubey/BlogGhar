import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { ArrowRight, Gamepad2, Calculator, Newspaper, Sparkles, Shield, Zap, Users, TrendingUp, Star } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import prisma from '@/lib/prisma';
import { AdSlot } from '@/components/ads/ad-slot';

export const dynamic = 'force-dynamic';
export async function generateMetadata() {
  const categories = await getCategories();
  const categoryKeywords = categories.map((c: any) => c.name).join(', ');

  return {
    title: 'Blog-Ghar - Home of Blogs | Games, News, Tools & More',
    description: 'Blog-Ghar is your one-stop destination for blogs, games, news, online tools, horoscopes, and more. Discover daily updated content across technology, lifestyle, entertainment, and more.',
    keywords: ['blog', 'games', 'news', 'online tools', 'calculator', 'horoscope', categoryKeywords],
    alternates: { canonical: 'https://blogghar.com' },
  };
}

async function getFeaturedPosts() {
  try {
    const posts = await prisma.post.findMany({
      where: { postType: 'BLOG', status: 'PUBLISHED' },
      take: 3,
      orderBy: { publishedAt: 'desc' },
      include: {
        author: { select: { name: true, image: true } },
        category: { select: { name: true, slug: true, icon: true } },
      },
    });
    return posts;
  } catch {
    return [];
  }
}

async function getTrendingPosts() {
  try {
    const posts = await prisma.post.findMany({
      where: { postType: 'BLOG', status: 'PUBLISHED' },
      take: 6,
      orderBy: { views: 'desc' },
      include: {
        author: { select: { name: true } },
        category: { select: { name: true, slug: true } },
      },
    });
    return posts;
  } catch {
    return [];
  }
}

async function getCategories() {
  try {
    return await prisma.category.findMany({
      take: 8,
      include: { _count: { select: { posts: true } } },
    });
  } catch {
    return [];
  }
}

async function getGames() {
  try {
    return await prisma.game.findMany({
      where: { isActive: true },
      take: 6,
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    return [];
  }
}

async function getNews() {
  try {
    return await prisma.post.findMany({
      where: { postType: 'NEWS', status: 'PUBLISHED' },
      take: 5,
      orderBy: { publishedAt: 'desc' },
      include: { category: { select: { name: true, slug: true } } },
    });
  } catch {
    return [];
  }
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="text-center p-6">
      <div className="w-14 h-14 mx-auto bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center text-primary-600 mb-4">
        {icon}
      </div>
      <h3 className="font-display font-bold text-lg mb-1">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
    </div>
  );
}

function StepCard({ num, title, desc }: { num: number; title: string; desc: string }) {
  return (
    <div className="relative">
      <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-3">
        {num}
      </div>
      <h3 className="font-display font-bold mb-1">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
    </div>
  );
}

export default async function HomePage() {
  const [featuredPosts, trendingPosts, categories, games, news] = await Promise.all([
    getFeaturedPosts(),
    getTrendingPosts(),
    getCategories(),
    getGames(),
    getNews(),
  ]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-300 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-sm mb-6">
              <Star className="w-4 h-4" />
              Your One-Stop Destination
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-extrabold leading-tight mb-6 text-balance">
              Welcome to <span className="text-primary-200">Blog-Ghar</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-100 mb-8 max-w-2xl">
              Discover blogs, play games, use free tools, read news, check horoscopes & much more.
              Everything you need in one place — for free!
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/blog" className="inline-flex items-center gap-2 bg-white text-primary-700 px-6 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-colors">
                Explore Blogs <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/games" className="inline-flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors backdrop-blur-sm">
                <Gamepad2 className="w-5 h-5" /> Play Games
              </Link>
              <Link href="/tools" className="inline-flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors backdrop-blur-sm">
                <Calculator className="w-5 h-5" /> Free Tools
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Blog-Ghar — Trust Signals */}
      <section className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-xl border border-gray-200 dark:border-dark-border p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-display font-bold mb-2">Why Blog-Ghar?</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Trusted by readers from 50+ countries worldwide</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FeatureCard icon={<Users className="w-7 h-7" />} title="10K+ Monthly Readers" desc="Growing community of engaged readers" />
            <FeatureCard icon={<Zap className="w-7 h-7" />} title="30+ Free Tools" desc="Calculators, converters & text tools" />
            <FeatureCard icon={<Shield className="w-7 h-7" />} title="100% Free" desc="No registration, no hidden costs" />
            <FeatureCard icon={<TrendingUp className="w-7 h-7" />} title="Daily Updates" desc="Fresh content every single day" />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-display font-bold mb-2">How It Works</h2>
          <p className="text-gray-500 dark:text-gray-400">Getting started is simple</p>
        </div>
        <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <StepCard num={1} title="Explore" desc="Browse blogs, tools, games, news, horoscopes, and more" />
          <StepCard num={2} title="Discover" desc="Find exactly what you need — all in one place, for free" />
          <StepCard num={3} title="Engage" desc="Comment, share, and connect with our community" />
          <StepCard num={4} title="Return" desc="Come back daily for fresh content and new tools" />
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-xl border border-gray-200 dark:border-dark-border p-6">
          <h2 className="text-xl font-display font-bold mb-4">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/blog?category=${cat.slug}`}
                className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors group"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                <span className="text-xs font-medium text-center">{cat.name}</span>
                <span className="text-xs text-gray-500">{cat._count.posts} posts</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold">Featured Posts</h2>
          <Link href="/blog" className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {featuredPosts.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {featuredPosts.map((post) => (
              <article key={post.id} className="card overflow-hidden group">
                <div className="relative h-48 bg-gray-200 dark:bg-dark-border">
                  {post.featuredImage && (
                    <Image src={post.featuredImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-primary-600 text-white text-xs font-medium rounded-full">
                      {post.category.icon} {post.category.name}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="font-display font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {post.excerpt || ''}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{post.author.name}</span>
                    <span>{post.publishedAt && formatDate(new Date(post.publishedAt))}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center">
            <p className="text-gray-500 mb-4">No featured posts yet. Start publishing!</p>
            <Link href="/admin" className="btn-primary">Go to Admin</Link>
          </div>
        )}
      </section>

      {/* Quick Access Row */}
      <section className="bg-gray-50 dark:bg-dark-bg py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-display font-bold mb-6 text-center">Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickCard href="/games" icon={<Gamepad2 className="w-8 h-8" />} title="Play Games" subtitle="Puzzles, Quizzes & More" color="bg-blue-500" />
            <QuickCard href="/tools" icon={<Calculator className="w-8 h-8" />} title="Free Tools" subtitle="Calculators & Converters" color="bg-green-500" />
            <QuickCard href="/news" icon={<Newspaper className="w-8 h-8" />} title="Latest News" subtitle="Stay informed" color="bg-orange-500" />
            <QuickCard href="/horoscope" icon={<Sparkles className="w-8 h-8" />} title="Horoscope" subtitle="Daily predictions" color="bg-purple-500" />
          </div>
        </div>
      </section>

      {/* Homepage Banner Ad */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <AdSlot slot="1234567890" format="auto" responsive={true} />
      </div>

      {/* Trending Posts + Sidebar */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Trending */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-display font-bold mb-6">Trending Now</h2>
            <div className="space-y-4">
              {trendingPosts.map((post, idx) => (
                <article key={post.id} className="card p-4 flex gap-4 group">
                  <span className="text-3xl font-display font-bold text-gray-200 dark:text-dark-border">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <Link href={`/blog/${post.slug}`}>
                      <h3 className="font-semibold group-hover:text-primary-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-dark-bg rounded-full">{post.category.name}</span>
                      <span>{post.author.name}</span>
                      <span>{post.publishedAt && formatDate(new Date(post.publishedAt))}</span>
                      <span>{post.views} views</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Popular Games */}
            <div className="card p-5">
              <h3 className="font-display font-bold text-lg mb-4">Popular Games</h3>
              <div className="space-y-3">
                {games.map((game) => (
                  <Link key={game.id} href={`/games/${game.slug}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors group">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-xl">
                      🎯
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm group-hover:text-primary-600 transition-colors truncate">
                        {game.name}
                      </p>
                      <p className="text-xs text-gray-500">Play now</p>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/games" className="block text-center text-primary-600 text-sm font-medium mt-4 hover:underline">
                View All Games →
              </Link>
            </div>

            {/* Latest News Ticker */}
            <div className="card p-5">
              <h3 className="font-display font-bold text-lg mb-4">Latest News</h3>
              <div className="space-y-3">
                {news.map((item) => (
                  <Link key={item.id} href={`/news/${item.slug}`} className="block group">
                    <p className="text-sm font-medium line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-dark-bg rounded text-xs">{item.category?.name}</span>
                      <span>{formatDate(new Date(item.publishedAt))}</span>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/news" className="block text-center text-primary-600 text-sm font-medium mt-4 hover:underline">
                View All News →
              </Link>
            </div>

            {/* Newsletter Card */}
            <div className="card p-5 bg-gradient-to-br from-primary-500 to-primary-700 text-white">
              <h3 className="font-display font-bold text-lg mb-2">Newsletter</h3>
              <p className="text-primary-100 text-sm mb-4">Get weekly updates with the best content.</p>
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-3 py-2 rounded-lg bg-white/20 text-white placeholder-primary-200 text-sm focus:outline-none focus:ring-2 focus:ring-white mb-2"
              />
              <button className="w-full bg-white text-primary-700 py-2 rounded-lg text-sm font-semibold hover:bg-primary-50 transition-colors">
                Subscribe Free
              </button>
            </div>
          </aside>
        </div>
      </section>

      {/* Homepage Structured Data */}
      <Script
        id="homepage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Blog-Ghar',
            description: 'Your one-stop destination for blogs, games, news, tools & more',
            url: 'https://blogghar.com',
            potentialAction: {
              '@type': 'SearchAction',
              target: { '@type': 'EntryPoint', urlTemplate: 'https://blogghar.com/search?q={search_term_string}' },
              'query-input': 'required name=search_term_string',
            },
            publisher: { '@type': 'Organization', name: 'Blog-Ghar', url: 'https://blogghar.com', logo: { '@type': 'ImageObject', url: 'https://blogghar.com/logo.svg' } },
            inLanguage: 'en-IN',
          }),
        }}
      />
    </div>
  );
}

function QuickCard({ href, icon, title, subtitle, color }: { href: string; icon: React.ReactNode; title: string; subtitle: string; color: string }) {
  return (
    <Link href={href} className="card p-5 group hover:border-primary-300 dark:hover:border-primary-700">
      <div className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="font-display font-bold">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
    </Link>
  );
}
