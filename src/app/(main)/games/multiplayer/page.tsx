'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Trophy, Play, Copy, Check, RefreshCw } from 'lucide-react';

type Player = { id: string; name: string; ready: boolean; score: number };
type GameMode = 'ludo' | 'chess' | 'tic-tac-toe' | 'dice' | 'connect-4';

const GAME_MODES: { id: GameMode; name: string; icon: string; players: string; color: string }[] = [
  { id: 'tic-tac-toe', name: 'Tic Tac Toe', icon: '⭕', players: '2', color: 'from-blue-500 to-cyan-600' },
  { id: 'connect-4', name: 'Connect 4', icon: '🔴', players: '2', color: 'from-red-500 to-orange-600' },
  { id: 'chess', name: 'Chess', icon: '♟️', players: '2', color: 'from-purple-500 to-violet-600' },
  { id: 'dice', name: 'Dice Battle', icon: '🎲', players: '2-4', color: 'from-green-500 to-emerald-600' },
  { id: 'ludo', name: 'Ludo', icon: '🎯', players: '2-4', color: 'from-yellow-500 to-amber-600' },
];

export default function MultiplayerLobby() {
  const [mode, setMode] = useState<GameMode>('tic-tac-toe');
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectedMode = GAME_MODES.find((m) => m.id === mode)!;
  const maxPlayers = parseInt(selectedMode.players.split('-')[1] || selectedMode.players);

  const createRoom = () => {
    if (!playerName.trim()) return;
    const id = Math.random().toString(36).slice(2, 8).toUpperCase();
    setRoomId(id);
    setIsHost(true);
    setPlayers([
      { id: 'you', name: playerName, ready: true, score: 0 },
    ]);
  };

  const joinRoom = () => {
    if (!playerName.trim() || !roomId.trim()) return;
    setIsHost(false);
    setPlayers((prev) => {
      if (prev.some((p) => p.id === 'you')) {
        return prev.map((p) => (p.id === 'you' ? { ...p, name: playerName, ready: true } : p));
      }
      return [...prev, { id: 'you', name: playerName, ready: true, score: 0 }];
    });
  };

  const addBot = () => {
    const botNames = ['Bot Alpha', 'Bot Beta', 'Bot Gamma', 'Pro Player', 'Challenger'];
    const available = botNames.filter((n) => !players.some((p) => p.name === n));
    if (available.length > 0 && players.length < maxPlayers) {
      setPlayers((prev) => [
        ...prev,
        { id: `bot-${Date.now()}`, name: available[0], ready: true, score: 0 },
      ]);
    }
  };

  const removePlayer = (id: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  const startGame = () => {
    if (players.length >= 2) {
      setGameStarted(true);
    }
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (gameStarted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">{selectedMode.icon}</div>
          <h2 className="text-3xl font-display font-extrabold text-gray-900 dark:text-white mb-2">
            Game Starting!
          </h2>
          <p className="text-gray-500 mb-6">
            Playing {selectedMode.name} with {players.length} players
          </p>
          <div className="card p-6 max-w-md mx-auto mb-6">
            <h3 className="font-bold mb-3">Players</h3>
            {players.map((p, i) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <span className="flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </span>
                  {p.name}
                </span>
                <span className="text-sm text-gray-500">Score: {p.score}</span>
              </div>
            ))}
          </div>
          <Link
            href={`/games/${mode}`}
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors"
          >
            <Play className="w-5 h-5" /> Launch Game
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium mb-4">
            <Users className="w-4 h-4" /> Multiplayer Lobby
          </div>
          <h1 className="text-4xl font-display font-extrabold text-gray-900 dark:text-white mb-2">
            🎮 Challenge Your Friends
          </h1>
          <p className="text-gray-500">Create a room or join an existing one to play together</p>
        </div>

        {/* Game Mode Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Choose Game Mode</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {GAME_MODES.map((gm) => (
              <button
                key={gm.id}
                onClick={() => { setMode(gm.id); setPlayers([]); setRoomId(''); }}
                className={`card p-4 text-center transition-all ${
                  mode === gm.id
                    ? 'ring-2 ring-primary-500 border-primary-300'
                    : 'hover:border-gray-300'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gm.color} flex items-center justify-center text-2xl mx-auto mb-2`}>
                  {gm.icon}
                </div>
                <h3 className="font-bold text-sm mb-1">{gm.name}</h3>
                <p className="text-xs text-gray-500">{gm.players} Players</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Room Controls */}
          <div className="card p-6">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Room Controls
            </h2>

            {!roomId ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter your name..."
                    maxLength={20}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-dark-bg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={createRoom}
                    disabled={!playerName.trim()}
                    className="px-4 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                  >
                    Create Room
                  </button>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                      placeholder="Room ID"
                      maxLength={6}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm uppercase bg-white dark:bg-dark-bg focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                      onClick={joinRoom}
                      disabled={!playerName.trim() || !roomId.trim()}
                      className="w-full px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                    >
                      Join Room
                    </button>
                  </div>
                </div>

                <p className="text-xs text-gray-400 text-center">
                  Share the room ID with friends to invite them
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-bg rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Room ID</p>
                    <p className="text-2xl font-mono font-bold text-gray-900 dark:text-white tracking-widest">{roomId}</p>
                  </div>
                  <button
                    onClick={copyRoomId}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Copy Room ID"
                  >
                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-gray-500" />}
                  </button>
                </div>

                <p className="text-sm text-gray-500">Share this room ID with friends to invite them to play!</p>

                <button
                  onClick={() => { setRoomId(''); setPlayers([]); }}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Leave Room
                </button>
              </div>
            )}
          </div>

          {/* Right: Players */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                Players ({players.length}/{maxPlayers})
              </h2>
              {players.length < maxPlayers && roomId && (
                <button
                  onClick={addBot}
                  className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  + Add Bot
                </button>
              )}
            </div>

            {players.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No players yet. Create or join a room!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {players.map((player, i) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-bg rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {player.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {player.name}
                          {player.id === 'you' && <span className="text-xs text-primary-600 ml-1">(You)</span>}
                          {isHost && player.id === 'you' && <span className="text-xs text-yellow-600 ml-1">👑 Host</span>}
                        </p>
                        <p className="text-xs text-gray-400">
                          {player.id.startsWith('bot') ? '🤖 Bot' : 'Ready'}
                        </p>
                      </div>
                    </div>
                    {player.id !== 'you' && (
                      <button
                        onClick={() => removePlayer(player.id)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {players.length >= 2 && roomId && (
              <button
                onClick={startGame}
                className="w-full mt-4 px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" /> Start Game
              </button>
            )}
          </div>
        </div>

        {/* Quick Play */}
        <div className="mt-8 text-center">
          <Link
            href={`/games/${mode}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            <Play className="w-4 h-4" /> Play Solo Practice
          </Link>
        </div>
      </div>
    </div>
  );
}
