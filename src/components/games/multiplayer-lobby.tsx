'use client';

import { useState } from 'react';

type Game = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
};

export default function MultiplayerLobby({ initialGames }: { initialGames: Game[] }) {
  const [roomCode, setRoomCode] = useState('');
  const [selectedGame, setSelectedGame] = useState(initialGames[0]?.slug || '');
  const [message, setMessage] = useState('');

  async function createRoom() {
    const response = await fetch('/api/games/multiplayer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameSlug: selectedGame }),
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error || 'Unable to create room');
      return;
    }
    setRoomCode(data.room?.code || data.code || '');
    setMessage('Room created. Share the code with your friend.');
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="card p-6 sm:p-8">
        <h1 className="text-3xl font-display font-bold mb-2">Multiplayer Lobby</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Create a room and invite a friend to play.</p>
        <label className="block text-sm font-medium mb-2" htmlFor="multiplayer-game">Choose a game</label>
        <select
          id="multiplayer-game"
          value={selectedGame}
          onChange={(event) => setSelectedGame(event.target.value)}
          className="w-full rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card p-3 mb-4"
        >
          {initialGames.map((game) => (
            <option key={game.id} value={game.slug}>{game.icon || '🎮'} {game.name}</option>
          ))}
        </select>
        <button type="button" onClick={createRoom} disabled={!selectedGame} className="px-5 py-3 rounded-lg bg-primary-600 text-white font-medium disabled:opacity-50">
          Create Room
        </button>
        {roomCode && <p className="mt-5 font-semibold">Room code: <span className="font-mono">{roomCode}</span></p>}
        {message && <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{message}</p>}
      </div>
    </div>
  );
}
