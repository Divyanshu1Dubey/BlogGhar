'use client';

import { useState } from 'react';
import { Users, Bot, UserPlus, Globe, Trophy, Sparkles } from 'lucide-react';

type GameMode = 'solo' | 'ai' | 'local' | 'online';

interface GameModeSelectorProps {
  gameName: string;
  gameIcon: string;
  supportedModes: GameMode[];
  onSelectMode: (mode: GameMode) => void;
}

export default function GameModeSelector({ gameName, gameIcon, supportedModes, onSelectMode }: GameModeSelectorProps) {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  const modes: { id: GameMode; icon: any; label: string; desc: string; color: string }[] = [
    { id: 'solo', icon: UserPlus, label: 'Solo', desc: 'Play at your own pace', color: 'from-blue-500 to-blue-600' },
    { id: 'ai', icon: Bot, label: 'vs AI', desc: 'Challenge the computer', color: 'from-purple-500 to-purple-600' },
    { id: 'local', icon: Users, label: '2 Players', desc: 'Pass & play', color: 'from-green-500 to-green-600' },
    { id: 'online', icon: Globe, label: 'Online', desc: 'Play with strangers', color: 'from-orange-500 to-orange-600' },
  ];

  const isMultiplayer = supportedModes.some(m => m === 'local' || m === 'online');
  void isMultiplayer;

  return (
    <div className="max-w-3xl mx-auto py-8">
      {/* Game Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4 animate-bounce">{gameIcon}</div>
        <h2 className="text-3xl font-display font-extrabold text-gray-900 dark:text-white mb-2">
          {gameName}
        </h2>
        <p className="text-gray-500">Choose how you want to play</p>
      </div>

      {/* Game Mode Selection */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {modes.map(({ id, icon: Icon, label, desc, color }) => (
          <button
            key={id}
            onClick={() => onSelectMode(id)}
            disabled={!supportedModes.includes(id)}
            className={`group relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-300
              ${!supportedModes.includes(id)
                ? 'opacity-30 cursor-not-allowed bg-gray-100 dark:bg-gray-800'
                : 'bg-white dark:bg-dark-card border-2 border-transparent hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-xl hover:shadow-primary-100 dark:hover:shadow-primary-900/20 hover:-translate-y-1 cursor-pointer'
              }`}
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-display font-bold text-sm text-gray-900 dark:text-white">{label}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
          </button>
        ))}
      </div>

      {/* AI Difficulty (shown when AI mode is selected) */}
      {supportedModes.includes('ai') && (
        <div className="card p-5 mb-6">
          <h3 className="font-display font-bold text-sm mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            AI Difficulty
          </h3>
          <div className="flex gap-2">
            {(['easy', 'medium', 'hard'] as const).map(level => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold capitalize transition-all duration-200
                  ${difficulty === level
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-200'
                    : 'bg-gray-100 dark:bg-dark-bg text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
              >
                {level === 'easy' ? '😊' : level === 'medium' ? '🤔' : '🔥'} {level}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            {difficulty === 'easy' ? 'Perfect for beginners and casual players' :
             difficulty === 'medium' ? 'A balanced challenge for regular players' :
             'Only for experts! Very challenging AI'}
          </p>
        </div>
      )}

      {/* Leaderboard */}
      <div className="card p-5">
        <h3 className="font-display font-bold text-sm mb-3 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-500" />
          Leaderboard
        </h3>
        <div className="space-y-1.5">
          {[
            { rank: 1, name: 'ProGamer99', score: 15420, emoji: '🥇' },
            { rank: 2, name: 'GameMaster', score: 12850, emoji: '🥈' },
            { rank: 3, name: 'ChampionX', score: 10200, emoji: '🥉' },
            { rank: 4, name: 'PlayerOne', score: 8900, emoji: '4️⃣' },
            { rank: 5, name: 'You (best)', score: 0, emoji: '⭐', isYou: true },
          ].map(entry => (
            <div key={entry.rank} className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors ${entry.isYou ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
              <span className="w-7 text-center text-base">{entry.emoji}</span>
              <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300">{entry.name}</span>
              <span className={`text-sm font-bold ${entry.isYou ? 'text-primary-600' : 'text-gray-500'}`}>
                {entry.score > 0 ? entry.score.toLocaleString() : '---'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
