'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ArrowRight, Gamepad2, Calculator,
  Users, Zap, Shield, Flame, Clock, Eye,
} from 'lucide-react';
import TestimonialsSection from '@/components/home/testimonials-section';
import { formatDate, formatNumber } from '@/lib/utils';
import { AdSlot } from '@/components/ads/ad-slot';
import NewsletterForm from '@/components/newsletter-form';

const HOME_API = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '') + '/api/home';

type HomeData = {
  featuredPosts: any[];
  trendingPosts: any[];
  categories: any[];
  games: any[];
  news: any[];
  popularTools: any[];
  stats: { blogCount: number; gameCount: number; toolCount: number; dailyVisitors: number };
};

async function getHomeData(): Promise<HomeData> {
  try {
    const res = await fetch(HOME_API, { next: { revalidate: 120 } });
    if (!res.ok) throw new Error(`Home API failed: ${res.status}`);
    const data = await res.json();
    if (!data || typeof data !== 'object') throw new Error('Invalid home API response');
    return {
      featuredPosts: Array.isArray(data.featuredPosts) ? data.featuredPosts : [],
      trendingPosts: Array.isArray(data.trendingPosts) ? data.trendingPosts : [],
      categories: Array.isArray(data.categories) ? data.categories : [],
      games: Array.isArray(data.games) ? data.games : [],
      news: Array.isArray(data.news) ? data.news : [],
      popularTools: Array.isArray(data.popularTools) ? data.popularTools : [],
      stats: data.stats && typeof data.stats === 'object' ? {
        blogCount: data.stats.blogCount || 0,
        gameCount: data.stats.gameCount || 0,
        toolCount: data.stats.toolCount || 0,
        dailyVisitors: data.stats.dailyVisitors || 0,
      } : { blogCount: 0, gameCount: 0, toolCount: 0, dailyVisitors: 0 },
    };
  } catch {
    return {
      featuredPosts: [], trendingPosts: [], categories: [],
      games: [], news: [], popularTools: [],
      stats: { blogCount: 0, gameCount: 0, toolCount: 0, dailyVisitors: 0 },
    };
  }
}

