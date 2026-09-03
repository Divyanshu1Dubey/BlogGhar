'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Gamepad2,
  Calculator,
  Newspaper,
  TrendingUp,
  Users,
  Zap,
  Shield,
  Sparkles,
  NewspaperIcon,
  ChevronRight,
  Flame,
  Clock,
} from 'lucide-react';
import { formatDate, formatNumber } from '@/lib/utils';
import { AdSlot } from '@/components/ads/ad-slot';
import NewsletterForm from '@/components/newsletter-form';
import { NewsTicker } from '@/components/layout/news-ticker';

export const dynamic = 'force-dynamic';

const HOME_API = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '') + '/api/home';

type HomeData = {
  featuredPosts: any[];
  trendingPosts: any[];
  games: any[];
  news: any[];
  popularTools: any[];
  stats: { blogCount: number; gameCount: number; toolCount: number; dailyVisitors: number };
};

async function getHomeData(): Promise<HomeData> {
  try {
    const res = await fetch(HOME_API, { next: { revalidate: 120 } });
    if (!res.ok) throw new Error('Home API failed');
    return res.json();
  } catch {
    return {
      featuredPosts: [],
      trendingPosts: [],
      games: [],
      news: [],
      popularTools: [],
      stats: { blogCount: 0, gameCount: 0, toolCount: 0, dailyVisitors: 0 },
    };
  }
}

