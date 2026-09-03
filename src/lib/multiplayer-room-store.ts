export interface Player {
  id: string;
  name: string;
  isReady: boolean;
  isHost: boolean;
  joinedAt: number;
}

export interface GameRoom {
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
  startedAt?: number;
  finishedAt?: number;
}

export const rooms = new Map<string, GameRoom>();

const WAITING_ROOM_TTL = 30 * 60 * 1000;
const FINISHED_ROOM_TTL = 10 * 60 * 1000;

export function cleanupRooms(now = Date.now()): void {
  for (const [id, room] of rooms) {
    const expiresAt = room.status === 'finished'
      ? (room.finishedAt || room.createdAt) + FINISHED_ROOM_TTL
      : room.status === 'waiting'
        ? room.createdAt + WAITING_ROOM_TTL
        : undefined;
    if (expiresAt !== undefined && expiresAt <= now) rooms.delete(id);
  }
}