function FeaturedCard({ post }: { post: any }) {
  return (
    <article className="card overflow-hidden group cursor-pointer hover:shadow-lg transition-all">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative h-52 bg-gray-100 dark:bg-dark-border overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 flex items-center justify-center">
            <span className="text-4xl">{post.category?.icon || '📝'}</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full">
              {post.category?.icon || ''} {post.category?.name || 'Blog'}
            </span>
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-display font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {post.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
            {post.excerpt || ''}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{post.author?.name || 'Anonymous'}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.publishedAt ? formatDate(new Date(post.publishedAt)) : formatDate(new Date())}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

function GameCard({ game }: { game: any }) {
  return (
    <Link href={`/games/${game.slug}`} className="card p-5 flex flex-col items-center text-center gap-3 group hover:border-primary-300 dark:hover:border-primary-700 transition-all">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/40 dark:to-primary-800/30 flex items-center justify-center text-4xl group-hover:scale-105 transition-transform">
        {game.icon || game.emoji || '🎮'}
      </div>
      <h4 className="font-display font-bold text-base line-clamp-1">{game.name}</h4>
      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
        game.difficulty === 'easy' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
        game.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
        game.difficulty === 'hard' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
        'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
      }`}>
        {game.difficulty ? game.difficulty.toUpperCase() : 'MEDIUM'}
      </span>
      <span className="text-xs text-primary-600 font-semibold">Play Now →</span>
    </Link>
  );
}

function ToolCard({ tool }: { tool: any }) {
  return (
    <Link href={tool.route || '/tools'} className="card p-5 flex items-start gap-4 group hover:border-primary-300 dark:hover:border-primary-700 transition-all">
      <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
        {tool.icon || '🔧'}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-display font-bold text-sm group-hover:text-primary-600 transition-colors">{tool.name}</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{tool.description}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-gray-400 shrink-0 mt-1 group-hover:text-primary-600 transition-colors" />
    </Link>
  );
}

function TrendingRow({ post, index }: { post: any; index: number }) {
  return (
    <Link href={`/blog/${post.slug}`} className="card p-4 flex gap-4 group hover:border-primary-300 dark:hover:border-primary-700 transition-all">
      <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-display font-extrabold text-lg bg-gray-50 dark:bg-dark-bg text-gray-400 dark:text-gray-600">
        {String(index + 1).padStart(2, '0')}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary-600 transition-colors">
          {post.title}
        </h3>
        <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-gray-500 dark:text-gray-400">
          {post.category?.name && <span>{post.category.icon || ''} {post.category.name}</span>}
          {post.category?.name && <span className="text-gray-300 dark:text-gray-600">•</span>}
          <span>{post.author?.name || ''}</span>
          <span className="text-gray-300 dark:text-gray-600">•</span>
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {formatNumber(post.views || 0)}
          </span>
        </div>
      </div>
    </Link>
  );
}

function CategoryBadge({ category }: { category: any }) {
  const count = category._count?.posts ?? category.postCount ?? 0;
  return (
    <Link
      href={`/blog?category=${category.slug}`}
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gray-100 dark:bg-dark-card hover:bg-primary-50 dark:hover:bg-primary-900/30 text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-300 transition-all hover:shadow-sm text-sm font-medium"
    >
      <span>{category.icon}</span>
      <span>{category.name}</span>
      <span className="text-gray-400 dark:text-gray-500 text-xs">({count})</span>
    </Link>
  );
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
    posts: 0, games: 0, tools: 0, dailyVisitors: 0,
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
          posts: (data.stats as any)?.blogCount || 0,
          games: (data.stats as any)?.gameCount || 0,
          tools: (data.stats as any)?.toolCount || 0,
          dailyVisitors: (data.stats as any)?.dailyVisitors || 0,
        });
      } catch { /* non-critical */ }
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="space-y-6 animate-pulse">
          <div className="h-80 bg-gray-200 dark:bg-dark-border rounded-3xl" />
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <div key={i} className="h-64 bg-gray-200 dark:bg-dark-border rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Breaking news alert */}
      {breakingNews && (
        <a href={`/blog/${breakingNews.slug}`} className="block bg-red-600 text-white text-center py-2.5 px-4 text-sm font-medium hover:bg-red-700 transition-colors">
          <Flame className="w-4 h-4 inline mr-1.5" />
          {breakingNews.title}
        </a>
      )}

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 text-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute top-40 -right-40 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 pt-16 pb-20 md:pt-24 md:pb-28 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 tracking-tight">
            <span className="block">Blogs, Games, Tools</span>
            <span className="block bg-gradient-to-r from-blue-200 via-white to-cyan-200 bg-clip-text text-transparent">
              &amp; More — All Free
            </span>
          </h1>

          <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover daily updated blogs, play fun games, use powerful online tools, and stay informed — all in one place, forever free.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <Link href="/blog" className="inline-flex items-center gap-2 bg-white text-blue-700 px-7 py-3.5 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg">
              Explore Blogs <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/games" className="inline-flex items-center gap-2 bg-white/10 text-white px-7 py-3.5 rounded-xl font-bold hover:bg-white/20 backdrop-blur-sm border border-white/10 transition-all">
              <Gamepad2 className="w-5 h-5" /> Play Games
            </Link>
            <Link href="/tools" className="inline-flex items-center gap-2 bg-white/10 text-white px-7 py-3.5 rounded-xl font-bold hover:bg-white/20 backdrop-blur-sm border border-white/10 transition-all">
              <Calculator className="w-5 h-5" /> Free Tools
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-blue-200">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4" /> {formatNumber(siteStats.dailyVisitors)}+ Daily Readers
            </span>
            <span className="hidden sm:inline text-blue-400/50">|</span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4" /> {siteStats.tools}+ Free Tools
            </span>
            <span className="hidden sm:inline text-blue-400/50">|</span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4" /> No Signup Needed
            </span>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full">
            <path d="M0 40L60 35C120 30 240 20 360 18C480 16 600 22 720 28C840 34 960 40 1080 38C1200 36 1320 26 1380 21L1440 16V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0V40Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-display font-extrabold text-gray-900 dark:text-white">Featured Posts</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Hand-picked content you'll love</p>
            </div>
            <Link href="/blog" className="group flex items-center gap-1 text-primary-600 hover:text-primary-700 font-semibold text-sm">
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredPosts.map((post) => (
              <FeaturedCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Published */}
      <section className="bg-gray-50 dark:bg-dark-bg py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-display font-extrabold text-gray-900 dark:text-white">Recently Published</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Fresh content from this week</p>
            </div>
            <Link href="/blog" className="group flex items-center gap-1 text-primary-600 hover:text-primary-700 font-semibold text-sm">
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredPosts.length > 0 ? featuredPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="card p-5 group hover:shadow-lg transition-all">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{post.category?.icon || '📝'}</span>
                  <div>
                    <h3 className="font-bold text-sm mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors">{post.title}</h3>
                    <p className="text-xs text-gray-500">{post.category?.name} • {formatDate(new Date(post.publishedAt || Date.now()))}</p>
                  </div>
                </div>
              </Link>
            )) : <p className="text-gray-500 col-span-full text-center py-8">No recent posts yet.</p>}
          </div>
        </div>
      </section>

      {/* Games Showcase */}
      {games.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-display font-extrabold text-gray-900 dark:text-white">Popular Games</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Top games played by our community</p>
            </div>
            <Link href="/games" className="group flex items-center gap-1 text-primary-600 hover:text-primary-700 font-semibold text-sm">
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {games.slice(0, 10).map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      )}

      {/* News Section */}
      {news.length > 0 && (
        <section className="bg-gray-50 dark:bg-dark-bg py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-display font-extrabold text-gray-900 dark:text-white">Latest News</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Stay informed with the latest headlines</p>
              </div>
              <Link href="/news" className="group flex items-center gap-1 text-primary-600 hover:text-primary-700 font-semibold text-sm">
                View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {news.slice(0, 6).map((item) => (
                <Link key={item.id} href={`/news/${item.slug}`} className="card p-5 group hover:shadow-lg transition-all">
                  <span className="inline-block px-2.5 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-[11px] font-medium rounded mb-2.5">
                    {item.category?.name || 'News'}
                  </span>
                  <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary-600 transition-colors mb-2">{item.title}</h4>
                  <span className="text-[11px] text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(new Date(item.publishedAt ?? ''))}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tools Showcase */}
      {popularTools.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-display font-extrabold text-gray-900 dark:text-white">Popular Tools</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Free online calculators and utilities</p>
            </div>
            <Link href="/tools" className="group flex items-center gap-1 text-primary-600 hover:text-primary-700 font-semibold text-sm">
              All Tools <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularTools.slice(0, 6).map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* Trending */}
      {trendingPosts.length > 0 && (
        <section className="bg-gray-50 dark:bg-dark-bg py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="mb-8">
              <h2 className="text-3xl font-display font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
                <Flame className="w-7 h-7 text-orange-500" />
                Trending Now
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Most read posts this week</p>
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-3">
                {trendingPosts.map((post, idx) => (
                  <TrendingRow key={post.id} post={post} index={idx} />
                ))}
              </div>
              <aside>
                <div className="card p-0 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-dark-border">
                    <h3 className="font-display font-bold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sponsored</h3>
                  </div>
                  <AdSlot slot="home-sidebar-ad" format="rectangle" style={{ minHeight: '250px', width: '100%' }} />
                </div>
              </aside>
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-extrabold text-gray-900 dark:text-white">Explore Categories</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Browse content by topic</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <CategoryBadge key={cat.id} category={cat} />
            ))}
          </div>
        </section>
      )}

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Newsletter */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-display font-extrabold text-gray-900 dark:text-white mb-4">Never Miss an Update</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Get the best blogs, games, and tools delivered to your inbox every week.
          </p>
          <NewsletterForm />
        </div>
      </section>

      {/* Bottom banner */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="text-center text-xs text-gray-400 mb-2">Advertisement</div>
        <AdSlot slot="home-bottom-banner" format="horizontal" className="w-full flex justify-center" style={{ minHeight: '90px' }} />
      </div>
    </div>
  );
}
