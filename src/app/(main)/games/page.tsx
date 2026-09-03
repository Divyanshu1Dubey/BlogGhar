import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Trophy, Play, Search, Filter, Flame, Star, Users } from 'lucide-react';
import { JsonLd } from '@/components/seo/json-ld';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return {
    title: 'Free Online Games - 52+ Games | Blog-Ghar',
    description: 'Play 52+ free online games at Blog-Ghar! Puzzles, arcade, word games, board games, quizzes. Compete on leaderboards. No download needed!',
    alternates: { canonical: 'https://bloghar.com/games' },
  };
}

export default async function GamesPage({ searchParams }: { searchParams?: Promise<{ category?: string; q?: string }> }) {
  const params = await searchParams;
  const activeCategory = params?.category || 'All';
  const query = params?.q || '';

  let games: any[] = [];
  const categories = ['All', 'Arcade', 'Puzzle', 'Word', 'Board', 'Quiz'];

  try {
    games = await prisma.game.findMany({
      where: {
        AND: [
          activeCategory !== 'All' ? { category: activeCategory.toUpperCase() } : {},
          query ? {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
              { tags: { contains: query, mode: 'insensitive' } },
            ],
          } : {},
        ],
      },
      orderBy: { playCount: 'desc' },
    });
  } catch {}

  const featured = games[0];

  return (
    <div className="min-h-screen">
      <JsonLd type="BreadcrumbList" data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://bloghar.com' },
          { '@type': 'ListItem', position: 2, name: 'Games', item: 'https://bloghar.com/games' },
        ],
      }} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 py-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-9xl animate-pulse">🎮</div>
          <div className="absolute bottom-10 right-10 text-7xl animate-pulse delay-500">🕹️</div>
          <div className="absolute top-1/2 left-1/2 text-8xl animate-pulse delay-300">🏆</div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-display font-extrabold text-white mb-4 drop-shadow-lg">
            🎮 Game Arcade
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">
            {games.length}+ free online games! Puzzles, arcade, word games, board games & quizzes.
            No downloads. No signup. Just play!
          </p>

          {/* Search Bar */}
          <form action="/games" method="GET" className="max-w-xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search games..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm"
              />
            </div>
          </form>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-white/70">
            <span className="flex items-center gap-1.5"><Flame className="w-4 h-4" /> {games.length} Games</span>
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> Multiplayer Ready</span>
            <span className="flex items-center gap-1.5"><Trophy className="w-4 h-4" /> Leaderboards</span>
            <span className="flex items-center gap-1.5"><Star className="w-4 h-4" /> Free Forever</span>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="max-w-7xl mx-auto px-4 -mt-4 relative z-10">
        <div className="card p-2">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={cat === 'All' ? '/games' : `/games?category=${cat.toLowerCase()}`}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                    : 'bg-gray-100 dark:bg-dark-bg text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {cat === 'All' ? '🎮 All Games' :
                 cat === 'Arcade' ? '🕹️ Arcade' :
                 cat === 'Puzzle' ? '🧩 Puzzle' :
                 cat === 'Word' ? '📝 Word' :
                 cat === 'Board' ? '🎲 Board' : '❓ Quiz'}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Game */}
      {featured && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-yellow-500" />
            <h2 className="text-xl font-display font-bold">Featured Game</h2>
          </div>
          <Link href={`/games/${featured.slug}`} className="card p-6 md:p-8 flex flex-col md:flex-row gap-6 hover:border-primary-300 hover:shadow-xl transition-all group">
            <div className="text-7xl md:text-8xl group-hover:scale-110 transition-transform duration-300">{featured.icon}</div>
            <div className="flex-1">
              <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs font-bold uppercase tracking-wider mb-3">
                ⭐ Featured
              </span>
              <h3 className="text-2xl md:text-3xl font-display font-extrabold mb-2 group-hover:text-primary-600 transition-colors">
                {featured.name}
              </h3>
              <p className="text-gray-500 mb-4 line-clamp-2">{featured.description}</p>
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium capitalize">
                  {featured.category.toLowerCase()}
                </span>
                {featured.difficulty && (
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    featured.difficulty === 'EASY' ? 'bg-green-100 text-green-700' :
                    featured.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {featured.difficulty}
                  </span>
                )}
                <span className="text-xs text-gray-400">
                  {featured.players ? `${featured.players} Player${featured.players !== '1' ? 's' : ''}` : '1 Player'}
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <span className="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold group-hover:bg-primary-700 transition-colors flex items-center gap-2">
                <Play className="w-5 h-5" /> Play Now
              </span>
            </div>
          </Link>
        </section>
      )}

      {/* Game Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-extrabold">
            {activeCategory === 'All' ? 'All Games' : activeCategory}
            <span className="text-base font-normal text-gray-400 ml-2">({games.length})</span>
          </h2>
          {query && (
            <p className="text-sm text-gray-500">
              Results for "<span className="font-medium text-primary-600">{query}</span>"
            </p>
          )}
        </div>

        {games.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {games.slice(1).map((game) => (
              <Link
                key={game.id}
                href={`/games/${game.slug}`}
                className="card p-4 flex flex-col items-center text-center gap-2.5 group hover:border-primary-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/40 dark:to-primary-800/30 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                  {game.icon || '🎮'}
                </div>
                <h3 className="font-display font-bold text-sm line-clamp-1 group-hover:text-primary-600 transition-colors">
                  {game.name}
                </h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 capitalize line-clamp-1">
                  {game.category.toLowerCase().replace(/_/g, ' ')}
                </p>
                <span className="text-xs text-primary-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Play Now →
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card p-16 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-display font-bold mb-2">No games found</h3>
            <p className="text-gray-500 mb-4">
              {query ? `No games match "${query}". Try a different search.` : `No games in ${activeCategory} yet.`}
            </p>
            <Link href="/games" className="text-primary-600 hover:text-primary-700 font-medium">
              Browse all games →
            </Link>
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="bg-gradient-to-r from-primary-600 to-indigo-700 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-display font-extrabold text-white mb-3">
            New games added every week! 🔄
          </h2>
          <p className="text-white/70 mb-6">
            Bookmark this page and check back regularly for new games, challenges, and leaderboards.
          </p>
          <Link href="/games" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 rounded-xl font-bold hover:bg-gray-100 transition-colors">
            <Trophy className="w-5 h-5" /> View All Games
          </Link>
        </div>
      </section>
    </div>
  );
}
