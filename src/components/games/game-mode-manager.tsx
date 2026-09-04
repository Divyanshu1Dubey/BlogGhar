'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Users, Trophy, Play, Zap, Crown, Star, Timer } from 'lucide-react';

type GameMode = {
  id: string;
  name: string;
  icon: string;
  players: string;
  color: string;
  description: string;
};

const GAME_MODES: GameMode[] = [
  { id: 'tic-tac-toe', name: 'Tic Tac Toe', icon: '⭕', players: '2', color: 'from-blue-500 to-cyan-600', description: 'Classic strategy game for 2 players' },
  { id: 'connect-4', name: 'Connect 4', icon: '🔴', players: '2', color: 'from-red-500 to-orange-600', description: 'Drop discs to connect 4 in a row' },
  { id: 'chess', name: 'Chess', icon: '♟️', players: '2', color: 'from-purple-500 to-violet-600', description: 'The ultimate strategy board game' },
  { id: 'dice', name: 'Dice Battle', icon: '🎲', players: '2-4', color: 'from-green-500 to-emerald-600', description: 'Roll dice and compete for the highest score' },
  { id: 'ludo', name: 'Ludo', icon: '🎯', players: '2-4', color: 'from-yellow-500 to-amber-600', description: 'Race your tokens home in this classic game' },
];

type Difficulty = 'easy' | 'medium' | 'hard' | 'time-attack';

export function GameModeManager({ gameSlug }: { gameSlug: string }) {
  const [selectedMode, setSelectedMode] = useState<string>('medium');
  const [selectedGame, setSelectedGame] = useState<string>(GAME_MODES[0].id);
  const [playerCount, setPlayerCount] = useState<number>(2);

  const game = GAME_MODES.find((g) => g.id === selectedGame);

  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-6">
      <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-500" />
        Game Options
      </h2>

      {/* Game Mode Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Game
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {GAME_MODES.map((gm) => (
            <button
              key={gm.id}
              onClick={() => setSelectedGame(gm.id)}
              className={`p-4 rounded-xl text-center transition-all ${
                selectedGame === gm.id
                  ? 'ring-2 ring-primary-500 border-primary-300 bg-primary-50 dark:bg-primary-900/20'
                  : 'border border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gm.color} flex items-center justify-center text-2xl mx-auto mb-2`}>
                {gm.icon}
              </div>
              <h3 className="font-bold text-xs mb-1">{gm.name}</h3>
              <p className="text-[10px] text-gray-500">{gm.players} Players</p>
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Difficulty Level
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'easy', label: 'Easy', icon: '🟢', desc: 'Relaxed gameplay' },
            { id: 'medium', label: 'Medium', icon: '🟡', desc: 'Balanced challenge' },
            { id: 'hard', label: 'Hard', icon: '🔴', desc: 'Expert difficulty' },
            { id: 'time-attack', label: 'Time Attack', icon: '⚡', desc: 'Beat the clock' },
          ].map((diff) => (
            <button
              key={diff.id}
              onClick={() => setSelectedMode(diff.id)}
              className={`flex-1 min-w-[120px] px-4 py-3 rounded-xl text-center transition-all ${
                selectedMode === diff.id
                  ? 'bg-primary-100 dark:bg-primary-900/30 border-2 border-primary-500'
                  : 'border border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-1">{diff.icon}</div>
              <div className="text-sm font-bold">{diff.label}</div>
              <div className="text-[10px] text-gray-500">{diff.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Player Count */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Number of Players
        </label>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setPlayerCount(Math.max(1, playerCount - 1))}
            className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            -
          </button>
          <span className="text-2xl font-bold w-8 text-center">{playerCount}</span>
          <button
            onClick={() => setPlayerCount(Math.min(4, playerCount + 1))}
            className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            +
          </button>
          <span className="text-sm text-gray-500">players</span>
        </div>
      </div>

      {/* Play Button */}
      <Link
        href={`/games/${selectedGame}?mode=${selectedMode}&players=${playerCount}`}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors"
      >
        <Play className="w-5 h-5" />
        Start Game
      </Link>

      {/* Stats Preview */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="text-center p-3 bg-gray-50 dark:bg-dark-bg rounded-lg">
          <Crown className="w-4 h-4 text-yellow-500 mx-auto mb-1" />
          <div className="text-xs text-gray-500">Level</div>
          <div className="text-sm font-bold">{selectedMode === 'hard' ? 'Expert' : selectedMode === 'medium' ? 'Intermediate' : 'Beginner'}</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-dark-bg rounded-lg">
          <Star className="w-4 h-4 text-orange-500 mx-auto mb-1" />
          <div className="text-xs text-gray-500">Points</div>
          <div className="text-sm font-bold">{selectedMode === 'hard' ? '3x' : selectedMode === 'medium' ? '2x' : '1x'}</div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-dark-bg rounded-lg">
          <Timer className="w-4 h-4 text-blue-500 mx-auto mb-1" />
          <div className="text-xs text-gray-500">Time</div>
          <div className="text-sm font-bold">{selectedMode === 'time-attack' ? '60s' : '∞'}</div>
        </div>
      </div>
    </div>
  );
}
