import { NextResponse } from 'next/server';
import { rooms } from '@/lib/multiplayer-room-store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const roomId = searchParams.get('roomId');

  if (roomId) {
    const room = rooms.get(roomId);
    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }
    return NextResponse.json({ room });
  }

  // List all active rooms
  const active = Array.from(rooms.values()).filter((r: any) => r.status === 'waiting');
  return NextResponse.json({ rooms: active });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { roomId, playerName, playerId } = body;

    if (!roomId || !playerName) {
      return NextResponse.json({ error: 'Missing roomId or playerName' }, { status: 400 });
    }

    const room = rooms.get(roomId);
    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    if (room.status !== 'waiting') {
      return NextResponse.json({ error: 'Room is not accepting players' }, { status: 400 });
    }

    const existingPlayer = room.players.find((p: any) => p.id === playerId);
    if (existingPlayer) {
      return NextResponse.json({ room, playerId }, { status: 200 });
    }

    if (room.players.length >= room.maxPlayers) {
      return NextResponse.json({ error: 'Room is full' }, { status: 400 });
    }

    const newPlayerId = playerId || `player_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const newPlayer = {
      id: newPlayerId,
      name: playerName.trim().slice(0, 20) || 'Player',
      isReady: false,
      isHost: false,
      joinedAt: Date.now(),
    };

    room.players.push(newPlayer);
    rooms.set(roomId, room);

    return NextResponse.json({ room, playerId: newPlayerId }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to join room' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { roomId, playerId, action } = body;

    if (!roomId || !playerId || !action) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const room = rooms.get(roomId);
    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    const player = room.players.find((p: any) => p.id === playerId);
    if (!player) {
      return NextResponse.json({ error: 'Player not in room' }, { status: 403 });
    }

    if (action === 'toggleReady') {
      player.isReady = !player.isReady;
    } else if (action === 'setReady') {
      player.isReady = true;
    } else if (action === 'startGame') {
      if (!player.isHost) {
        return NextResponse.json({ error: 'Only host can start the game' }, { status: 403 });
      }
      if (room.status !== 'waiting' || room.players.length < 2 || !room.players.every((p) => p.isReady)) {
        return NextResponse.json({ error: 'Room is not ready to start' }, { status: 400 });
      }
      room.status = 'playing';
      room.startedAt = Date.now();
    } else if (action === 'setResult') {
      const { winner, scores } = body;
      if (room.status !== 'playing') {
        return NextResponse.json({ error: 'Game is not currently playing' }, { status: 400 });
      }
      room.status = 'finished';
      room.result = { winner, scores };
      room.finishedAt = Date.now();
    } else if (action === 'rematch') {
      if (room.status !== 'finished') {
        return NextResponse.json({ error: 'Game has not finished' }, { status: 400 });
      }
      room.status = 'waiting';
      room.players.forEach((p: any) => (p.isReady = false));
      delete room.result;
      delete room.finishedAt;
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    rooms.set(roomId, room);
    return NextResponse.json({ room });
  } catch {
    return NextResponse.json({ error: 'Failed to update room' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const roomId = searchParams.get('roomId');

  if (!roomId) {
    return NextResponse.json({ error: 'Missing roomId' }, { status: 400 });
  }

  if (rooms.has(roomId)) {
    rooms.delete(roomId);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Room not found' }, { status: 404 });
}
