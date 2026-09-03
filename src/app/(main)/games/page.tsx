import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Trophy, Play } from 'lucide-react';
import { JsonLd } from '@/components/seo/json-ld';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return {
    title: 'Free Online Games',
    description: 'Play free online mini-games, puzzles, quizzes, and arcade games on Blog-Ghar. Compete on leaderboards!',
    alternates: { canonical: 'https://bloghar.com/games' },
  };
}

export default async function GamesPage({ searchParams }: { searchParams?: Promise<{ category?: string }> }) {
  const params = await searchParams;
  const activeCategory = params?.category || 'All';
  let games: any[] = [];
  try {
    games = await prisma.game.findMany({
      where: activeCategory !== 'All' ? { category: activeCategory } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  } catch {}

  const featured = games[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <JsonLd type="BreadcrumbList" data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://bloghar.com' },
          { '@type': 'ListItem', position: 2, name: 'Games', item: 'https://bloghar.com/games' },
        ],
      }} />
      {games.length > 0 && <JsonLd type="ItemList" data={{
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        numberOfItems: games.length,
        itemListElement: games.slice(0, 10).map((game, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `https://bloghar.com/games/${game.slug}`,
          name: game.name,
        })),
      }} />}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-display font-extrabold mb-3">🎮 Games Arcade</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Play free online games. Compete on the leaderboards for prizes & bragging rights!
        </p>
      </div>

      {/* Featured */}
      {featured && (
        <Link href={`/games/${featured.slug}`} className="card mb-12 p-8 flex flex-col md:flex-row gap-6 hover:border-primary-300">
          <div className="text-7xl">{featured.icon}</div>
          <div className="flex-1">
            <span className="inline-block px-2 py-0.5 rounded bg-red-500 text-white text-xs font-bold uppercase mb-2">Featured</span>
            <h2 className="text-2xl font-display font-bold mb-2">{featured.name}</h2>
            <p className="text-gray-500">{featured.description}</p>
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
              <span className="flex items-center gap-1"><Trophy className="w-4 h-4 text-yellow-500" /> Score!</span>
              <span className="flex items-center gap-1"><Play className="w-4 h-4 text-primary-500" /> Play</span>
            </div>
          </div>
        </Link>
      )}

      {/* Categories */}
      <section className="mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {['All', 'Puzzle', 'Arcade', 'Word'].map((cat) => (
            <Link
              key={cat}
              href={cat === 'All' ? '/games' : `/games?category=${cat.toLowerCase()}`}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-dark-card hover:bg-gray-200'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Game Grid */}
      {games.length > 0 ? (
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {games.map((game) => (
            <Link key={game.id} href={`/games/${game.slug}`} className="card p-5 group hover:border-primary-300 hover:shadow-md transition-all">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{game.icon}</div>
              <h3 className="font-medium group-hover:text-primary-600">{game.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{game.description}</p>
              <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-dark-bg">{game.category}</span>
                <span className="flex items-center gap-1"><Trophy className="w-3 h-3 text-yellow-500" /> Score</span>
              </div>
            </Link>
          ))}
        </section>
      ) : (
        <div className="card p-12 text-center">
          <p className="text-4xl mb-3">🎮</p>
          <p className="text-gray-500">No games yet</p>
        </div>
      )}
    </div>
  );
}
