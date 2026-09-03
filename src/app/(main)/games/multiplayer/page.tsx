import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Metadata } from 'next';
import { JsonLd } from '@/components/seo/json-ld';
import MultiplayerLobby from '@/components/games/multiplayer-room';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Multiplayer Games - Play with Friends',
    description: 'Challenge your friends in multiplayer games. Create or join a room and compete in real-time!',
    alternates: { canonical: 'https://bloghar.com/games/multiplayer' },
  };
}

export default async function MultiplayerPage() {
  // Fetch multiplayer-capable games
  const multiplayerSlugs = ['tic-tac-toe', 'snake', '2048', 'dice', 'rps', 'chess'];
  const allGames = await prisma.game.findMany({
    where: { isActive: true, slug: { in: multiplayerSlugs } },
    orderBy: { playCount: 'desc' },
  });

  return (
    <div className="min-h-screen">
      <JsonLd
        type="BreadcrumbList"
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://bloghar.com' },
            { '@type': 'ListItem', position: 2, name: 'Games', item: 'https://bloghar.com/games' },
            { '@type': 'ListItem', position: 3, name: 'Multiplayer', item: 'https://bloghar.com/games/multiplayer' },
          ],
        }}
      />

      <MultiplayerLobby initialGames={allGames} />
    </div>
  );
}
