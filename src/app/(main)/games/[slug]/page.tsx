import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import GameClient from './game-client';
import Link from 'next/link';
import { ArrowLeft, Share2 } from 'lucide-react';

type GameParams = Promise<{ slug: string }>;

export default async function GamePage({ params }: { params: GameParams }) {
  const { slug } = await params;
  const game = await prisma.game.findUnique({ where: { slug } });
  if (!game) notFound();

  const topScores = await prisma.gameScore.findMany({
    where: { gameId: game.id },
    orderBy: { score: 'desc' },
    take: 5,
    include: { user: { select: { name: true, image: true } } },
  });

  return (
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

      <div className="card overflow-hidden">
        <GameClient game={game} topScores={topScores} />
      </div>

      <div className="card p-6 mt-6">
        <h3 className="font-display font-bold text-lg mb-3">📜 Instructions</h3>
        <p className="text-gray-600 dark:text-gray-400">{game.instructions}</p>
      </div>

      <div className="text-center py-6">
        <p className="text-sm text-gray-400">🤖 Built by Blog-Ghar • Share this game with friends!</p>
      </div>
    </div>
  );
}