export default function HomePage() {
  const [featuredPosts, setFeaturedPosts] = useState<any[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [breakingNews, setBreakingNews] = useState<any>(null);
  const [popularTools, setPopularTools] = useState<any[]>([]);
  const [siteStats, setSiteStats] = useState({
    posts: 0,
    games: 0,
    tools: 0,
    dailyVisitors: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getHomeData();
        setFeaturedPosts(data.featuredPosts);
        setTrendingPosts(data.trendingPosts);
        setCategories(data.categories);
        setGames(data.games);
        setNews(data.news);
        setBreakingNews(data.news[0] || null);
        setPopularTools(data.popularTools);
        setSiteStats({
          posts: data.stats.blogCount,
          games: data.stats.gameCount,
          tools: data.stats.toolCount,
          dailyVisitors: data.stats.dailyVisitors,
        });
      } catch {}
      setLoading(false);
    })();
  }, []);

  const topNews = news.slice(0, 10);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="space-y-6 animate-pulse">
          <div className="h-96 bg-gray-200 dark:bg-dark-border rounded-3xl" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-200 dark:bg-dark-border rounded-2xl" />)}
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <div key={i} className="h-80 bg-gray-200 dark:bg-dark-border rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ========== BREAKING NEWS BANNER ========== */}
      {breakingNews && (<div className="bg-red-600 text-white text-center py-2 px-4 text-sm font-medium"><Flame className="w-4 h-4 inline mr-1"/> <a href={`/blog/${breakingNews.slug}`} className="underline hover:no-underline">{breakingNews.title}</a> </div>)}

      {/* ========== HERO SECTION ========== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 text-white">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
          <div className="absolute top-40 -right-40 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm mb-8 border border-white/10">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              Your Daily Hub for Free Content
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 tracking-tight">
              <span className="block">Blogs, Games, Tools</span>
              <span className="block bg-gradient-to-r from-blue-200 via-white to-cyan-200 bg-clip-text text-transparent">
                &amp; More — All Free
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Discover daily updated blogs, play fun games, use powerful online tools, and stay informed — all in one place, forever free.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              <Link href="/blog" className="inline-flex items-center gap-2 bg-white text-blue-700 px-7 py-3.5 rounded-xl font-bold hover:bg-blue-50 hover:shadow-lg hover:shadow-white/20 transition-all">
                Explore Blogs <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/games" className="inline-flex items-center gap-2 bg-white/10 text-white px-7 py-3.5 rounded-xl font-bold hover:bg-white/20 backdrop-blur-sm border border-white/10 transition-all">
                <Gamepad2 className="w-5 h-5" /> Play Games
              </Link>
              <Link href="/tools" className="inline-flex items-center gap-2 bg-white/10 text-white px-7 py-3.5 rounded-xl font-bold hover:bg-white/20 backdrop-blur-sm border border-white/10 transition-all">
                <Calculator className="w-5 h-5" /> Free Tools
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-blue-200">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" /> {siteStats.dailyVisitors > 0 ? `${formatNumber(siteStats.dailyVisitors)} Daily Readers` : 'Reader analytics pending'}
              </span>
              <span className="hidden sm:inline text-blue-400">|</span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4" /> {siteStats.tools}+ Free Tools
              </span>
              <span className="hidden sm:inline text-blue-400">|</span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4" /> No Signup Needed
              </span>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 40L60 35C120 30 240 20 360 18C480 16 600 22 720 28C840 34 960 40 1080 38C1200 36 1320 26 1380 21L1440 16V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0V40Z" fill="white" />
            <path d="M0 60L60 55C120 50 240 40 360 38C480 36 600 42 720 48C840 54 960 60 1080 58C1200 56 1320 46 1380 41L1440 36V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0V60Z" fill="white" opacity="0.5" />
          </svg>
        </div>
      </section>

      {/* ========== STATS BAR ========== */}
      <section className="max-w-7xl mx-auto px-4 -mt-2 relative z-10">
        <div className="card shadow-xl border-gray-200 dark:border-dark-border p-2">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200 dark:divide-dark-border">
            <StatCard icon={<NewspaperIcon className="w-7 h-7" />} value={formatNumber(siteStats.posts)} label="Total Posts" />
            <StatCard icon={<Gamepad2 className="w-7 h-7" />} value={formatNumber(siteStats.games)} label="Games Available" />
            <StatCard icon={<Calculator className="w-7 h-7" />} value={formatNumber(siteStats.tools)} label="Free Tools" />
            <StatCard icon={<TrendingUp className="w-7 h-7" />} value={formatNumber(siteStats.dailyVisitors)} label="Tracked Visitors Today" />
          </div>
        </div>
      </section>

      {/* ========== FEATURED POSTS ========== */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-display font-extrabold text-gray-900 dark:text-white">
              Featured Posts
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Hand-picked content you will love</p>
          </div>
          <Link href="/blog" className="group flex items-center gap-1 text-primary-600 hover:text-primary-700 font-semibold text-sm">
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {featuredPosts.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {featuredPosts.map((post) => (
              <FeaturedCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <p className="text-gray-500 mb-4">No featured posts yet. Start publishing!</p>
            <Link href="/admin" className="btn-primary">Go to Admin</Link>
          </div>
        )}
      </section>

      {/* ========== INLINE AD 1 ========== */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <AdSlot slot="home-featured-ad" format="horizontal" className="w-full flex justify-center" style={{ minHeight: '90px' }} />
      </div>

      {/* ========== GAMES SHOWCASE ========== */}
      <section className="bg-gray-50 dark:bg-dark-bg py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-display font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
                <Gamepad2 className="w-8 h-8 text-primary-600" />
                Popular Games
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Top games played by our community</p>
            </div>
            <Link href="/games" className="group flex items-center gap-1 text-primary-600 hover:text-primary-700 font-semibold text-sm">
              View All Games <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {games.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center text-gray-500">No games available yet.</div>
          )}
        </div>
      </section>

      {/* ========== INLINE AD 2 ========== */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <AdSlot slot="home-games-ad" format="rectangle" className="w-full flex justify-center" style={{ minHeight: '250px' }} />
      </div>

      {/* ========== LATEST NEWS TICKER ========== */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 mb-4">
          <h2 className="text-3xl font-display font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
            <Newspaper className="w-8 h-8 text-primary-600" />
            Latest News
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Stay informed with the latest headlines</p>
        </div>

        {topNews.length > 0 ? (
          <>
            <NewsTicker items={topNews.map((n) => ({ title: n.title, slug: n.slug }))} />
            {/* News grid below ticker */}
            <div className="max-w-7xl mx-auto px-4 mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {topNews.slice(0, 5).map((item) => (
                  <Link key={item.id} href={`/news/${item.slug}`} className="card p-4 group hover:border-primary-300 dark:hover:border-primary-700">
                    <span className="inline-block px-2 py-0.5 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-[11px] font-medium rounded mb-2">
                      {item.category?.name || 'News'}
                    </span>
                    <h4 className="text-sm font-semibold line-clamp-2 group-hover:text-primary-600 transition-colors">{item.title}</h4>
                    <span className="text-[11px] text-gray-500 mt-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(new Date(item.publishedAt ?? ''))}
                    </span>
                  </Link>
                ))}
              </div>
              <div className="text-center mt-4">
                <Link href="/news" className="text-primary-600 hover:text-primary-700 text-sm font-semibold inline-flex items-center gap-1">
                  View All News <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </>
        ) : (
          <div className="max-w-7xl mx-auto px-4">
            <div className="bg-gray-100 dark:bg-dark-card rounded-xl p-8 text-center text-gray-500">
              No news available yet.
            </div>
          </div>
        )}
      </section>

      {/* ========== INLINE AD 3 ========== */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <AdSlot slot="home-news-ad" format="auto" className="w-full flex justify-center" style={{ minHeight: '90px' }} />
      </div>

      {/* ========== TOOLS SHOWCASE ========== */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-display font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
              <Calculator className="w-8 h-8 text-primary-600" />
              Popular Tools
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Free online calculators and utilities</p>
          </div>
          <Link href="/tools" className="group flex items-center gap-1 text-primary-600 hover:text-primary-700 font-semibold text-sm">
            All Tools <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {popularTools.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center text-gray-500">No tools available yet.</div>
        )}
      </section>

      {/* ========== TRENDING / HOT SECTION ========== */}
      <section className="bg-gray-50 dark:bg-dark-bg py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-display font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
                <Flame className="w-8 h-8 text-orange-500" />
                Trending Now
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Most read posts this week</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Trending list */}
            <div className="lg:col-span-2 space-y-3">
              {trendingPosts.length > 0 ? (
                trendingPosts.map((post, idx) => (
                  <TrendingRow key={post.id} post={post} index={idx} />
                ))
              ) : (
                <div className="card p-8 text-center text-gray-500">No trending posts yet.</div>
              )}
            </div>

            {/* Sidebar ad */}
            <aside className="space-y-6">
              <div className="card p-0 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-dark-border">
                  <h3 className="font-display font-bold text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sponsored</h3>
                </div>
                <AdSlot slot="home-sidebar-ad" format="rectangle" style={{ minHeight: '250px', width: '100%' }} />
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ========== CATEGORY CLOUD ========== */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-display font-extrabold text-gray-900 dark:text-white">
            Explore Categories
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Browse content by topic</p>
        </div>

        {categories.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <CategoryBadge key={category.id} category={category} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No categories found.</p>
        )}
      </section>

      {/* ========== NEWSLETTER SECTION ========== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700" />
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-white mb-4">
              Never Miss an Update
            </h2>
            <p className="text-blue-100 mb-8">
              Get the best blogs, games, and tools delivered to your inbox every week. {siteStats.dailyVisitors > 0 ? `Join ${formatNumber(siteStats.dailyVisitors)} readers.` : 'Subscribe for updates.'}
            </p>

            <NewsletterForm />

            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-blue-100">
              <span className="flex items-center gap-1.5"><Zap className="w-4 h-4" /> Weekly digest</span>
              <span className="flex items-center gap-1.5"><Shield className="w-4 h-4" /> No spam ever</span>
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> Unsubscribe anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========== BOTTOM BANNER AD ========== */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="text-center text-xs text-gray-400 mb-2 uppercase tracking-wider">Advertisement</div>
        <AdSlot slot="home-bottom-banner" format="horizontal" className="w-full flex justify-center" style={{ minHeight: '90px' }} />
      </div>
    </div>
  );
}