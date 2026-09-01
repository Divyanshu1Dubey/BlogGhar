'use client';

import { useState, useEffect, useCallback } from 'react';

const GRID_SIZE = 15;
const CELL_COUNT = GRID_SIZE * GRID_SIZE;
const MINES = 10;

function createBoard() {
  const board = Array(CELL_COUNT).fill(0);
  let minesPlaced = 0;
  while (minesPlaced < MINES) {
    const pos = Math.floor(Math.random() * CELL_COUNT);
    if (board[pos] !== -1) { board[pos] = -1; minesPlaced++; }
  }
  for (let i = 0; i < CELL_COUNT; i++) {
    if (board[i] === -1) continue;
    let count = 0;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const nx = (i % GRID_SIZE) + dx;
        const ny = Math.floor(i / GRID_SIZE) + dy;
        if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE && board[ny * GRID_SIZE + nx] === -1) count++;
      }
    }
    board[i] = count;
  }
  return board;
}

export default function GameClient({ game, topScores }: { game: any; topScores: any[] }) {
  const [board, setBoard] = useState<number[]>(createBoard);
  const [revealed, setRevealed] = useState<boolean[]>(Array(CELL_COUNT).fill(false));
  const [flagged, setFlagged] = useState<boolean[]>(Array(CELL_COUNT).fill(false));
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [firstClick, setFirstClick] = useState(true);

  useEffect(() => {
    if (gameOver || won) return;
    const timer = setInterval(() => setTime((t: number) => t + 1), 1000);
    return () => clearInterval(timer);
  }, [gameOver, won]);

  const reveal = useCallback((pos: number) => {
    if (revealed[pos] || flagged[pos] || gameOver || won) return;
    if (firstClick) {
      setFirstClick(false);
      if (board[pos] === -1) {
        let nb = createBoard();
        let attempts = 0;
        while (nb[pos] === -1 && attempts < 100) { nb = createBoard(); attempts++; }
        setBoard(nb);
      }
    }
    if (board[pos] === -1) {
      setGameOver(true);
      setRevealed(Array(CELL_COUNT).fill(true));
      return;
    }
    const newRevealed = [...revealed];
    const queue = [pos];
    const toReveal: number[] = [];
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (newRevealed[current] || flagged[current]) continue;
      newRevealed[current] = true;
      toReveal.push(current);
      if (board[current] === 0) {
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const nx = (current % GRID_SIZE) + dx;
            const ny = Math.floor(current / GRID_SIZE) + dy;
            if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE) {
              const np = ny * GRID_SIZE + nx;
              if (!newRevealed[np] && !flagged[np]) queue.push(np);
            }
          }
        }
      }
    }
    setRevealed(newRevealed);
    setScore((s: number) => s + toReveal.length);
    if (newRevealed.filter(Boolean).length === CELL_COUNT - MINES) {
      setWon(true);
      setScore((s: number) => s + 100);
    }
  }, [board, revealed, flagged, gameOver, won, firstClick]);

  const toggleFlag = (e: React.MouseEvent, pos: number) => {
    e.preventDefault();
    if (revealed[pos] || gameOver || won) return;
    setFlagged((f: boolean[]) => { const nf = [...f]; nf[pos] = !nf[pos]; return nf; });
  };

  const reset = () => {
    setBoard(createBoard()); setRevealed(Array(CELL_COUNT).fill(false));
    setFlagged(Array(CELL_COUNT).fill(false)); setGameOver(false); setWon(false);
    setScore(0); setTime(0); setFirstClick(true);
  };

  const getCellColor = (pos: number) => {
    if (!revealed[pos]) return '';
    const num = board[pos];
    if (num === -1) return 'text-red-500';
    const colors = ['', 'text-blue-600', 'text-green-600', 'text-red-600', 'text-purple-600', 'text-yellow-600', 'text-cyan-600', 'text-gray-800', 'text-gray-900'];
    return colors[num] || '';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-6 mb-6 p-4 bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border">
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Score</p><p className="text-2xl font-bold text-primary-600">{score}</p></div>
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Time</p><p className="text-2xl font-bold">{Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}</p></div>
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Flags</p><p className="text-2xl font-bold">{flagged.filter(Boolean).length}/{MINES}</p></div>
        <button onClick={reset} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">🔄 New Game</button>
      </div>
      {(gameOver || won) && (
        <div className={`mb-6 px-6 py-4 rounded-xl text-center ${won ? 'bg-green-100 dark:bg-green-900/30 text-green-700' : 'bg-red-100 dark:bg-red-900/30 text-red-700'}`}>
          <p className="text-xl font-bold font-display">{won ? '🎉 You Won!' : '💥 Game Over!'}</p>
          <p className="text-sm mt-1">Score: {score} | Time: {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}</p>
        </div>
      )}
      <div className="grid gap-0.5 bg-gray-300 dark:bg-dark-border p-2 rounded-xl shadow-lg" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}>
        {Array.from({ length: CELL_COUNT }).map((_, pos) => (
          <button key={pos} onContextMenu={(e) => toggleFlag(e, pos)} onClick={() => reveal(pos)} disabled={revealed[pos] || gameOver}
            className={`w-8 h-8 flex items-center justify-center text-sm font-bold rounded transition-all ${revealed[pos] ? 'bg-gray-200 dark:bg-dark-bg cursor-default' : 'bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 cursor-pointer'} ${getCellColor(pos)} ${gameOver && board[pos] === -1 && !revealed[pos] ? 'bg-red-300 dark:bg-red-900' : ''}`}>
            {revealed[pos] ? (board[pos] === -1 ? '💣' : board[pos] === 0 ? '' : board[pos]) : (flagged[pos] ? '🚩' : '')}
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm text-gray-500">Left-click to reveal • Right-click to flag</p>
      {topScores.length > 0 && (
        <div className="mt-8 w-full max-w-md">
          <h3 className="font-display font-bold text-lg mb-3">🏆 Top Scores</h3>
          <div className="card divide-y divide-gray-100 dark:divide-dark-border">
            {topScores.map((s, idx) => (
              <div key={s.id} className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-500">#{idx + 1}</span>
                  <span className="font-medium text-sm">{s.user?.name || 'Anonymous'}</span>
                </div>
                <span className="font-bold text-primary-600">{s.score}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
