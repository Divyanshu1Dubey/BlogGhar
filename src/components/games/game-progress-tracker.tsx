'use client';

import { useState, useEffect } from 'react';
import { Star, Trophy } from 'lucide-react';

interface GameProgressProps {
  gameSlug: string;
}

type Level = {
  id: number;
  name: string;
  description: string;
  stars: number;
  maxStars: number;
  unlocked: boolean;
  difficulty: string;
};

export function GameProgressTracker({ gameSlug }: GameProgressProps) {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [levels, setLevels] = useState<Level[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const savedLevel = parseInt(localStorage.getItem(`game-level-${gameSlug}`) || '1');
    const savedScore = parseInt(localStorage.getItem(`game-score-${gameSlug}`) || '0');
    const savedHighScore = parseInt(localStorage.getItem(`game-high-${gameSlug}`) || '0');

    setCurrentLevel(savedLevel);
    setTotalScore(savedScore);
    setHighScore(savedHighScore);

    const levelData: Level[] = [
      { id: 1, name: 'Rookie', description: 'Get started', stars: Math.min(savedHighScore > 0 ? 3 : 0, 3), maxStars: 3, unlocked: true, difficulty: 'Easy' },
      { id: 2, name: 'Amateur', description: 'Score 500+', stars: savedHighScore >= 500 ? 3 : savedHighScore >= 200 ? 1 : 0, maxStars: 3, unlocked: savedLevel >= 2 || savedHighScore >= 200, difficulty: 'Easy' },
      { id: 3, name: 'Intermediate', description: 'Score 1000+', stars: savedHighScore >= 1000 ? 3 : savedHighScore >= 600 ? 2 : savedHighScore >= 300 ? 1 : 0, maxStars: 3, unlocked: savedLevel >= 3 || savedHighScore >= 600, difficulty: 'Medium' },
      { id: 4, name: 'Advanced', description: 'Score 2000+', stars: savedHighScore >= 2000 ? 3 : savedHighScore >= 1200 ? 1 : 0, maxStars: 3, unlocked: savedLevel >= 4 || savedHighScore >= 1200, difficulty: 'Medium' },
      { id: 5, name: 'Expert', description: 'Score 5000+', stars: savedHighScore >= 5000 ? 2 : savedHighScore >= 2500 ? 1 : 0, maxStars: 3, unlocked: savedLevel >= 5 || savedHighScore >= 2500, difficulty: 'Hard' },
      { id: 6, name: 'Master', description: 'Score 10000+', stars: 0, maxStars: 3, unlocked: savedLevel >= 6 || savedHighScore >= 10000, difficulty: 'Hard' },
      { id: 7, name: 'Legend', description: 'Score 25000+', stars: 0, maxStars: 3, unlocked: savedLevel >= 7 || savedHighScore >= 25000, difficulty: 'Expert' },
      { id: 8, name: 'Ultimate', description: 'Score 50000+', stars: 0, maxStars: 3, unlocked: savedLevel >= 8 || savedHighScore >= 50000, difficulty: 'Expert' },
    ];

    setLevels(levelData);
  }, [gameSlug]);

  const updateScore = (newScore: number) => {
    setTotalScore((prev) => {
      const updated = prev + newScore;
      localStorage.setItem(`game-score-${gameSlug}`, updated.toString());

      // Check for level up
      let newLevel = currentLevel;
      if (updated >= 50000) newLevel = 8;
      else if (updated >= 25000) newLevel = 7;
      else if (updated >= 10000) newLevel = 6;
      else if (updated >= 5000) newLevel = 5;
      else if (updated >= 2000) newLevel = 4;
      else if (updated >= 1000) newLevel = 3;
      else if (updated >= 500) newLevel = 2;

      if (newLevel > currentLevel) {
        setCurrentLevel(newLevel);
        localStorage.setItem(`game-level-${gameSlug}`, newLevel.toString());
      }

      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem(`game-high-${gameSlug}`, newScore.toString());
      }

      return updated;
    });
  };

  // Expose updateScore to parent components
  useEffect(() => {
    (window as any).__updateGameScore = updateScore;
    return () => { delete (window as any).__updateGameScore; };
  }, [currentLevel, highScore, gameSlug]);

  const currentLevelData = levels.find((l) => l.id === currentLevel);

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Progress
        </h3>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs text-primary-600 hover:text-primary-700"
        >
          {showDetails ? 'Hide' : 'Details'}
        </button>
      </div>

      {/* Current Level */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/20 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Level</span>
          <span className="text-xs font-medium text-primary-600">Level {currentLevel}</span>
        </div>
        <div className="text-2xl font-display font-extrabold text-gray-900 dark:text-white mb-1">
          {currentLevelData?.name || 'Rookie'}
        </div>
        <div className="text-xs text-gray-500">{currentLevelData?.description || 'Keep playing!'}</div>

        {/* XP Bar */}
        <div className="mt-3">
          <div className="flex justify-between text-[10px] text-gray-500 mb-1">
            <span>XP Progress</span>
            <span>{totalScore} pts</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary-500 to-primary-400 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min((totalScore % 1000) / 10, 100)}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-3 text-center">
          <div className="text-xl font-extrabold text-gray-900 dark:text-white">{formatScore(highScore)}</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">Best Score</div>
        </div>
        <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-3 text-center">
          <div className="text-xl font-extrabold text-gray-900 dark:text-white">{formatScore(totalScore)}</div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">Total Score</div>
        </div>
      </div>

      {/* Level Map (expandable) */}
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Level Map</h4>
          <div className="space-y-2">
            {levels.map((level) => (
              <div
                key={level.id}
                className={`flex items-center gap-3 p-2 rounded-lg ${
                  level.unlocked
                    ? 'bg-gray-50 dark:bg-dark-bg'
                    : 'bg-gray-100 dark:bg-gray-800 opacity-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                  level.id === currentLevel
                    ? 'bg-primary-500 text-white'
                    : level.unlocked
                      ? 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-400'
                }`}>
                  {level.unlocked ? level.id : '🔒'}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{level.name}</div>
                  <div className="text-[10px] text-gray-500">{level.description}</div>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(level.maxStars)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < level.stars
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Recent Achievements</h4>
        <div className="flex flex-wrap gap-2">
          {highScore > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-[10px] font-medium">
              🏆 First Play
            </span>
          )}
          {highScore >= 1000 && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-[10px] font-medium">
              ⭐ Century
            </span>
          )}
          {highScore >= 5000 && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-[10px] font-medium">
              👑 High Roller
            </span>
          )}
          {highScore >= 10000 && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-[10px] font-medium">
              🔥 On Fire!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function formatScore(score: number): string {
  if (score >= 1000000) return `${(score / 1000000).toFixed(1)}M`;
  if (score >= 1000) return `${(score / 1000).toFixed(1)}K`;
  return score.toString();
}
