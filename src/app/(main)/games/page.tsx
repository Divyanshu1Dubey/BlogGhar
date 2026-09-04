import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Trophy, Play, Search, Flame, Star, Users, Zap, Crown, Medal } from 'lucide-react';
import { JsonLd } from '@/components/seo/json-ld';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return {
    title: 'Free Online Games - 52+ Games | Blog-Ghar',
    description: 'Play 52+ free online games at Blog-Ghar! Puzzles, arcade, word games, board games, quizzes. Multiplayer modes, levels & leaderboards. No download needed!',
    alternates: { canonical: 'https://bloghar.com/games' },
  };
}

const CATEGORIES = [
  { name: 'All', icon: '🎮', color: 'from-gray-500 to-gray-700' },
  { name: 'Arcade', icon: '🕹️', color: 'from-pink-500 to-rose-600' },
  { name: 'Puzzle', icon: '🧩', color: 'from-blue-500 to-cyan-600' },
  { name: 'Word', icon: '📝', color: 'from-green-500 to-emerald-600' },
  { name: 'Board', icon: '🎲', color: 'from-amber-500 to-orange-600' },
  { name: 'Quiz', icon: '❓', color: 'from-purple-500 to-violet-600' },
];

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const config = {
    EASY: { bg: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', label: 'Easy' },
    MEDIUM: { bg: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300', label: 'Medium' },
    HARD: { bg: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', label: 'Hard' },
  };
  const c = config[difficulty as keyof typeof config] || config.MEDIUM;
  return <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${c.bg}`}>{c.label}</span>;
}

function PlayerBadge({ players }: { players: string }) {
  const isMultiplayer = players.includes('-') || players === '2' || players === '2-4';
  return (
    <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${isMultiplayer ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
      <Users className="w-3 h-3" /> {players} {isMultiplayer ? 'Multiplayer' : 'Solo'}
    </span>
  );
}

export default async function GamesPage({ searchParams }: { searchParams?: Promise<{ category?: string; q?: string }> }) {
  const params = await searchParams;
  const activeCategory = params?.category || 'All';
  const query = params?.q || '';

  let games: any[] = [];
  if (prisma) {
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
    } catch { games = []; }
  }

  const featured = games[0];
  const multiplayerGames = games.filter(g => g.players?.includes('-') || g.players === '2' || g.players === '2-4');
  (games.slice(1, 7));

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

      {/* ═══════════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 py-20">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute top-10 left-[10%] text-8xl opacity-20 animate-bounce">🎮</div>
          <div className="absolute bottom-10 right-[10%] text-7xl opacity-20 animate-pulse">🏆</div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10rem] opacity-5">🎯</div>
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm mb-6 border border-white/10 text-white/90">
            <Zap className="w-4 h-4 text-yellow-300" />
            {games.length}+ Free Online Games
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
            🎮 Game Arcade
          </h1>

          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed">
            Play 52+ free online games! Puzzles, arcade, word games, board games & quizzes.
            Multiplayer modes, levels & leaderboards. No downloads. No signup.
          </p>

          {/* Search */}
          <form action="/games" method="GET" className="max-w-xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search for a game..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm text-base"
              />
            </div>
          </form>

          {/* Quick stats */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-white/80">
            <span className="flex items-center gap-1.5"><Flame className="w-4 h-4 text-orange-300" /> {games.length} Games</span>
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-blue-300" /> {multiplayerGames.length} Multiplayer</span>
            <span className="flex items-center gap-1.5"><Trophy className="w-4 h-4 text-yellow-300" /> Leaderboards</span>
            <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-pink-300" /> Free Forever</span>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full">
            <path d="M0 40L60 35C120 30 240 20 360 18C480 16 600 22 720 28C840 34 960 40 1080 38C1200 36 1320 26 1380 21L1440 16V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0V40Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CATEGORY FILTERS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 -mt-2 relative z-10">
        <div className="card p-2">
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={cat.name === 'All' ? '/games' : `/games?category=${cat.name.toLowerCase()}`}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                  activeCategory === cat.name
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                    : 'bg-gray-100 dark:bg-dark-bg text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          MULTIPLAYER SECTION
      ═══════════════════════════════════════════════════════════════ */}
      {activeCategory === 'All' && multiplayerGames.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-extrabold text-gray-900 dark:text-white">Multiplayer Games</h2>
              <p className="text-sm text-gray-500">Challenge your friends in real-time</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {multiplayerGames.slice(0, 4).map((game) => (
              <Link
                key={game.id}
                href={`/games/${game.slug}`}
                className="card p-5 flex flex-col items-center text-center gap-3 group hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-lg hover:shadow-purple-100 dark:hover:shadow-purple-900/20 transition-all"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/40 dark:to-purple-800/30 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    {game.icon || '🎮'}
                  </div>
                  <span className="absolute -top-1 -right-1 text-[10px] bg-purple-600 text-white px-1.5 py-0.5 rounded-full font-bold">VS</span>
                </div>
                <h3 className="font-display font-bold text-sm line-clamp-1 group-hover:text-purple-600 transition-colors">{game.name}</h3>
                <PlayerBadge players={game.players || '1-2'} />
              </Link>
            ))}
          </div>
          <div className="text-center mt-4">
            <Link href="/games/multiplayer" className="text-sm text-purple-600 hover:text-purple-700 font-semibold inline-flex items-center gap-1">
              View All Multiplayer Games <Star className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          FEATURED GAME
      ═══════════════════════════════════════════════════════════════ */}
      {featured && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="w-5 h-5 text-yellow-500" />
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
                <DifficultyBadge difficulty={featured.difficulty || 'MEDIUM'} />
                <PlayerBadge players={featured.players || '1'} />
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Medal className="w-3.5 h-3.5" /> {featured.playCount?.toLocaleString() || '1K+'} plays
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

      {/* ═══════════════════════════════════════════════════════════════
          GAME GRID
      ═══════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-extrabold text-gray-900 dark:text-white">
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
            {activeCategory !== 'All' ? games.map((game) => (
              <Link
                key={game.id}
                href={`/games/${game.slug}`}
                className="card p-4 flex flex-col items-center text-center gap-2.5 group hover:border-primary-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/40 dark:to-primary-800/30 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                  {game.icon || '🎮'}
                </div>
                <h3 className="font-display font-bold text-sm line-clamp-1 group-hover:text-primary-600 transition-colors">{game.name}</h3>
                <DifficultyBadge difficulty={game.difficulty || 'MEDIUM'} />
                <p className="text-[11px] text-gray-500 dark:text-gray-400 capitalize">{game.category.toLowerCase().replace(/_/g, ' ')}</p>
                <span className="text-xs text-primary-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">Play Now →</span>
              </Link>
            )) : games.slice(1).map((game) => (
              <Link
                key={game.id}
                href={`/games/${game.slug}`}
                className="card p-4 flex flex-col items-center text-center gap-2.5 group hover:border-primary-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/40 dark:to-primary-800/30 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                  {game.icon || '🎮'}
                </div>
                <h3 className="font-display font-bold text-sm line-clamp-1 group-hover:text-primary-600 transition-colors">{game.name}</h3>
                <DifficultyBadge difficulty={game.difficulty || 'MEDIUM'} />
                <p className="text-[11px] text-gray-500 dark:text-gray-400 capitalize">{game.category.toLowerCase().replace(/_/g, ' ')}</p>
                <span className="text-xs text-primary-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">Play Now →</span>
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
            <Link href="/games" className="text-primary-600 hover:text-primary-700 font-medium">Browse all games →</Link>
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          GAME MODES BANNER
      ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-r from-primary-600 to-indigo-700 py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-white mb-4">
            🎯 Challenge Yourself
          </h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            Every game has multiple difficulty levels, time challenges, and score tracking.
            Beat your high score and compete on global leaderboards!
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { icon: '🟢', title: 'Easy Mode', desc: 'Relaxed gameplay' },
              { icon: '🟡', title: 'Medium Mode', desc: 'Balanced challenge' },
              { icon: '🔴', title: 'Hard Mode', desc: 'Expert difficulty' },
              { icon: '⚡', title: 'Time Attack', desc: 'Beat the clock' },
            ].map((mode) => (
              <div key={mode.title} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="text-3xl mb-2">{mode.icon}</div>
                <h3 className="text-white font-bold text-sm">{mode.title}</h3>
                <p className="text-white/60 text-xs mt-1">{mode.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          HOW TO PLAY
      ═══════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-display font-extrabold text-gray-900 dark:text-white mb-3">How to Play</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Get started in seconds</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { step: '1', icon: '🔍', title: 'Choose a Game', desc: 'Browse our collection of 52+ free online games across multiple categories.' },
            { step: '2', icon: '🎮', title: 'Start Playing', desc: 'Click Play and jump right in. No downloads, no signups, no waiting.' },
            { step: '3', icon: '🏆', title: 'Beat Your Score', desc: 'Earn points, unlock achievements, and compete on global leaderboards!' },
          ].map((item) => (
            <div key={item.step} className="card p-6 text-center group hover:border-primary-300 transition-all">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div className="text-xs font-bold text-primary-600 mb-1">STEP {item.step}</div>
              <h3 className="font-display font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          BOTTOM CTA
      ═══════════════════════════════════════════════════════════════ */}
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
