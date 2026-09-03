import { NextResponse } from 'next/server';

// ─── In-Memory Room Store ──────────────────────────────────────────────────

interface Player {
  id: string;
  name: string;
  isReady: boolean;
  isHost: boolean;
  joinedAt: number;
}

interface GameRoom {
  id: string;
  code: string;
  gameType: string;
  gameSlug: string;
  mode: 'casual' | 'ranked';
  players: Player[];
  status: 'waiting' | 'playing' | 'finished';
  result?: { winner: string | null; scores: Record<string, number> };
  createdAt: number;
  maxPlayers: number;
}

type RoomStore = Map<string, GameRoom>;

const rooms: RoomStore = new Map();

const GAME_TYPES = [
  { name: 'Tic-Tac-Toe', slug: 'tic-tac-toe', players: '2', maxPlayers: 2, icon: '❌⭕' },
  { name: 'Chess', slug: 'chess', players: '2', maxPlayers: 2, icon: '♟️' },
  { name: 'Snake Race', slug: 'snake', players: '2-4', maxPlayers: 4, icon: '🐍' },
  { name: '2048 Battle', slug: '2048', players: '2', maxPlayers: 2, icon: '🔢' },
  { name: 'Dice Duel', slug: 'dice', players: '2-6', maxPlayers: 6, icon: '🎲' },
  { name: 'Rock Paper Scissors', slug: 'rps', players: '2', maxPlayers: 2, icon: '✂️' },
];

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function generateRoomId(): string {
  return `room_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function generatePlayerId(): string {
  return `player_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function getRoomsList() {
  return Array.from(rooms.values()).map((room) => ({
    id: room.id,
    code: room.code,
    gameType: room.gameType,
    gameSlug: room.gameSlug,
    mode: room.mode,
    playerCount: room.players.length,
    maxPlayers: room.maxPlayers,
    status: room.status,
    hostName: room.players.find((p) => p.isHost)?.name || 'Unknown',
    createdAt: room.createdAt,
  }));
}

// ─── Route Handlers ────────────────────────────────────────────────────────

export async function GET() {
  try {
    const list = getRoomsList();
    return NextResponse.json({ rooms: list, gameTypes: GAME_TYPES });
  } catch {
    return NextResponse.json({ rooms: [], gameTypes: GAME_TYPES });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { gameSlug, mode, playerName } = body as {
      gameSlug?: string;
      mode?: string;
      playerName?: string;
    };

    if (!gameSlug || !playerName) {
      return NextResponse.json({ error: 'Missing required fields: gameSlug, playerName' }, { status: 400 });
    }

    const gameType = GAME_TYPES.find((g) => g.slug === gameSlug);
    if (!gameType) {
      return NextResponse.json({ error: 'Invalid game type' }, { status: 400 });
    }

    const validMode = mode === 'ranked' ? 'ranked' : 'casual';
    const roomId = generateRoomId();
    const code = generateRoomCode();
    const playerId = generatePlayerId();

    // Ensure unique code
    let finalCode = code;
    let attempts = 0;
    while (Array.from(rooms.values()).some((r) => r.code === finalCode) && attempts < 10) {
      finalCode = generateRoomCode();
      attempts++;
    }

    const room: GameRoom = {
      id: roomId,
      code: finalCode,
      gameType: gameType.name,
      gameSlug: gameType.slug,
      mode: validMode,
      players: [
        {
          id: playerId,
          name: playerName.trim().slice(0, 20) || 'Player 1',
          isReady: false,
          isHost: true,
          joinedAt: Date.now(),
        },
      ],
      status: 'waiting',
      createdAt: Date.now(),
      maxPlayers: gameType.maxPlayers,
    };

    rooms.set(roomId, room);

    return NextResponse.json({ room, playerId }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create room' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');
    const playerId = searchParams.get('playerId');

    if (!roomId || !playerId) {
      return NextResponse.json({ error: 'Missing roomId or playerId' }, { status: 400 });
    }

    const room = rooms.get(roomId);
    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    const playerIndex = room.players.findIndex((p) => p.id === playerId);
    if (playerIndex === -1) {
      return NextResponse.json({ error: 'Player not in room' }, { status: 403 });
    }

    if (room.players[playerIndex].isHost) {
      // Host leaving - dissolve room
      rooms.delete(roomId);
      return NextResponse.json({ success: true, dissolved: true });
    }

    room.players.splice(playerIndex, 1);
    rooms.set(roomId, room);
    return NextResponse.json({ success: true, dissolved: false });
  } catch {
    return NextResponse.json({ error: 'Failed to leave room' }, { status: 500 });
  }
}
