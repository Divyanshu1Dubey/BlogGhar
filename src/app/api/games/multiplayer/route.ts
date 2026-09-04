import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory room store
interface Room {
  id: string;
  game: string;
  mode: 'local' | 'online';
  players: Array<{ id: string; name: string; ready: boolean; score: number }>;
  status: 'waiting' | 'playing' | 'finished';
  createdAt: number;
  gameState: Record<string, unknown>;
}

const rooms = new Map<string, Room>();
const connections = new Map<string, { ws: any; roomId: string; playerId: string }>();

function generateRoomId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function generatePlayerId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export async function GET(request: NextRequest) {
  const game = request.nextUrl.searchParams.get('game');

  const availableRooms = Array.from(rooms.values())
    .filter(r => r.mode === 'online' && r.status === 'waiting')
    .filter(r => !game || r.game === game)
    .slice(0, 20)
    .map(r => ({
      id: r.id,
      game: r.game,
      players: r.players.length,
      maxPlayers: r.game === 'tic-tac-toe' ? 2 : 4,
      status: r.status,
    }));

  return NextResponse.json({ rooms: availableRooms, totalPlayers: connections.size });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { game, mode, playerName } = body;

    if (!game || !mode) {
      return NextResponse.json({ error: 'Game and mode are required' }, { status: 400 });
    }

    const roomId = generateRoomId();
    const playerId = generatePlayerId();

    const room: Room = {
      id: roomId,
      game,
      mode,
      players: [{
        id: playerId,
        name: playerName || `Player ${playerId.slice(0, 4)}`,
        ready: true,
        score: 0,
      }],
      status: 'waiting',
      createdAt: Date.now(),
      gameState: {},
    };

    rooms.set(roomId, room);

    return NextResponse.json({
      roomId,
      playerId,
      room: {
        id: room.id,
        game: room.game,
        mode: room.mode,
        players: room.players,
        status: room.status,
        maxPlayers: room.game === 'tic-tac-toe' ? 2 : 4,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
