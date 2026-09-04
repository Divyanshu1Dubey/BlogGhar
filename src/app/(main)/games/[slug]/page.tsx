import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import GameClient from './game-client';
import { GameModeManager } from '@/components/games/game-mode-manager';
import { GameProgressTracker } from '@/components/games/game-progress-tracker';
import Link from 'next/link';
import { ArrowLeft, Share2 } from 'lucide-react';
import { Metadata } from 'next';
import { JsonLd } from '@/components/seo/json-ld';

type GameParams = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: GameParams }): Promise<Metadata> {
  try {
    if (!prisma) return {};
    const { slug } = await params;
    const game = await prisma.game.findUnique({ where: { slug } });
    if (!game) return {};
    return {
      title: `${game.name} - Free Online Game`,
      description: game.description,
      openGraph: { title: `${game.name} - Free Online Game`, description: game.description ?? undefined, type: 'website' },
      alternates: { canonical: `https://bloghar.com/games/${game.slug ?? ''}` },
    };
  } catch { return {}; }
}

export default async function GamePage({ params }: { params: GameParams }) {
  const { slug } = await params;

  if (!prisma) notFound();

  const game = await prisma.game.findUnique({ where: { slug } });
  if (!game) notFound();

  const topScores = await prisma.gameScore.findMany({
    where: { gameId: game.id },
    orderBy: { score: 'desc' },
    take: 5,
    include: { user: { select: { name: true, image: true } } },
  });

  return (
    <>
      <JsonLd type="VideoGame" data={{
        '@context': 'https://schema.org',
        name: game.name,
        description: game.description,
        url: `https://bloghar.com/games/${game.slug}`,
        applicationCategory: 'Game',
        operatingSystem: 'Web Browser',
        playMode: 'SinglePlayer',
        genre: game.category || 'Puzzle',
      }} />
      <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link href="/games" className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600">
          <ArrowLeft className="w-4 h-4" /> Back to Games
        </Link>
        <button className="p-2 bg-white dark:bg-dark-card rounded-lg hover:bg-gray-100" title="Share">
          <Share2 className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <div className="text-center mb-6">
        <h1 className="text-3xl font-display font-extrabold">{game.icon} {game.name}</h1>
        <p className="text-gray-500 mt-1">{game.description}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main game area */}
        <div className="lg:col-span-2 space-y-6">
          <GameModeManager gameSlug={slug} />
          <div className="card overflow-hidden">
            <GameClient topScores={topScores} game={game} />
          </div>
        </div>

        {/* Sidebar: Progress & Mode Selection */}
        <div className="space-y-6">
          <GameProgressTracker gameSlug={slug} />
          <div className="card p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">🎮 Game Mode</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Choose how you want to play this game.</p>
            <div className="mt-4 space-y-2">
              <button className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold text-sm hover:bg-primary-700 transition-colors">
                🎯 Single Player
              </button>
              <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold text-sm hover:bg-purple-700 transition-colors">
                👥 Multiplayer
              </button>
              <button className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold text-sm hover:bg-gray-300 transition-colors">
                ⚡ Quick Match
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6 mt-6">
        <h3 className="font-display font-bold text-lg mb-3">📜 Instructions</h3>
        <p className="text-gray-600 dark:text-gray-400">{game.description || 'Play this game and try to beat the high score!'}</p>
      </div>

      <div className="text-center py-6">
        <p className="text-sm text-gray-400">🤖 Built by Blog-Ghar • Share this game with friends!</p>
      </div>
    </div>
    </>
  );
}
