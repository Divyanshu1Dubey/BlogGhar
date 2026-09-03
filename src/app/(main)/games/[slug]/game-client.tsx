'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// ─── Sudoku Generator ───────────────────────────────────────────────────

function generateSudoku(difficulty: 'easy' | 'medium' | 'hard'): { puzzle: number[][], solution: number[][] } {
  const grid: number[][] = Array.from({ length: 9 }, () => Array(9).fill(0));

  function isValid(grid: number[][], row: number, col: number, num: number): boolean {
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] === num || grid[i][col] === num) return false;
      const br = 3 * Math.floor(row / 3) + Math.floor(i / 3);
      const bc = 3 * Math.floor(col / 3) + i % 3;
      if (grid[br][bc] === num) return false;
    }
    return true;
  }

  function solve(grid: number[][]): boolean {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (grid[r][c] === 0) {
          const nums = [1,2,3,4,5,6,7,8,9].sort(() => Math.random() - 0.5);
          for (const n of nums) {
            if (isValid(grid, r, c, n)) {
              grid[r][c] = n;
              if (solve(grid)) return true;
              grid[r][c] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  solve(grid);
  const solution = grid.map(r => [...r]);

  const cells = Array.from({ length: 81 }, (_, i) => i);
  const removeCount = difficulty === 'easy' ? 30 : difficulty === 'medium' ? 40 : 50;
  const toRemove = cells.sort(() => Math.random() - 0.5).slice(0, removeCount);

  const puzzle = solution.map(r => [...r]);
  for (const idx of toRemove) {
    puzzle[Math.floor(idx / 9)][idx % 9] = 0;
  }

  return { puzzle, solution };
}

function SudokuGame({ onGameOver }: { onGameOver?: (score: number) => void }) {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [game, setGame] = useState<{ puzzle: number[][], solution: number[][] } | null>(null);
  const [grid, setGrid] = useState<number[][]>([]);
  const [selected, setSelected] = useState<{ r: number, c: number } | null>(null);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [won, setWon] = useState(false);
  const [timer, setTimer] = useState(0);
  const [hints, setHints] = useState(3);

  const startNewGame = useCallback((diff: 'easy' | 'medium' | 'hard') => {
    const { puzzle, solution } = generateSudoku(diff);
    setGame({ puzzle, solution });
    setGrid(puzzle.map(r => [...r]));
    setSelected(null);
    setErrors(new Set());
    setWon(false);
    setTimer(0);
    setHints(3);
    setDifficulty(diff);
  }, []);

  useEffect(() => { startNewGame(difficulty); }, []);

  useEffect(() => {
    if (won) return;
    const t = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(t);
  }, [won]);

  const selectCell = (r: number, c: number) => {
    if (game && game.puzzle[r][c] !== 0) return;
    setSelected({ r, c });
  };

  const placeNumber = (num: number) => {
    if (!selected || !game || won) return;
    const { r, c } = selected;
    if (game.puzzle[r][c] !== 0) return;
    const newGrid = grid.map(row => [...row]);
    newGrid[r][c] = num;
    const newErrors = new Set(errors);

    if (num !== game.solution[r][c]) {
      newErrors.add(`${r}-${c}`);
    } else {
      newErrors.delete(`${r}-${c}`);
    }

    setGrid(newGrid);
    setErrors(newErrors);

    // Check win
    const isFull = newGrid.every(row => row.every(cell => cell !== 0));
    if (isFull && newErrors.size === 0) {
      setWon(true);
      const diffBonus = difficulty === 'easy' ? 50 : difficulty === 'medium' ? 100 : 200;
      const timeBonus = Math.max(0, 300 - timer);
      onGameOver?.(diffBonus + timeBonus);
    }
  };

  const useHint = () => {
    if (!selected || !game || hints <= 0 || won) return;
    const { r, c } = selected;
    if (grid[r][c] !== 0) return;
    const newGrid = grid.map(row => [...row]);
    newGrid[r][c] = game.solution[r][c];
    setGrid(newGrid);
    setHints(h => h - 1);
    const newErrors = new Set(errors);
    newErrors.delete(`${r}-${c}`);
    setErrors(newErrors);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  if (!game) return <div className="flex items-center justify-center py-20 text-gray-400">Loading...</div>;

  const blockTop = (r: number) => r % 3 === 0 && r > 0;

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-6 mb-4 p-4 bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border">
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Time</p><p className="text-lg font-bold">{formatTime(timer)}</p></div>
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Hints</p><p className="text-lg font-bold text-yellow-600">{hints}</p></div>
        {won && <div className="text-center"><p className="text-xs text-green-600 uppercase font-bold">Solved!</p></div>}
        <button onClick={() => startNewGame(difficulty)} className="px-3 py-1.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">New Game</button>
      </div>

      <div className="flex gap-2 mb-4">
        {(['easy','medium','hard'] as const).map(d => (
          <button key={d} onClick={() => startNewGame(d)} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase ${difficulty === d ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-dark-bg hover:bg-gray-200'}`}>{d}</button>
        ))}
      </div>

      <div className="inline-grid grid-cols-9 gap-0 border-2 border-gray-800 dark:border-gray-300 rounded-lg overflow-hidden shadow-xl mb-4">
        {grid.map((row, r) => row.map((val, c) => {
          const isFixed = game.puzzle[r][c] !== 0;
          const hasError = errors.has(`${r}-${c}`);
          const isSelected = selected?.r === r && selected?.c === c;
          const blockLeft = c % 3 === 0 && c > 0;
          return (
            <button key={`${r}-${c}`} onClick={() => selectCell(r, c)}
              className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-base sm:text-lg font-bold transition-colors
                ${isFixed ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200' : 'bg-white dark:bg-dark-card text-primary-600 hover:bg-primary-50'}
                ${hasError ? '!text-red-500 bg-red-50' : ''}
                ${isSelected ? '!bg-primary-100 dark:!bg-primary-900/40 ring-2 ring-primary-500 z-10' : ''}
                ${blockTop(r) ? 'border-t-2 border-gray-400' : 'border-t border-gray-200'}
                ${blockLeft ? 'border-l-2 border-gray-400' : 'border-l border-gray-200'}
              `}>
              {val !== 0 ? val : ''}
            </button>
          );
        }))}
      </div>

      {!won && selected && (
        <>
          <div className="flex gap-2 mb-4">
            {[1,2,3,4,5,6,7,8,9].map(n => (
              <button key={n} onClick={() => placeNumber(n)} className="w-10 h-10 rounded-lg bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border text-lg font-bold hover:bg-primary-50 hover:border-primary-300 transition-colors">{n}</button>
            ))}
          </div>
          <button onClick={useHint} disabled={hints <= 0} className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-200 disabled:opacity-40">💡 Use Hint ({hints})</button>
        </>
      )}

      {won && (
        <div className="mt-4 px-8 py-4 bg-green-100 dark:bg-green-900/30 text-green-700 rounded-xl text-center">
          <p className="text-2xl font-bold font-display">🎉 Puzzle Solved!</p>
          <p className="text-sm mt-1">Time: {formatTime(timer)} | Difficulty: {difficulty}</p>
        </div>
      )}
    </div>
  );
}

// ─── Snake Game ─────────────────────────────────────────────────────────

function SnakeGame({ onGameOver }: { onGameOver?: (score: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const stateRef = useRef({ snake: [{x:8,y:8}], dir: {x:1,y:0}, nextDir: {x:1,y:0}, food: {x:5,y:5}, speed: 120 });

  const reset = () => {
    const s = stateRef.current;
    s.snake = [{x:8,y:8},{x:7,y:8},{x:6,y:8}];
    s.dir = {x:1,y:0}; s.nextDir = {x:1,y:0};
    s.food = {x: Math.floor(Math.random()*16), y: Math.floor(Math.random()*16)};
    setScore(0); setGameOver(false); setStarted(true);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const s = stateRef.current;
      const keyMap: Record<string,{x:number,y:number}> = { ArrowUp:{x:0,y:-1}, ArrowDown:{x:0,y:1}, ArrowLeft:{x:-1,y:0}, ArrowRight:{x:1,y:0}, w:{x:0,y:-1}, s:{x:0,y:1}, a:{x:-1,y:0}, d:{x:1,y:0} };
      const nd = keyMap[e.key];
      if (nd && !(nd.x === -s.dir.x && nd.y === -s.dir.y)) s.nextDir = nd;
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (!started || gameOver) return;
    const tick = () => {
      const s = stateRef.current;
      s.dir = s.nextDir;
      const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y };
      if (head.x < 0 || head.x >= 16 || head.y < 0 || head.y >= 16 || s.snake.some(seg => seg.x === head.x && seg.y === head.y)) {
        setGameOver(true); setStarted(false);
        if (score > highScore) setHighScore(score);
        onGameOver?.(score);
        return;
      }
      s.snake.unshift(head);
      if (head.x === s.food.x && head.y === s.food.y) {
        setScore(sc => {
          const ns = sc + 10;
          s.food = { x: Math.floor(Math.random()*16), y: Math.floor(Math.random()*16) };
          while (s.snake.some(seg => seg.x === s.food.x && seg.y === s.food.y)) {
            s.food = { x: Math.floor(Math.random()*16), y: Math.floor(Math.random()*16) };
          }
          return ns;
        });
      } else {
        s.snake.pop();
      }
    };
    const iv = setInterval(tick, stateRef.current.speed);
    return () => clearInterval(iv);
  }, [started, gameOver, score, highScore]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const size = 32;
    canvas.width = 16 * size; canvas.height = 16 * size;
    const s = stateRef.current;
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    s.snake.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? '#4ade80' : '#22c55e';
      ctx.fillRect(seg.x * size + 1, seg.y * size + 1, size - 2, size - 2);
    });
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(s.food.x * size + size/2, s.food.y * size + size/2, size/2 - 2, 0, Math.PI * 2); ctx.fill();
  }, [score, gameOver]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-6 mb-4 p-4 bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border">
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Score</p><p className="text-2xl font-bold text-primary-600">{score}</p></div>
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Best</p><p className="text-2xl font-bold text-yellow-600">{highScore}</p></div>
        {!started && !gameOver && <button onClick={reset} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Start Game</button>}
        {gameOver && <button onClick={reset} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Play Again</button>}
      </div>
      <canvas ref={canvasRef} className="rounded-xl shadow-lg" />
      <p className="mt-3 text-sm text-gray-500">Use Arrow Keys or WASD to move</p>
    </div>
  );
}

// ─── 2048 Game ──────────────────────────────────────────────────────────

function Game2048({ onGameOver: _ }: { onGameOver?: (score: number) => void }) {
  const SIZE = 4;
  const initGrid = (): number[][] => Array.from({length: SIZE}, () => Array(SIZE).fill(0));
  const [grid, setGrid] = useState<number[][]>(initGrid());
  const [score, setScore] = useState(0);
  const [won, setWon] = useState(false);
  const [over, setOver] = useState(false);

  const addTile = (g: number[][]): number[][] => {
    const empty: [number,number][] = [];
    g.forEach((r,i) => r.forEach((v,j) => { if(v===0) empty.push([i,j]); }));
    if (empty.length === 0) return g;
    const [r,c] = empty[Math.floor(Math.random() * empty.length)];
    const ng = g.map(row => [...row]);
    ng[r][c] = Math.random() < 0.9 ? 2 : 4;
    return ng;
  };

  const start = () => { let g = addTile(addTile(initGrid())); setGrid(g); setScore(0); setWon(false); setOver(false); };

  useEffect(() => { start(); }, []);

  const slide = (row: number[]): { row: number[], score: number } => {
    let arr = row.filter(v => v !== 0);
    let s = 0;
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i+1]) { arr[i] *= 2; s += arr[i]; arr.splice(i+1, 1); }
    }
    while (arr.length < SIZE) arr.push(0);
    return { row: arr, score: s };
  };

  const move = (dir: 'up'|'down'|'left'|'right') => {
    if (won || over) return;
    let g = grid.map(r => [...r]);
    let totalScore = 0;
    if (dir === 'left') { g.forEach((r,i) => { const res = slide(r); g[i]=res.row; totalScore+=res.score; }); }
    if (dir === 'right') { g.forEach((r,i) => { const res = slide([...r].reverse()); g[i]=res.row.reverse(); totalScore+=res.score; }); }
    if (dir === 'up') { for(let c=0;c<SIZE;c++){ const col=g.map(r=>r[c]); const res=slide(col); for(let r=0;r<SIZE;r++)g[r][c]=res.row[r]; totalScore+=res.score; } }
    if (dir === 'down') { for(let c=0;c<SIZE;c++){ const col=[...g.map(r=>r[c])].reverse(); const res=slide(col); const nr=[...res.row].reverse(); for(let r=0;r<SIZE;r++)g[r][c]=nr[r]; totalScore+=res.score; } }
    if (JSON.stringify(g) !== JSON.stringify(grid)) {
      const ng = addTile(g);
      setGrid(ng); setScore(s => { const ns = s + totalScore; return ns; });
      if (ng.some(r => r.some(v => v >= 2048)) && !won) { setWon(true); }
      const empty = ng.flat().filter(v => v === 0).length;
      if (empty === 0) {
        let canMerge = false;
        for(let r=0;r<SIZE;r++) for(let c=0;c<SIZE;c++) {
          if(c<SIZE-1 && ng[r][c]===ng[r][c+1]) canMerge=true;
          if(r<SIZE-1 && ng[r][c]===ng[r+1][c]) canMerge=true;
        }
        if (!canMerge) setOver(true);
      }
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const map: Record<string,'up'|'down'|'left'|'right'> = { ArrowUp:'up', ArrowDown:'down', ArrowLeft:'left', ArrowRight:'right', w:'up', s:'down', a:'left', d:'right' };
      const d = map[e.key];
      if (d) { e.preventDefault(); move(d); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [grid, won, over]);

  const tileColors: Record<number,string> = { 0:'bg-gray-100 dark:bg-dark-bg', 2:'bg-gray-200 dark:bg-gray-700 text-gray-800', 4:'bg-gray-300 dark:bg-gray-600 text-gray-800', 8:'bg-orange-200 text-gray-800', 16:'bg-orange-300 text-gray-800', 32:'bg-orange-400 text-white', 64:'bg-orange-500 text-white', 128:'bg-yellow-400 text-white', 256:'bg-yellow-500 text-white', 512:'bg-red-400 text-white', 1024:'bg-red-500 text-white', 2048:'bg-green-500 text-white' };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-6 mb-4 p-4 bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border">
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Score</p><p className="text-2xl font-bold text-primary-600">{score}</p></div>
        <button onClick={start} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">New Game</button>
      </div>
      {(won || over) && (
        <div className={`mb-4 px-6 py-3 rounded-xl text-center ${won ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          <p className="text-xl font-bold font-display">{won ? '🎉 You reached 2048!' : '😔 Game Over!'}</p>
          <p className="text-sm">Score: {score}</p>
        </div>
      )}
      <div className="grid grid-cols-4 gap-2 p-3 bg-gray-300 dark:bg-dark-border rounded-xl">
        {grid.flat().map((v, i) => (
          <div key={i} className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-xl sm:text-2xl font-bold rounded-lg transition-all ${tileColors[v] || 'bg-purple-500 text-white'}`}>{v || ''}</div>
        ))}
      </div>
      <p className="mt-3 text-sm text-gray-500">Use Arrow Keys or WASD to slide tiles</p>
    </div>
  );
}

// ─── Tic-Tac-Toe ────────────────────────────────────────────────────────

function TicTacToeGame({ onGameOver }: { onGameOver?: (score: number) => void }) {
  const [board, setBoard] = useState<(string|null)[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<'X'|'O'>('X');
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<string|null>(null);
  const [scores, setScores] = useState({ X: 0, O: 0, draw: 0 });

  const checkWinner = (b: (string|null)[]): string | null => {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (const [a,b2,c] of lines) if (b[a] && b[a]===b[b2] && b[a]===b[c]) return b[a];
    return b.every(c => c !== null) ? 'draw' : null;
  };

  const maxScore = (b: (string|null)[], depth: number, isMax: boolean, ai: string, human: string): number => {
    const result = checkWinner(b);
    if (result === ai) return 10 - depth;
    if (result === human) return depth - 10;
    if (result === 'draw') return 0;
    if (isMax) {
      let best = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (!b[i]) { b[i] = ai; best = Math.max(best, maxScore(b, depth+1, false, ai, human)); b[i] = null; }
      }
      return best;
    } else {
      let best = Infinity;
      for (let i = 0; i < 9; i++) {
        if (!b[i]) { b[i] = human; best = Math.min(best, maxScore(b, depth+1, true, ai, human)); b[i] = null; }
      }
      return best;
    }
  };

  const aiMove = (b: (string|null)[]): number => {
    let best = -Infinity, move = -1;
    for (let i = 0; i < 9; i++) {
      if (!b[i]) {
        b[i] = 'O';
        const val = maxScore(b, 0, false, 'O', 'X');
        b[i] = null;
        if (val > best) { best = val; move = i; }
      }
    }
    return move;
  };

  const handleClick = (i: number) => {
    if (board[i] || gameOver) return;
    const newBoard = [...board];
    newBoard[i] = turn;
    setBoard(newBoard);
    const result = checkWinner(newBoard);
    if (result) {
      setGameOver(true); setWinner(result);
      if (result === 'X') setScores(s => ({...s, X: s.X+1}));
      else if (result === 'O') setScores(s => ({...s, O: s.O+1}));
      else setScores(s => ({...s, draw: s.draw+1}));
      if (result !== 'draw') onGameOver?.(result === 'X' ? 100 : 50);
      return;
    }
    setTurn('O');
    // AI move
    setTimeout(() => {
      const bCopy = [...newBoard];
      const ai = aiMove(bCopy);
      if (ai >= 0) {
        bCopy[ai] = 'O';
        setBoard(bCopy);
        const r2 = checkWinner(bCopy);
        if (r2) {
          setGameOver(true); setWinner(r2);
          if (r2 === 'X') setScores(s => ({...s, X: s.X+1}));
          else if (r2 === 'O') setScores(s => ({...s, O: s.O+1}));
          else setScores(s => ({...s, draw: s.draw+1}));
          if (r2 !== 'draw') onGameOver?.(r2 === 'X' ? 100 : 50);
        } else {
          setTurn('X');
        }
      } else {
        setTurn('X');
      }
    }, 300);
  };

  const reset = () => { setBoard(Array(9).fill(null)); setTurn('X'); setGameOver(false); setWinner(null); };

  const cellColors = (v: string | null) => v === 'X' ? 'text-blue-600' : v === 'O' ? 'text-red-600' : '';

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-6 mb-4 p-4 bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border">
        <div className="text-center"><p className="text-xs text-gray-500">You (X)</p><p className="text-xl font-bold text-blue-600">{scores.X}</p></div>
        <div className="text-center"><p className="text-xs text-gray-500">Draws</p><p className="text-xl font-bold">{scores.draw}</p></div>
        <div className="text-center"><p className="text-xs text-gray-500">CPU (O)</p><p className="text-xl font-bold text-red-600">{scores.O}</p></div>
        <button onClick={reset} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">New Game</button>
      </div>
      {gameOver && (
        <div className="mb-4 px-6 py-3 rounded-xl text-center bg-blue-100 text-blue-700">
          <p className="text-xl font-bold font-display">{winner === 'X' ? '🎉 You Win!' : winner === 'O' ? '🤖 CPU Wins!' : '🤝 Draw!'}</p>
        </div>
      )}
      {!gameOver && <p className="mb-3 text-sm text-gray-500">{turn === 'X' ? 'Your turn (X)' : 'CPU thinking...'}</p>}
      <div className="grid grid-cols-3 gap-2 p-3 bg-gray-300 dark:bg-dark-border rounded-xl">
        {board.map((v, i) => (
          <button key={i} onClick={() => handleClick(i)}
            className={`w-20 h-20 sm:w-24 sm:h-24 bg-white dark:bg-dark-card rounded-lg text-4xl sm:text-5xl font-bold flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm ${cellColors(v)}`}>
            {v || ''}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Memory Cards ───────────────────────────────────────────────────────

const CARD_ICONS = ['🎮','🎯','🎨','🎭','🎪','🎬','🎤','🎸','🎺','🥁','🎹','🎻'];

function MemoryGame({ onGameOver }: { onGameOver?: (score: number) => void }) {
  const [cards, setCards] = useState<{id:number, icon:string, flipped:boolean, matched:boolean}[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [lock, setLock] = useState(false);

  const startGame = () => {
    const icons = CARD_ICONS.slice(0, 8);
    const deck = [...icons, ...icons].map((icon, i) => ({ id: i, icon, flipped: false, matched: false })).sort(() => Math.random() - 0.5);
    setCards(deck); setFlipped([]); setMoves(0); setGameOver(false);
  };

  useEffect(() => { startGame(); }, []);

  const flipCard = (idx: number) => {
    if (lock || cards[idx].flipped || cards[idx].matched || flipped.length >= 2) return;
    const newCards = [...cards]; newCards[idx].flipped = true; setCards(newCards);
    const newFlipped = [...flipped, idx]; setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setLock(true); setMoves(m => m + 1);
      const [a, b] = newFlipped;
      if (cards[a].icon === cards[b].icon) {
        const matched = [...cards]; matched[a].matched = true; matched[b].matched = true; setCards(matched);
        setFlipped([]); setLock(false);
        if (matched.every(c => c.matched)) {
          setGameOver(true);
          const bonus = Math.max(0, 200 - moves * 5);
          onGameOver?.(100 + bonus);
        }
      } else {
        setTimeout(() => {
          const reset = [...cards]; reset[a].flipped = false; reset[b].flipped = false; setCards(reset);
          setFlipped([]); setLock(false);
        }, 800);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-6 mb-4 p-4 bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border">
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Moves</p><p className="text-2xl font-bold text-primary-600">{moves}</p></div>
        <button onClick={startGame} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">New Game</button>
      </div>
      {gameOver && (
        <div className="mb-4 px-6 py-3 rounded-xl text-center bg-green-100 text-green-700">
          <p className="text-xl font-bold font-display">🎉 All Matched!</p>
          <p className="text-sm">Moves: {moves}</p>
        </div>
      )}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {cards.map((card, idx) => (
          <button key={card.id} onClick={() => flipCard(idx)}
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center text-3xl sm:text-4xl font-bold transition-all duration-300 ${card.flipped || card.matched ? 'bg-white dark:bg-dark-card rotate-0 shadow-md' : 'bg-primary-600 text-white rotate-y-180 shadow-lg'} hover:scale-105`}>
            {card.flipped || card.matched ? card.icon : '?'}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Word Scramble ──────────────────────────────────────────────────────

const WORDS: { word: string, hint: string }[] = [
  { word: 'JAVASCRIPT', hint: 'Programming language for the web' },
  { word: 'SUNFLOWER', hint: 'A yellow flower that follows the sun' },
  { word: 'ELEPHANT', hint: 'Largest land animal' },
  { word: 'RAINBOW', hint: 'Appears after rain' },
  { word: 'GUITAR', hint: 'String musical instrument' },
  { word: 'BUTTERFLY', hint: 'Insect with colorful wings' },
  { word: 'MOUNTAIN', hint: 'Large natural elevation' },
  { word: 'DOLPHIN', hint: 'Intelligent sea mammal' },
  { word: 'PYRAMID', hint: 'Ancient Egyptian structure' },
  { word: 'THUNDER', hint: 'Sound after lightning' },
  { word: 'PENGUIN', hint: 'Black and white bird that can\'t fly' },
  { word: 'VOLCANO', hint: 'Mountain that erupts with lava' },
  { word: 'ORCHESTRA', hint: 'Group of musicians playing together' },
  { word: 'TELESCOPE', hint: 'Used to see distant objects' },
  { word: 'CHOCOLATE', hint: 'Sweet brown treat' },
  { word: 'KANGAROO', hint: 'Australian animal with a pouch' },
  { word: 'COMPASS', hint: 'Shows directions' },
  { word: 'ASTRONAUT', hint: 'Travels to space' },
  { word: 'LIGHTHOUSE', hint: 'Tower that guides ships at sea' },
  { word: 'SANDWICH', hint: 'Food between two slices of bread' },
];

function scramble(word: string): string {
  const arr = word.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('');
}

function WordScrambleGame({ onGameOver }: { onGameOver?: (score: number) => void }) {
  const [currentWord, setCurrentWord] = useState<{word: string, hint: string} | null>(null);
  const [scrambled, setScrambled] = useState('');
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [feedback, setFeedback] = useState('');
  const [usedWords, setUsedWords] = useState<number[]>([]);

  const nextWord = () => {
    let idx: number;
    do { idx = Math.floor(Math.random() * WORDS.length); } while (usedWords.includes(idx) && usedWords.length < WORDS.length);
    const w = WORDS[idx];
    let s = scramble(w.word);
    while (s === w.word) s = scramble(w.word);
    setCurrentWord({ word: w.word, hint: w.hint });
    setScrambled(s);
    setInput('');
    setFeedback('');
    setUsedWords(prev => [...prev, idx]);
  };

  useEffect(() => { nextWord(); }, []);

  const check = () => {
    if (!currentWord) return;
    if (input.trim().toUpperCase() === currentWord.word) {
      setScore(s => s + 10 + currentWord.word.length);
      setFeedback('correct');
      if (usedWords.length >= 9) {
        setFeedback(`Game Over! Score: ${score + 10 + currentWord.word.length}`);
        onGameOver?.(score + 10 + currentWord.word.length);
      } else {
        setRound(r => r + 1);
        setTimeout(nextWord, 600);
      }
    } else {
      setFeedback('wrong');
    }
  };

  return (
    <div className="flex flex-col items-center max-w-md mx-auto">
      <div className="flex items-center gap-6 mb-4 p-4 bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border">
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Score</p><p className="text-2xl font-bold text-primary-600">{score}</p></div>
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Round</p><p className="text-2xl font-bold">{round}/10</p></div>
        <button onClick={nextWord} className="px-3 py-1.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700">Skip</button>
      </div>
      {currentWord && (
        <>
          <div className="card p-8 mb-6 text-center w-full">
            <p className="text-sm text-gray-500 mb-2">Hint: {currentWord.hint}</p>
            <p className="text-3xl font-bold font-display tracking-widest text-primary-600 mb-6">{scrambled}</p>
            <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && check()}
              placeholder="Type your answer..." autoFocus
              className="w-full px-4 py-3 text-center text-lg border-2 border-gray-200 dark:border-dark-border rounded-xl dark:bg-dark-bg focus:outline-none focus:border-primary-500 mb-4" />
            <button onClick={check} className="btn-primary px-8">Submit</button>
            {feedback === 'correct' && <p className="text-green-600 font-medium mt-3">🎉 Correct!</p>}
            {feedback === 'wrong' && <p className="text-red-500 font-medium mt-3">❌ Try again!</p>}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Hangman ────────────────────────────────────────────────────────────

const HANGMAN_WORDS = ['PROGRAMMING','KEYBOARD','MONITOR','DATABASE','ALGORITHM','FUNCTION','VARIABLE','BROWSER','NETWORK','SECURITY','INTERFACE','COMPONENT','FRAMEWORK','PLATFORM','SYSTEM','LANGUAGE','DEBUGGER','SIGNATURE','PACKAGE','CONTAINER','MIDDLEWARE','TEMPLATE','SCHEMA','QUERY','RENDER','COMPILE','DEPLOY','VERSION','REPOSITORY','TERMINAL'];

function HangmanGame({ onGameOver }: { onGameOver?: (score: number) => void }) {
  const [word, setWord] = useState(''); const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0); const [gameOver, setGameOver] = useState(false); const [won, setWon] = useState(false); const [round, setRound] = useState(1);

  const startRound = () => {
    const w = HANGMAN_WORDS[Math.floor(Math.random() * HANGMAN_WORDS.length)];
    setWord(w); setGuessed(new Set()); setGameOver(false); setWon(false);
  };

  useEffect(() => { startRound(); }, []);

  const guess = (letter: string) => {
    if (guessed.has(letter) || gameOver) return;
    const newGuessed = new Set(guessed);
    newGuessed.add(letter);
    setGuessed(newGuessed);
    if (!word.includes(letter)) {
      const wrongCount = Array.from(newGuessed).filter(l => !word.includes(l)).length;
      if (wrongCount >= 6) {
        setGameOver(true);
        onGameOver?.(score);
      }
    } else {
      const revealed = word.split('').every(l => newGuessed.has(l));
      if (revealed) {
        setWon(true); setGameOver(true);
        const roundScore = word.length * 10;
        setScore(s => {
          const ns = s + roundScore;
          if (round >= 5) { onGameOver?.(ns); }
          else { setRound(r => r + 1); setTimeout(startRound, 1500); }
          return ns;
        });
      }
    }
  };

  const wrongCount = Array.from(guessed).filter(l => !word.includes(l)).length;
  const stages = [
    '', '  O', '  O\n  |', '  O\n /|', '  O\n /|\\', '  O\n /|\\\n /', '  O\n /|\\\n / \\',
  ];
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-6 mb-4 p-4 bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border">
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Score</p><p className="text-2xl font-bold text-primary-600">{score}</p></div>
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Round</p><p className="text-2xl font-bold">{round}/5</p></div>
      </div>
      <div className="card p-6 mb-6 text-center">
        <pre className="text-2xl font-mono text-gray-700 dark:text-gray-300 mb-4 whitespace-pre leading-tight">{stages[wrongCount]}</pre>
        {gameOver ? (
          <div>
            <p className="text-2xl font-bold font-display mb-2">{won ? '🎉 You Won!' : '😵 Game Over!'}</p>
            {!won && <p className="text-sm text-gray-500">The word was: <span className="font-bold">{word}</span></p>}
            {round < 5 && !won && <button onClick={startRound} className="mt-3 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm">Next Round</button>}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {word.split('').map((l, i) => (
              <span key={i} className="w-8 h-10 border-b-4 border-primary-500 flex items-center justify-center text-xl font-bold">{guessed.has(l) ? l : ''}</span>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-wrap justify-center gap-1.5 max-w-lg">
        {alphabet.split('').map(l => (
          <button key={l} onClick={() => guess(l)} disabled={guessed.has(l)}
            className={`w-8 h-8 rounded text-sm font-bold transition-colors ${guessed.has(l) ? (word && !word.includes(l) ? 'bg-red-200 text-red-400' : 'bg-green-200 text-green-600') : 'bg-gray-100 dark:bg-dark-bg hover:bg-primary-100'}`}>
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Typing Speed Test ──────────────────────────────────────────────────

const TYPING_TEXTS = [
  "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump!",
  "Technology is best when it brings people together. The advance of technology is based on making it fit in so that you don't really even notice it.",
  "Programming is the art of telling another human being what one wants the computer to do. Good code is its own best documentation.",
  "Success is not final, failure is not fatal. It is the courage to continue that counts. The only way to do great work is to love what you do.",
  "In the middle of difficulty lies opportunity. Life is what happens when you're busy making other plans. The best way to predict the future is to invent it.",
];

function TypingGame({ onGameOver }: { onGameOver?: (score: number) => void }) {
  const [text] = useState(() => TYPING_TEXTS[Math.floor(Math.random() * TYPING_TEXTS.length)]);
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);
    if (!startTime && val.length === 1) setStartTime(Date.now());
    if (val.length === text.length) {
      setFinished(true);
      const time = startTime ? (Date.now() - startTime) / 1000 / 60 : 1;
      const words = val.trim().split(/\s+/).length;
      const w = Math.round(words / time);
      const correct = val.split('').filter((c: string, i: number) => c === text[i]).length;
      const acc = Math.round((correct / text.length) * 100);
      setWpm(w); setAccuracy(acc);
      onGameOver?.(w);
    }
  };

  const getCharClass = (i: number) => {
    if (i >= input.length) return 'text-gray-400';
    return input[i] === text[i] ? 'text-green-600' : 'text-red-500 bg-red-50';
  };

  const reset = () => { setInput(''); setStartTime(null); setFinished(false); setWpm(0); };

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto">
      <div className="flex items-center gap-6 mb-4 p-4 bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border">
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">WPM</p><p className="text-2xl font-bold text-primary-600">{finished ? wpm : '--'}</p></div>
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Accuracy</p><p className="text-2xl font-bold text-green-600">{finished ? `${accuracy}%` : '--'}</p></div>
        <button onClick={reset} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Try Again</button>
      </div>
      <div className="card p-8 mb-6 w-full">
        <div className="text-lg sm:text-xl leading-relaxed font-mono mb-6 select-none">
          {text.split('').map((c, i) => (
            <span key={i} className={getCharClass(i)}>{c}</span>
          ))}
        </div>
        {!finished ? (
          <input type="text" value={input} onChange={handleChange} autoFocus placeholder="Start typing here..." className="w-full px-4 py-3 border-2 border-gray-200 dark:border-dark-border rounded-xl dark:bg-dark-bg focus:outline-none focus:border-primary-500 text-lg font-mono" />
        ) : (
          <div className="text-center">
            <p className="text-2xl font-bold font-display text-green-600">🎉 Completed!</p>
            <p className="text-gray-600 mt-2">{wpm} WPM • {accuracy}% accuracy</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Crossword ──────────────────────────────────────────────────────────

interface CrosswordCell { char: string; number: number; across: { clue: string; answer: string; cells: number[] }; down: { clue: string; answer: string; cells: number[] } }

function CrosswordGame({ onGameOver: _onGameOver }: { onGameOver?: (score: number) => void }) {
  const grid: (CrosswordCell | null)[][] = Array.from({length: 10}, () => Array(8).fill(null));
  const layout: (number | null)[][] = [
    [1,0,0,2,0,0,3,0],
    [0,0,0,0,0,0,0,0],
    [0,4,0,0,5,0,0,0],
    [0,0,0,0,0,0,6,0],
    [7,0,0,0,0,0,0,0],
    [0,0,8,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,9,0,0,10,0,0,11],
    [0,0,0,0,0,0,0,0],
    [0,12,0,0,0,0,0,0],
  ];

  const answers: Record<number, { across?: string; down?: string; clue: { across?: string; down?: string } }> = {
    1: { across: 'REACT', clue: { across: 'Popular JS library for building UIs' }, down: 'RAIN' },
    2: { across: 'CODING', clue: { across: 'Writing instructions for computers' }, down: 'DRESS' },
    3: { across: 'CLOUD', clue: { across: 'Remote computing service' }, down: 'OCEAN' },
    4: { down: 'BROWSER', clue: { down: 'Software to surf the web' }, across: 'BUTTON' },
    5: { down: 'SERVER', clue: { down: 'Computer that serves data to clients' }, across: 'CODEX' },
    6: { across: 'MOUSE', clue: { across: 'Computer pointing device' }, down: 'INPUT' },
    7: { across: 'KERNEL', clue: { across: 'Core of an operating system' }, down: 'QUEEN' },
    8: { across: 'HASH', clue: { across: 'Fixed-size output from a function' }, down: 'API' },
    9: { down: 'BANDWIDTH', clue: { down: 'Data transfer capacity' }, across: 'STACK' },
    10: { across: 'SHELL', clue: { across: 'Command line interface' }, down: 'CODES' },
    11: { across: 'NODE', clue: { across: 'JavaScript runtime environment' }, down: '' },
    12: { across: 'FULLSTACK', clue: { across: 'Developer who works on both ends' }, down: '' },
  };

  // Build the grid
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 8; c++) {
      const num = layout[r][c];
      if (num !== null && answers[num]) {
        const cell: CrosswordCell = {
          char: '',
          number: num,
          across: { clue: answers[num].clue.across || '', answer: answers[num].across || '', cells: [] },
          down: { clue: answers[num].clue.down || '', answer: answers[num].down || '', cells: [] },
        };
        grid[r][c] = cell;
      } else if (num === null) {
        grid[r][c] = null; // black cell
      }
    }
  }

  const buildWord = (dir: 'across' | 'down', r: number, c: number): { clue: string; answer: string; cells: [number, number][] } | null => {
    const num = layout[r][c]!;
    const ans = answers[num];
    if (!ans || !ans[dir]) return null;
    const clue = ans.clue[dir] || '';
    const answer = ans[dir] || '';
    const cells: [number, number][] = [];
    for (let i = 0; i < answer.length; i++) {
      const nr = dir === 'across' ? r : r + i;
      const nc = dir === 'across' ? c + i : c;
      if (nr < 10 && nc < 8 && grid[nr][nc]) cells.push([nr, nc]);
    }
    return { clue, answer, cells };
  };

  const acrossClues: { num: number; clue: string; r: number; c: number; len: number }[] = [];
  const downClues: { num: number; clue: string; r: number; c: number; len: number }[] = [];
  for (let r = 0; r < 10; r++) for (let c = 0; c < 8; c++) {
    if (layout[r][c] === null) continue;
    const ac = buildWord('across', r, c);
    const dc = buildWord('down', r, c);
    if (ac) acrossClues.push({ num: layout[r][c]!, clue: ac.clue, r, c, len: ac.answer.length });
    if (dc) downClues.push({ num: layout[r][c]!, clue: dc.clue, r, c, len: dc.answer.length });
  };

  const uniqueAcross = acrossClues.filter((item, i, self) => self.findIndex(x => x.num === item.num) === i);
  const uniqueDown = downClues.filter((item, i, self) => self.findIndex(x => x.num === item.num) === i);

  const [userInput, setUserInput] = useState<Record<string, string>>({});
  const [selectedCell, setSelectedCell] = useState<{r: number, c: number} | null>(null);

  const cellKey = (r: number, c: number) => `${r}-${c}`;

  const handleCell = (r: number, c: number) => {
    if (layout[r][c] === null) return;
    setSelectedCell({r, c});
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (!selectedCell) return;
    const key = e.key;
    if (key === 'ArrowRight') { setSelectedCell(s => s ? {r: s.r, c: Math.min(7, s.c + 1)} : null); e.preventDefault(); }
    else if (key === 'ArrowLeft') { setSelectedCell(s => s ? {r: s.r, c: Math.max(0, s.c - 1)} : null); e.preventDefault(); }
    else if (key === 'ArrowDown') { setSelectedCell(s => s ? {r: Math.min(9, s.r + 1), c: s.c} : null); e.preventDefault(); }
    else if (key === 'ArrowUp') { setSelectedCell(s => s ? {r: Math.max(0, s.r - 1), c: s.c} : null); e.preventDefault(); }
    else if (key.length === 1 && /[A-Za-z]/.test(key) && layout[selectedCell.r]?.[selectedCell.c] !== null) {
      setUserInput(prev => ({...prev, [cellKey(selectedCell.r, selectedCell.c)]: key.toUpperCase()}));
      // Move to next cell
      setSelectedCell(s => s ? {r: s.r, c: Math.min(7, s.c + 1)} : null);
    } else if (key === 'Backspace') {
      setUserInput(prev => {
        const updated = {...prev}; delete updated[cellKey(selectedCell.r, selectedCell.c)]; return updated;
      });
      setSelectedCell(s => s ? {r: s.r, c: Math.max(0, s.c - 1)} : null);
    }
  };

  const isSelected = (r: number, c: number) => selectedCell?.r === r && selectedCell?.c === c;

  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto">
      <div className="flex items-center gap-6 mb-4 p-4 bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border">
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Words</p><p className="text-2xl font-bold text-primary-600">12</p></div>
        <button onClick={() => { setUserInput({}); setSelectedCell(null); }} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Clear</button>
      </div>
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Grid */}
        <div onKeyDown={handleKey} tabIndex={0} className="focus:outline-none">
          <div className="inline-grid gap-0 border-2 border-gray-800 rounded-lg overflow-hidden shadow-lg" style={{gridTemplateColumns: 'repeat(8, minmax(0, 1fr))'}}>
            {layout.map((row, r) => row.map((num, c) => {
              const isBlack = num === null;
              const val = userInput[cellKey(r, c)] || '';
              const selected = isSelected(r, c);
              return (
                <div key={`${r}-${c}`} onClick={() => handleCell(r, c)}
                  className={`w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center text-sm sm:text-base font-bold cursor-pointer transition-colors relative
                    ${isBlack ? 'bg-gray-800' : selected ? 'bg-yellow-200 dark:bg-yellow-600' : 'bg-white dark:bg-dark-card hover:bg-gray-50'}
                  `}>
                  {!isBlack && num > 0 && <span className="absolute top-0.5 left-1 text-[8px] text-gray-400 font-normal">{num}</span>}
                  {!isBlack && val}
                </div>
              );
            }))}
          </div>
        </div>
        {/* Clues */}
        <div className="flex-1 min-w-[200px]">
          <h4 className="font-display font-bold text-sm text-gray-600 mb-2 uppercase tracking-wider">Across</h4>
          <ul className="text-sm mb-4 space-y-1">
            {uniqueAcross.map(c => (
              <li key={`a-${c.num}`} className="flex gap-2"><span className="font-bold text-gray-500 w-5">{c.num}.</span><span className="text-gray-600 dark:text-gray-400">{c.clue} <span className="text-gray-400">({c.len})</span></span></li>
            ))}
          </ul>
          <h4 className="font-display font-bold text-sm text-gray-600 mb-2 uppercase tracking-wider">Down</h4>
          <ul className="text-sm space-y-1">
            {uniqueDown.map(c => (
              <li key={`d-${c.num}`} className="flex gap-2"><span className="font-bold text-gray-500 w-5">{c.num}.</span><span className="text-gray-600 dark:text-gray-400">{c.clue} <span className="text-gray-400">({c.len})</span></span></li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-3 text-sm text-gray-500">Click a cell and type letters • Arrow keys to navigate</p>
    </div>
  );
}

// ─── Trivia Quiz ────────────────────────────────────────────────────────

const QUESTIONS = [
  { q: 'What is the capital of France?', options: ['Paris','London','Berlin','Madrid'], answer: 0 },
  { q: 'Which planet is known as the Red Planet?', options: ['Venus','Mars','Jupiter','Saturn'], answer: 1 },
  { q: 'What is 7 × 8?', options: ['54','56','63','48'], answer: 1 },
  { q: 'Who painted the Mona Lisa?', options: ['Michelangelo','Da Vinci','Raphael','Donatello'], answer: 1 },
  { q: 'What is the largest ocean?', options: ['Atlantic','Indian','Arctic','Pacific'], answer: 3 },
  { q: 'How many continents are there?', options: ['5','6','7','8'], answer: 2 },
  { q: 'What gas do plants absorb from the atmosphere?', options: ['Oxygen','Nitrogen','Carbon Dioxide','Hydrogen'], answer: 2 },
  { q: 'Which element has the chemical symbol "Au"?', options: ['Silver','Aluminum','Gold','Argon'], answer: 2 },
  { q: 'What year did World War II end?', options: ['1943','1944','1945','1946'], answer: 2 },
  { q: 'Which is the longest river?', options: ['Amazon','Nile','Yangtze','Mississippi'], answer: 1 },
  { q: 'How many bones in the adult human body?', options: ['186','196','206','216'], answer: 2 },
  { q: 'What is the smallest country?', options: ['Monaco','Vatican','Liechtenstein','San Marino'], answer: 1 },
  { q: 'Which language has the most native speakers?', options: ['English','Spanish','Mandarin','Hindi'], answer: 2 },
  { q: 'What is the speed of light (km/s)?', options: ['150,000','300,000','450,000','600,000'], answer: 1 },
  { q: 'Which animal is the fastest?', options: ['Cheetah','Peregrine Falcon','Sailfish','Pronghorn'], answer: 1 },
];

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function TriviaGame({ onGameOver }: { onGameOver?: (score: number) => void }) {
  const [questions, setQuestions] = useState(() => shuffleArray(QUESTIONS).slice(0, 10));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameOver, setGameOver] = useState(false);

  const q = questions[idx];

  useEffect(() => {
    if (answered || gameOver) return;
    const t = setInterval(() => { setTimeLeft(t => { if (t <= 1) { clearInterval(t); handleAnswer(-1); return 0; } return t - 1; }) }, 1000);
    return () => clearInterval(t);
  }, [idx, answered, gameOver]);

  const handleAnswer = (opt: number) => {
    if (answered) return;
    setAnswered(true);
    setSelected(opt);
    if (opt === q.answer) {
      setScore(s => s + (timeLeft * 10));
    }
    setTimeout(() => {
      if (idx + 1 >= questions.length) {
        setGameOver(true);
        onGameOver?.(score + (opt === q.answer ? timeLeft * 10 : 0));
      } else {
        setIdx(i => i + 1); setAnswered(false); setSelected(null); setTimeLeft(15);
      }
    }, 1200);
  };

  const restart = () => {
    setQuestions(shuffleArray(QUESTIONS).slice(0, 10)); setIdx(0); setScore(0); setSelected(null); setAnswered(false); setTimeLeft(15); setGameOver(false);
  };

  return (
    <div className="flex flex-col items-center max-w-lg mx-auto">
      <div className="flex items-center gap-6 mb-4 p-4 bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border">
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Score</p><p className="text-2xl font-bold text-primary-600">{score}</p></div>
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Question</p><p className="text-2xl font-bold">{idx + 1}/{questions.length}</p></div>
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Time</p><p className={`text-2xl font-bold ${timeLeft <= 5 ? 'text-red-500' : 'text-yellow-600'}`}>{timeLeft}s</p></div>
      </div>
      <div className="card p-8 w-full">
        <h3 className="text-lg font-display font-bold mb-6 text-center">{q.q}</h3>
        <div className="space-y-3">
          {q.options.map((opt, i) => {
            let cls = 'border-gray-200 dark:border-dark-border hover:border-primary-300 hover:bg-primary-50';
            if (answered) {
              if (i === q.answer) cls = 'border-green-500 bg-green-50 dark:bg-green-900/20';
              else if (i === selected && i !== q.answer) cls = 'border-red-500 bg-red-50 dark:bg-red-900/20';
              else cls = 'opacity-40';
            }
            return (
              <button key={i} onClick={() => handleAnswer(i)} disabled={answered}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 font-medium transition-all ${cls}`}>
                {['A','B','C','D'][i]}. {opt}
              </button>
            );
          })}
        </div>
      </div>
      {gameOver && (
        <div className="mt-6 px-8 py-4 bg-green-100 dark:bg-green-900/30 text-green-700 rounded-xl text-center">
          <p className="text-2xl font-bold font-display">🎉 Quiz Complete!</p>
          <p className="text-lg mt-1">Score: {score}</p>
          <button onClick={restart} className="mt-3 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium">Play Again</button>
        </div>
      )}
    </div>
  );
}

// ─── Math Challenge ─────────────────────────────────────────────────────

function MathGame({ onGameOver }: { onGameOver?: (score: number) => void }) {
  const [question, setQuestion] = useState<{expr: string, answer: number}>({expr: '', answer: 0});
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(30);
  const [feedback, setFeedback] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [streak, setStreak] = useState(0);

  const generate = () => {
    const ops: Array<{op: string, fn: (a:number,b:number)=>number}> = [
      {op:'+', fn:(a,b)=>a+b}, {op:'-', fn:(a,b)=>a-b}, {op:'×', fn:(a,b)=>a*b}, {op:'÷', fn:(a,b)=>b!==0?Math.round(a/b*10)/10:0}
    ];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a = Math.floor(Math.random() * 20) + 1;
    let b = Math.floor(Math.random() * 20) + 1;
    if (op.op === '-' && a < b) [a, b] = [b, a];
    if (op.op === '÷') { a = b * (Math.floor(Math.random() * 10) + 2); }
    const ans = Math.round(op.fn(a, b) * 100) / 100;
    setQuestion({ expr: `${a} ${op.op} ${b} = ?`, answer: ans });
    setInput(''); setFeedback('');
  };

  useEffect(() => { generate(); }, []);

  useEffect(() => {
    if (gameOver) return;
    const t = setInterval(() => { setTimeLeft(t => { if (t <= 1) { clearInterval(t); endGame(); return 0; } return t - 1; }) }, 1000);
    return () => clearInterval(t);
  }, [gameOver]);

  const endGame = () => { setGameOver(true); onGameOver?.(score); };

  const check = () => {
    if (feedback) return;
    const val = parseFloat(input);
    if (Math.abs(val - question.answer) < 0.01) {
      const bonus = Math.max(1, Math.floor(timeLeft / 3));
      setScore(s => { const ns = s + 10 + bonus; return ns; });
      setStreak(st => { const ns = st + 1; if (ns % 5 === 0) setTimeLeft(t => t + 10); return ns; });
      setFeedback('correct');
      setTimeout(() => { if (round >= 20) endGame(); else { setRound(r => r + 1); setTimeLeft(30); generate(); } }, 500);
    } else {
      setStreak(0); setFeedback('wrong');
    }
  };

  return (
    <div className="flex flex-col items-center max-w-md mx-auto">
      <div className="flex items-center gap-6 mb-4 p-4 bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border">
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Score</p><p className="text-2xl font-bold text-primary-600">{score}</p></div>
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Round</p><p className="text-2xl font-bold">{round}/20</p></div>
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Streak</p><p className="text-2xl font-bold text-yellow-600">{streak}🔥</p></div>
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Time</p><p className={`text-2xl font-bold ${timeLeft <= 5 ? 'text-red-500' : 'text-yellow-600'}`}>{timeLeft}s</p></div>
      </div>
      {!gameOver ? (
        <div className="card p-8 w-full text-center">
          <p className="text-4xl font-bold font-display mb-6">{question.expr}</p>
          <input type="number" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && check()} autoFocus step="any"
            className="w-full px-4 py-3 text-center text-2xl border-2 border-gray-200 dark:border-dark-border rounded-xl dark:bg-dark-bg focus:outline-none focus:border-primary-500 mb-4" />
          <button onClick={check} className="btn-primary px-8">Answer</button>
          {feedback === 'correct' && <p className="text-green-600 font-medium mt-3">✅ Correct! +{10 + Math.max(1, Math.floor(timeLeft / 3))}</p>}
          {feedback === 'wrong' && <p className="text-red-500 font-medium mt-3">❌ Wrong! Answer: {question.answer}</p>}
        </div>
      ) : (
        <div className="card p-8 w-full text-center">
          <p className="text-3xl font-bold font-display text-green-600 mb-2">🎯 Time&apos;s Up!</p>
          <p className="text-xl text-gray-600 mb-1">Final Score: {score}</p>
          <p className="text-gray-500">Best Streak: {streak}</p>
          <button onClick={() => { setScore(0); setRound(1); setTimeLeft(30); setStreak(0); setGameOver(false); generate(); }} className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg font-medium">Play Again</button>
        </div>
      )}
    </div>
  );
}

// ─── Main Game Router ───────────────────────────────────────────────────

export default function GameClient({ topScores, game }: { topScores: any[]; game: any }) {
  const [score, setScore] = useState(0);

  const handleGameOver = (s: number) => {
    setScore(s);
    // Submit score via API
    const gameId = window.location.pathname.split('/').pop();
    if (gameId) {
      fetch('/api/games/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, score: s }),
      }).catch(() => {});
    }
  };

  const renderGame = () => {
    const slug = game.slug;
    switch (slug) {
      case 'sudoku': return <SudokuGame onGameOver={handleGameOver} />;
      case 'snake': return <SnakeGame onGameOver={handleGameOver} />;
      case '2048': return <Game2048 onGameOver={handleGameOver} />;
      case 'tic-tac-toe': return <TicTacToeGame onGameOver={handleGameOver} />;
      case 'memory-cards': return <MemoryGame onGameOver={handleGameOver} />;
      case 'word-scramble': return <WordScrambleGame onGameOver={handleGameOver} />;
      case 'hangman': return <HangmanGame onGameOver={handleGameOver} />;
      case 'typing-speed': return <TypingGame onGameOver={handleGameOver} />;
      case 'crossword': return <CrosswordGame onGameOver={handleGameOver} />;
      case 'trivia': return <TriviaGame onGameOver={handleGameOver} />;
      case 'math-challenge': return <MathGame onGameOver={handleGameOver} />;
      case 'flappy-bird': return <FlappyBirdGame onGameOver={handleGameOver} />;
      case 'breakout': return <BreakoutGame onGameOver={handleGameOver} />;
      case 'memory-sequence': return <MemorySequenceGame onGameOver={handleGameOver} />;
      case 'color-match': return <ColorMatchGame onGameOver={handleGameOver} />;
      case 'number-chain': return <NumberChainGame onGameOver={handleGameOver} />;
      case 'rock-paper-scissors': return <RockPaperScissorsGame onGameOver={handleGameOver} />;
      case 'wordle': return <WordleGame onGameOver={handleGameOver} />;
      case 'whack-a-mole': return <WhackAMoleGame onGameOver={handleGameOver} />;
      case 'minesweeper': return <MinesweeperGame onGameOver={handleGameOver} />;
      case 'tetris': return <TetrisGame onGameOver={handleGameOver} />;
      case 'speed-math': return <SpeedMathGame onGameOver={handleGameOver} />;
      case 'emoji-match': return <EmojiMatchGame onGameOver={handleGameOver} />;
      case 'bubble-shooter': return <BubbleShooterGame onGameOver={handleGameOver} />;
      case 'dino-run': return <DinoRunGame onGameOver={handleGameOver} />;
      case 'blackjack': return <BlackjackGame onGameOver={handleGameOver} />;
      default: return <ComingSoonGame slug={slug} />;
    }
  };

  return (
    <div className="flex flex-col items-center py-4">
      {renderGame()}
      {score > 0 && (
        <div className="mt-6 px-6 py-3 bg-green-100 dark:bg-green-900/30 text-green-700 rounded-xl text-center">
          <p className="font-medium">🏆 Game Over! Score: {score}</p>
        </div>
      )}
      {topScores.length > 0 && (
        <div className="mt-8 w-full max-w-md">
          <h3 className="font-display font-bold text-lg mb-3">🏆 Top Scores</h3>
          <div className="card divide-y divide-gray-100 dark:divide-dark-border">
            {topScores.map((s, idx) => (
              <div key={s.id} className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-500">#{idx + 1}</span>
                  {s.user?.image && <img src={s.user.image} alt="" className="w-6 h-6 rounded-full" />}
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

function ComingSoonGame({ slug }: { slug: string }) {
  const name = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return (
    <div className="text-center py-16">
      <p className="text-6xl mb-4">🚧</p>
      <h3 className="text-xl font-display font-bold mb-2">{name}</h3>
      <p className="text-gray-500">This game is coming soon!</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// NEW GAMES
// ═══════════════════════════════════════════════════════════════════════

// ─── Flappy Bird ────────────────────────────────────────────────────────

function FlappyBirdGame({ onGameOver }: { onGameOver?: (score: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => parseInt(localStorage.getItem('flappy-best') || '0'));
  const [state, setState] = useState<'idle' | 'playing' | 'dead'>('idle');

  const stateRef = useRef({ bird: { x: 80, y: 200, vy: 0 }, pipes: [] as {x:number,topH:number,gap:number,scored:boolean}[], frame: 0, dead: false });

  const reset = () => {
    stateRef.current = { bird: { x: 80, y: 200, vy: 0 }, pipes: [], frame: 0, dead: false };
    setScore(0); setState('playing');
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.code === 'Space' || e.key === 'ArrowUp') { e.preventDefault(); flap(); } };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const flap = () => {
    if (state === 'idle') { reset(); return; }
    if (state === 'dead') { reset(); return; }
    stateRef.current.bird.vy = -6;
  };

  useEffect(() => {
    if (state !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = 320; canvas.height = 480;

    const tick = () => {
      const s = stateRef.current;
      if (s.dead) return;
      s.frame++;

      // Bird physics
      s.bird.vy += 0.35;
      s.bird.y += s.bird.vy;

      // Pipes
      if (s.frame % 90 === 0) {
        const gap = 140;
        const topH = Math.random() * (canvas.height - gap - 80) + 40;
        s.pipes.push({ x: canvas.width, topH, gap, scored: false });
      }
      s.pipes.forEach(p => p.x -= 2);
      if (s.pipes.length && s.pipes[0].x < -60) s.pipes.shift();

      // Score
      s.pipes.forEach(p => {
        if (!p.scored && p.x + 30 < s.bird.x) { p.scored = true; const ns = score + 1; setScore(ns); }
      });

      // Collision
      const bx = s.bird.x, by = s.bird.y, br = 12;
      if (by + br >= canvas.height || by - br <= 0) { die(); return; }
      for (const p of s.pipes) {
        if (bx + br > p.x && bx - br < p.x + 50) {
          if (by - br < p.topH || by + br > p.topH + p.gap) { die(); return; }
        }
      }

      draw(ctx, canvas, s);
      requestAnimationFrame(tick);
    };
    tick();
  }, [state, score]);

  const die = () => {
    stateRef.current.dead = true;
    setState('dead');
    if (score > best) { setBest(score); localStorage.setItem('flappy-best', String(score)); }
    onGameOver?.(score);
  };

  const draw = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, s: typeof stateRef.current) => {
    ctx.fillStyle = '#87CEEB'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Clouds
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    [[40,60],[180,40],[260,80]].forEach(([cx,cy]) => { ctx.beginPath(); ctx.arc(cx,cy,20,0,Math.PI*2); ctx.arc(cx+20,cy,25,0,Math.PI*2); ctx.arc(cx+40,cy,20,0,Math.PI*2); ctx.fill(); });
    // Pipes
    s.pipes.forEach(p => {
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(p.x, 0, 50, p.topH);
      ctx.fillStyle = '#16a34a';
      ctx.fillRect(p.x + 3, 0, 8, p.topH);
      ctx.fillRect(p.x, p.topH - 15, 50, 15);
      ctx.fillRect(p.x, p.topH + p.gap, 50, canvas.height - p.topH - p.gap);
      ctx.fillStyle = '#16a34a';
      ctx.fillRect(p.x + 3, p.topH + p.gap, 8, canvas.height - p.topH - p.gap);
      ctx.fillRect(p.x, p.topH + p.gap, 50, 15);
    });
    // Bird
    const birdY = s.bird.y;
    ctx.fillStyle = '#facc15';
    ctx.beginPath(); ctx.arc(s.bird.x, birdY, 12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath(); ctx.arc(s.bird.x + 6, birdY - 2, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc(s.bird.x + 4, birdY - 4, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.moveTo(s.bird.x + 12, birdY); ctx.lineTo(s.bird.x + 22, birdY + 3); ctx.lineTo(s.bird.x + 12, birdY + 6); ctx.fill();
    // Wing
    ctx.fillStyle = '#f59e0b';
    const wingY = s.bird.vy < 0 ? birdY + 4 : birdY - 2;
    ctx.beginPath(); ctx.ellipse(s.bird.x - 4, wingY, 8, 5, -0.3, 0, Math.PI * 2); ctx.fill();
    // Score
    ctx.fillStyle = '#000'; ctx.font = 'bold 28px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(String(score), canvas.width / 2, 50);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-6 mb-4 p-4 bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border">
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Score</p><p className="text-2xl font-bold text-primary-600">{score}</p></div>
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Best</p><p className="text-2xl font-bold text-yellow-600">{best}</p></div>
        {state === 'idle' && <button onClick={reset} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Start Game</button>}
        {state === 'dead' && <button onClick={reset} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Play Again</button>}
      </div>
      <canvas ref={canvasRef} onClick={flap} className="rounded-xl shadow-lg cursor-pointer border-4 border-gray-800" />
      <p className="mt-3 text-sm text-gray-500">Tap, Click, or press Space to flap</p>
    </div>
  );
}

// ─── Breakout ───────────────────────────────────────────────────────────

function BreakoutGame({ onGameOver }: { onGameOver?: (score: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [state, setState] = useState<'idle' | 'playing' | 'over'>('idle');
  const stateRef = useRef({ ball: { x: 160, y: 300, dx: 3, dy: -3 }, paddle: { x: 130, w: 60 }, bricks: [] as { x: number, y: number, w: number, h: number, alive: boolean, color: string }[] });

  const COLORS = ['#ef4444','#f97316','#f59e0b','#84cc16','#22c55e','#06b6d4','#3b82f6','#8b5cf6'];

  const buildLevel = (lvl: number) => {
    const bricks: typeof stateRef.current.bricks = [];
    const rows = Math.min(3 + lvl, 8);
    const cols = 8;
    const bw = 34, bh = 18, gap = 4, ox = 8, oy = 40;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        bricks.push({ x: ox + c * (bw + gap), y: oy + r * (bh + gap), w: bw, h: bh, alive: true, color: COLORS[r % COLORS.length] });
      }
    }
    stateRef.current.bricks = bricks;
  };

  const reset = (lvl = 1) => {
    const ball = { x: 160, y: 300, dx: 2 + lvl * 0.3, dy: -(2 + lvl * 0.3) };
    stateRef.current = { ...stateRef.current, ball, paddle: { x: 130, w: Math.max(40, 60 - lvl * 3) }, bricks: [] };
    buildLevel(lvl);
    setScore(0); setLives(3); setLevel(lvl); setState('playing');
  };

  useEffect(() => { reset(1); }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const p = stateRef.current.paddle;
      if (e.key === 'ArrowLeft') stateRef.current.paddle = { ...p, x: Math.max(0, p.x - 20) };
      if (e.key === 'ArrowRight') stateRef.current.paddle = { ...p, x: Math.min(320 - p.w, p.x + 20) };
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (state !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = 320; canvas.height = 400;

    const tick = () => {
      const s = stateRef.current;
      // Ball
      s.ball.x += s.ball.dx; s.ball.y += s.ball.dy;
      if (s.ball.x <= 0 || s.ball.x >= 320) s.ball.dx *= -1;
      if (s.ball.y <= 0) s.ball.dy *= -1;

      // Paddle collision
      const p = s.paddle;
      if (s.ball.y + 6 >= 370 && s.ball.x >= p.x && s.ball.x <= p.x + p.w) {
        s.ball.dy = -Math.abs(s.ball.dy);
        s.ball.dx = ((s.ball.x - (p.x + p.w / 2)) / p.w) * 5;
      }

      // Brick collision
      let allDead = true;
      for (const b of s.bricks) {
        if (!b.alive) continue;
        allDead = false;
        if (s.ball.x + 6 > b.x && s.ball.x - 6 < b.x + b.w && s.ball.y + 6 > b.y && s.ball.y - 6 < b.y + b.h) {
          b.alive = false; s.ball.dy *= -1; setScore(sc => sc + 10); break;
        }
      }
      if (allDead) { reset(level + 1); return; }

      // Ball lost
      if (s.ball.y > 400) {
        const newLives = lives - 1;
        setLives(newLives);
        if (newLives <= 0) { setState('over'); onGameOver?.(score); }
        else { s.ball.x = 160; s.ball.y = 300; s.ball.dx = 2 + level * 0.3; s.ball.dy = -2; }
      }

      // Mouse paddle
      const rect = canvas.getBoundingClientRect();
      const mouseHandler = (e: MouseEvent) => { const x = e.clientX - rect.left; s.paddle.x = Math.max(0, Math.min(320 - s.paddle.w, x - s.paddle.w / 2)); };
      canvas.onmousemove = mouseHandler;

      // Draw
      ctx.fillStyle = '#1e293b'; ctx.fillRect(0, 0, 320, 400);
      s.bricks.forEach(b => { if (b.alive) { ctx.fillStyle = b.color; ctx.fillRect(b.x, b.y, b.w, b.h); ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.fillRect(b.x, b.y, b.w, b.h / 2); } });
      ctx.fillStyle = '#facc15'; ctx.beginPath(); ctx.arc(s.ball.x, s.ball.y, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fbbf24'; ctx.fillRect(s.paddle.x, 370, s.paddle.w, 8);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 16px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText(`Score: ${score}  Lives: ${lives}  Level: ${level}`, 8, 20);

      requestAnimationFrame(tick);
    };
    tick();
  }, [state, score, lives, level, onGameOver]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-4 mb-4 p-4 bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border">
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Score</p><p className="text-2xl font-bold text-primary-600">{score}</p></div>
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Level</p><p className="text-2xl font-bold">{level}</p></div>
        {state === 'idle' && <button onClick={() => reset(1)} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Start Game</button>}
        {state === 'over' && <button onClick={() => reset(1)} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Play Again</button>}
      </div>
      <canvas ref={canvasRef} className="rounded-xl shadow-lg border-4 border-gray-800" />
      <p className="mt-3 text-sm text-gray-500">Move mouse or Arrow Keys • Break all bricks!</p>
    </div>
  );
}

// ─── Memory Sequence (Simon Says) ───────────────────────────────────────

function MemorySequenceGame({ onGameOver }: { onGameOver?: (score: number) => void }) {
  const COLORS = ['bg-red-500','bg-blue-500','bg-green-500','bg-yellow-500'];
  const ACTIVE = ['bg-red-400','bg-blue-400','bg-green-400','bg-yellow-400'];
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerIdx, setPlayerIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'idle'|'showing'|'input'|'over'>('idle');
  const [activeBtn, setActiveBtn] = useState<number | null>(null);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('mem-seq-best') || '0'));

  const flash = (idx: number, duration = 400) => new Promise(res => { setActiveBtn(idx); setTimeout(() => { setActiveBtn(null); res(null); }, duration); });

  const nextRound = async () => {
    setGameState('showing');
    await new Promise(r => setTimeout(r, 500));
    const next = [...sequence, Math.floor(Math.random() * 4)];
    setSequence(next);
    for (const i of next) { await flash(i); await new Promise(r => setTimeout(r, 200)); }
    setPlayerIdx(0); setGameState('input');
  };

  const start = () => { setSequence([]); setPlayerIdx(0); setScore(0); setGameState('idle'); nextRound(); };

  const handlePress = async (idx: number) => {
    if (gameState !== 'input') return;
    await flash(idx, 200);
    if (idx !== sequence[playerIdx]) {
      setGameState('over');
      if (score > highScore) { setHighScore(score); localStorage.setItem('mem-seq-best', String(score)); }
      onGameOver?.(score); return;
    }
    const newIdx = playerIdx + 1;
    if (newIdx >= sequence.length) {
      setScore(s => s + sequence.length * 10);
      setPlayerIdx(0);
      nextRound();
    } else {
      setPlayerIdx(newIdx);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-6 mb-4 p-4 bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border">
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Level</p><p className="text-2xl font-bold text-primary-600">{sequence.length}</p></div>
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Score</p><p className="text-2xl font-bold">{score}</p></div>
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Best</p><p className="text-2xl font-bold text-yellow-600">{highScore}</p></div>
        {gameState === 'idle' && <button onClick={start} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Start</button>}
        {gameState === 'over' && <button onClick={start} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Try Again</button>}
      </div>
      {gameState === 'showing' && <p className="text-sm text-gray-500 mb-3">Watch the pattern...</p>}
      {gameState === 'input' && <p className="text-sm text-primary-600 font-medium mb-3">Your turn! Repeat the pattern</p>}
      {gameState === 'over' && <p className="text-lg font-bold text-red-600 mb-3">Game Over! You reached level {sequence.length}</p>}
      <div className="grid grid-cols-2 gap-3 max-w-xs">
        {COLORS.map((color, i) => (
          <button key={i} onClick={() => handlePress(i)} disabled={gameState !== 'input'}
            className={`w-28 h-28 rounded-2xl transition-all duration-200 ${activeBtn === i ? ACTIVE[i] + ' scale-105 shadow-lg' : color} ${gameState === 'input' ? 'hover:brightness-110 cursor-pointer active:scale-95' : 'opacity-70 cursor-not-allowed'}`} />
        ))}
      </div>
    </div>
  );
}

// ─── Color Match (Stroop Effect) ────────────────────────────────────────

function ColorMatchGame({ onGameOver }: { onGameOver?: (score: number) => void }) {
  const COLORS = ['Red','Blue','Green','Yellow','Purple','Orange'];
  const COLOR_HEX: Record<string, string> = { Red: '#ef4444', Blue: '#3b82f6', Green: '#22c55e', Yellow: '#eab308', Purple: '#a855f7', Orange: '#f97316' };
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [target, setTarget] = useState(() => makeRound());
  const [gameState, setGameState] = useState<'idle'|'playing'|'over'>('idle');

  function makeRound() {
    const textColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    let options = [textColor];
    while (options.length < 4) { const c = COLORS[Math.floor(Math.random() * COLORS.length)]; if (!options.includes(c)) options.push(c); }
    options = options.sort(() => Math.random() - 0.5);
    return { word: textColor, color: textColor, options };
  }

  const start = () => { setScore(0); setTimeLeft(30); setGameState('playing'); };

  useEffect(() => {
    if (gameState !== 'playing' || timeLeft <= 0) return;
    if (timeLeft <= 0) { setGameState('over'); onGameOver?.(score); return; }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [gameState, timeLeft, onGameOver, score]);

  useEffect(() => {
    if (timeLeft <= 0 && gameState === 'playing') { setGameState('over'); onGameOver?.(score); }
  }, [timeLeft, gameState, onGameOver, score]);

  const choose = (color: string) => {
    if (gameState !== 'playing') return;
    if (color === target.color) { setScore(s => s + 1); setTarget(makeRound()); }
    else { setScore(s => Math.max(0, s - 1)); }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-6 mb-4 p-4 bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border">
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Score</p><p className="text-2xl font-bold text-primary-600">{score}</p></div>
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Time</p><p className={`text-2xl font-bold ${timeLeft <= 5 ? 'text-red-500' : 'text-yellow-600'}`}>{timeLeft}s</p></div>
        {gameState === 'idle' && <button onClick={start} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Start</button>}
        {gameState === 'over' && <button onClick={start} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Play Again</button>}
      </div>
      {gameState === 'playing' && (
        <div className="card p-10 text-center w-full max-w-md">
          <p className="text-sm text-gray-500 mb-4">What COLOR is the text? (not the word!)</p>
          <p className="text-5xl font-display font-extrabold mb-8" style={{ color: COLOR_HEX[target.color] }}>{target.word}</p>
          <div className="grid grid-cols-2 gap-3">
            {target.options.map(opt => (
              <button key={opt} onClick={() => choose(opt)} className="py-3 px-4 rounded-xl text-white font-bold text-lg hover:brightness-110 active:scale-95 transition-all" style={{ backgroundColor: COLOR_HEX[opt] }}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
      {gameState === 'over' && <div className="card p-8 text-center"><p className="text-3xl font-bold font-display text-green-600">🎯 Time's Up!</p><p className="text-xl text-gray-600 mt-2">Score: {score}</p></div>}
    </div>
  );
}

// ─── Number Chain ───────────────────────────────────────────────────────

function NumberChainGame({ onGameOver }: { onGameOver?: (score: number) => void }) {
  const SIZE = 25;
  const [numbers, setNumbers] = useState<number[]>([]);
  const [current, setCurrent] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameState, setGameState] = useState<'idle'|'playing'|'over'>('idle');

  const shuffle = () => {
    const arr = Array.from({ length: SIZE }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
    setNumbers(arr); setCurrent(1); setScore(0); setTimeLeft(30);
  };

  const start = () => { shuffle(); setGameState('playing'); };
  useEffect(() => { if (gameState === 'playing') shuffle(); }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing' || timeLeft <= 0) return;
    const t = setTimeout(() => { if (timeLeft <= 1) { setGameState('over'); onGameOver?.(score); } else setTimeLeft(t => t - 1); }, 1000);
    return () => clearTimeout(t);
  }, [gameState, timeLeft, onGameOver, score]);

  const press = (n: number) => {
    if (gameState !== 'playing') return;
    if (n === current) {
      const next = current + 1;
      setCurrent(next);
      setScore(s => s + n);
      if (next > SIZE) { setGameState('over'); onGameOver?.(score + SIZE); }
    } else {
      setScore(s => Math.max(0, s - 2));
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-6 mb-4 p-4 bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border">
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Next</p><p className="text-2xl font-bold text-primary-600">{current}</p></div>
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Score</p><p className="text-2xl font-bold">{score}</p></div>
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Time</p><p className={`text-2xl font-bold ${timeLeft <= 5 ? 'text-red-500' : 'text-yellow-600'}`}>{timeLeft}s</p></div>
        {gameState === 'idle' && <button onClick={start} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Start</button>}
        {gameState === 'over' && <button onClick={start} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Play Again</button>}
      </div>
      {gameState === 'playing' && (
        <div className="grid grid-cols-5 gap-2 max-w-sm">
          {numbers.map(n => (
            <button key={n} onClick={() => press(n)} className={`w-14 h-14 rounded-xl text-lg font-bold transition-all active:scale-95 ${n === current ? 'bg-primary-100 dark:bg-primary-900/30 ring-2 ring-primary-500' : 'bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border hover:bg-gray-50'}`}>
              {n}
            </button>
          ))}
        </div>
      )}
      {gameState === 'over' && <div className="card p-8 text-center"><p className="text-3xl font-bold font-display text-green-600">🎉 Chain Complete!</p><p className="text-xl text-gray-600 mt-2">Score: {score}</p></div>}
    </div>
  );
}

// ─── Rock Paper Scissors ────────────────────────────────────────────────

function RockPaperScissorsGame({ onGameOver }: { onGameOver?: (score: number) => void }) {
  const CHOICES = [
    { name: 'Rock', emoji: '✊', beats: 'Scissors' },
    { name: 'Paper', emoji: '✋', beats: 'Rock' },
    { name: 'Scissors', emoji: '✌️', beats: 'Paper' },
  ];
  const [score, setScore] = useState({ player: 0, cpu: 0, draws: 0 });
  const [round, setRound] = useState(0);
  const [playerChoice, setPlayerChoice] = useState<string | null>(null);
  const [cpuChoice, setCpuChoice] = useState<string | null>(null);
  const [result, setResult] = useState('');
  const [gameState, setGameState] = useState<'idle'|'playing'|'over'>('idle');
  const [mode, setMode] = useState<'pvp' | 'pvc'>('pvc');

  const play = (choice: string) => {
    if (gameState === 'over') return;
    const cpu = CHOICES[Math.floor(Math.random() * 3)].name;
    setPlayerChoice(choice); setCpuChoice(cpu);
    if (choice === cpu) { setResult('draw'); setScore(s => ({ ...s, draws: s.draws + 1 })); }
    else if (CHOICES.find(c => c.name === choice)?.beats === cpu) { setResult('win'); setScore(s => ({ ...s, player: s.player + 1 })); }
    else { setResult('lose'); setScore(s => ({ ...s, cpu: s.cpu + 1 })); }
    setRound(r => r + 1);
    const finalScore = score.player * 10;
    if (finalScore > 0 && round + 1 >= 10) { setGameState('over'); onGameOver?.(finalScore); }
  };

  const reset = () => { setScore({ player: 0, cpu: 0, draws: 0 }); setRound(0); setPlayerChoice(null); setCpuChoice(null); setResult(''); setGameState('idle'); };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-4 mb-4 p-4 bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border">
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">You</p><p className="text-2xl font-bold text-green-600">{score.player}</p></div>
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Draws</p><p className="text-2xl font-bold">{score.draws}</p></div>
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">CPU</p><p className="text-2xl font-bold text-red-600">{score.cpu}</p></div>
        <select value={mode} onChange={e => setMode(e.target.value as 'pvp' | 'pvc')} className="px-2 py-1 border rounded text-sm">
          <option value="pvc">vs CPU</option><option value="pvp">2-Player</option>
        </select>
      </div>
      {gameState === 'over' && <div className="mb-4 px-6 py-3 bg-blue-100 text-blue-700 rounded-xl text-center"><p className="text-xl font-bold font-display">🏆 Match Over! {score.player > score.cpu ? 'You Win!' : score.player < score.cpu ? 'CPU Wins!' : 'Draw!'}</p></div>}
      <div className="flex gap-3 mb-4">
        {CHOICES.map(c => (
          <button key={c.name} onClick={() => play(c.name)} className="w-20 h-20 rounded-2xl bg-white dark:bg-dark-card border-2 border-gray-200 dark:border-dark-border text-4xl hover:border-primary-400 hover:scale-105 active:scale-95 transition-all shadow-sm">
            <div><p className="text-2xl">{c.emoji}</p><p className="text-[10px] font-medium">{c.name}</p></div>
          </button>
        ))}
      </div>
      {playerChoice && cpuChoice && (
        <div className="text-center">
          <p className="text-lg mb-1">You: <span className="text-2xl">{CHOICES.find(c=>c.name===playerChoice)?.emoji}</span> {playerChoice}</p>
          <p className="text-lg mb-3">CPU: <span className="text-2xl">{CHOICES.find(c=>c.name===cpuChoice)?.emoji}</span> {cpuChoice}</p>
          <p className={`text-xl font-bold ${result === 'win' ? 'text-green-600' : result === 'lose' ? 'text-red-600' : 'text-yellow-600'}`}>
            {result === 'win' ? '🎉 You Win!' : result === 'lose' ? '😔 You Lose!' : "🤝 It's a Draw!"}
          </p>
        </div>
      )}
      {gameState === 'idle' && <p className="text-sm text-gray-500">Round {round + 1} - Choose your move!</p>}
    </div>
  );
}

// ─── Wordle Clone ───────────────────────────────────────────────────────

function WordleGame({ onGameOver }: { onGameOver?: (score: number) => void }) {
  const WORDS = ['APPLE','BEACH','CLOUD','DANCE','EAGLE','FLAME','GRAPE','HOUSE','IVORY','JELLY','KNIFE','LEMON','MANGO','NIGHT','OCEAN','PIANO','QUEEN','RIVER','STONE','TIGER','ULTRA','VIVID','WHALE','XENON','YOUTH','ZEBRA','BRAIN','CROWN','DREAM','EARTH','FROST','GLOBE','HEART','INPUT','JUICE','KARMA','LIGHT','MAGIC','NOVEL','OLIVE'];
  const WORD_LEN = 5;
  const MAX_GUESSES = 6;
  const [secret, setSecret] = useState(() => WORDS[Math.floor(Math.random() * WORDS.length)]);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [message, setMessage] = useState('');
  const [gameState, setGameState] = useState<'idle'|'playing'|'over'>('idle');

  const start = () => {
    setSecret(WORDS[Math.floor(Math.random() * WORDS.length)]);
    setGuesses([]); setCurrentGuess(''); setMessage(''); setGameState('playing');
  };

  useEffect(() => { start(); }, []);

  const submit = () => {
    if (currentGuess.length !== WORD_LEN) { setMessage('Word must be 5 letters!'); return; }
    const newGuesses = [...guesses, currentGuess.toUpperCase()];
    setGuesses(newGuesses); setCurrentGuess('');
    if (currentGuess.toUpperCase() === secret) {
      setMessage('🎉 You got it!');
      setGameState('over'); onGameOver?.(newGuesses.length * 20);
    } else if (newGuesses.length >= MAX_GUESSES) {
      setMessage(`Game Over! Word: ${secret}`);
      setGameState('over');
    } else {
      setMessage(`${MAX_GUESSES - newGuesses.length} guesses left`);
    }
  };

  const getColor = (letter: string, pos: number) => {
    if (secret[pos] === letter) return 'bg-green-500 text-white border-green-500';
    if (secret.includes(letter)) return 'bg-yellow-500 text-white border-yellow-500';
    return 'bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-4 mb-4 p-4 bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border">
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Guesses</p><p className="text-2xl font-bold text-primary-600">{guesses.length}/{MAX_GUESSES}</p></div>
        {gameState === 'idle' && <button onClick={start} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Start</button>}
        {gameState === 'over' && <button onClick={start} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">New Word</button>}
      </div>
      <div className="flex flex-col items-center gap-1.5 mb-4">
        {Array.from({ length: MAX_GUESSES }).map((_, i) => (
          <div key={i} className="flex gap-1.5">
            {Array.from({ length: WORD_LEN }).map((_, j) => {
              const guess = guesses[i] || currentGuess;
              const letter = guess[j] || '';
              const filled = !!letter;
              const evaluated = i < guesses.length;
              return (
                <div key={j} className={`w-12 h-12 border-2 flex items-center justify-center text-xl font-bold rounded-lg transition-all ${evaluated && letter ? getColor(letter, j) : filled ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-300 dark:border-gray-600'}`}>
                  {letter}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {message && <p className="text-sm font-medium mb-3 text-center">{message}</p>}
      {gameState === 'playing' && (
        <div className="flex gap-2">
          {[...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].map(l => (
            <button key={l} onClick={() => setCurrentGuess(g => (g + l).slice(0, WORD_LEN))} className="w-8 h-10 bg-gray-100 dark:bg-dark-bg hover:bg-gray-200 rounded text-sm font-bold">{l}</button>
          ))}
          <button onClick={submit} className="px-3 bg-primary-600 text-white rounded text-sm font-bold">Enter</button>
          <button onClick={() => setCurrentGuess(g => g.slice(0, -1))} className="px-3 bg-red-500 text-white rounded text-sm font-bold">⌫</button>
        </div>
      )}
    </div>
  );
}

// ─── Whack-a-Mole ───────────────────────────────────────────────────────

function WhackAMoleGame({ onGameOver }: { onGameOver?: (score: number) => void }) {
  const HOLES = 9;
  const [moles, setMoles] = useState<boolean[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameState, setGameState] = useState<'idle'|'playing'|'over'>('idle');

  useEffect(() => {
    if (gameState !== 'playing') return;
    const interval = setInterval(() => {
      setMoles(prev => {
        const idx = Math.floor(Math.random() * HOLES);
        const next = Array.from({ length: HOLES }, (_, i) => i === idx);
        return next as boolean[];
      });
    }, 700);
    return () => clearInterval(interval);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing' || timeLeft <= 0) return;
    if (timeLeft <= 0) { setGameState('over'); onGameOver?.(score); return; }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [gameState, timeLeft, onGameOver, score]);

  const whack = (idx: number) => {
    if (gameState !== 'playing' || !moles[idx]) return;
    setScore(s => s + 10);
    setMoles(prev => { const next = [...prev]; next[idx] = false; return next; });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-6 mb-4 p-4 bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border">
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Score</p><p className="text-2xl font-bold text-primary-600">{score}</p></div>
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Time</p><p className={`text-2xl font-bold ${timeLeft <= 5 ? 'text-red-500' : 'text-yellow-600'}`}>{timeLeft}s</p></div>
        {gameState === 'idle' && <button onClick={() => setGameState('playing')} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Start</button>}
        {gameState === 'over' && <button onClick={() => { setScore(0); setTimeLeft(30); setGameState('playing'); }} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Play Again</button>}
      </div>
      <div className="grid grid-cols-3 gap-3 max-w-sm">
        {Array.from({ length: HOLES }).map((_, i) => (
          <button key={i} onClick={() => whack(i)} disabled={gameState !== 'playing'} className={`w-20 h-20 rounded-2xl text-4xl flex items-center justify-center transition-all duration-200 ${moles[i] ? 'bg-yellow-100 dark:bg-yellow-900/30 scale-110 cursor-pointer active:scale-90' : 'bg-gray-200 dark:bg-gray-700'} ${gameState === 'playing' ? 'cursor-pointer' : ''}`}>
            {moles[i] ? '🔨' : '🕳️'}
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm text-gray-500">Click the moles as fast as you can!</p>
    </div>
  );
}

// ─── Minesweeper ────────────────────────────────────────────────────────

function MinesweeperGame({ onGameOver }: { onGameOver?: (score: number) => void }) {
  const SIZE = 10;
  const [mines, setMines] = useState<boolean[]>([]);
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const [flagged, setFlagged] = useState<boolean[]>([]);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [gameState, setGameState] = useState<'idle'|'playing'|'over'>('idle');
  const [won, setWon] = useState(false);

  const init = () => {
    const m = Array.from({ length: SIZE * SIZE }, () => false);
    const positions = Array.from({ length: SIZE * SIZE }, (_, i) => i).sort(() => Math.random() - 0.5);
    for (let i = 0; i < 15; i++) m[positions[i]] = true;
    const nums = new Array(SIZE * SIZE).fill(0);
    for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
      if (m[r * SIZE + c]) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && m[nr * SIZE + nc]) count++;
      }
      nums[r * SIZE + c] = count;
    }
    setMines(m); setNumbers(nums); setRevealed(new Array(SIZE * SIZE).fill(false)); setFlagged(new Array(SIZE * SIZE).fill(false));
    setGameState('playing'); setWon(false);
  };

  useEffect(() => { init(); }, []);

  const reveal = (idx: number) => {
    if (gameState !== 'playing' || revealed[idx] || flagged[idx]) return;
    const newRevealed = [...revealed];
    const queue = [idx];
    while (queue.length) {
      const i = queue.shift()!;
      if (newRevealed[i] || flagged[i] || mines[i]) continue;
      newRevealed[i] = true;
      if (numbers[i] === 0) {
        const r = Math.floor(i / SIZE), c = i % SIZE;
        for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE) queue.push(nr * SIZE + nc);
        }
      }
    }
    setRevealed(newRevealed);
    if (mines[idx]) { setGameState('over'); onGameOver?.(0); }
    else if (newRevealed.filter((v, i) => v && !mines[i]).length === SIZE * SIZE - 15) { setWon(true); setGameState('over'); onGameOver?.(100); }
  };

  const flag = (idx: number) => {
    if (gameState !== 'playing' || revealed[idx]) return;
    setFlagged(f => { const n = [...f]; n[idx] = !n[idx]; return n; });
  };

  const NUM_COLORS = ['','text-blue-600','text-green-600','text-red-600','text-purple-600','text-yellow-600','text-pink-600','text-gray-800','text-gray-600'];

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-6 mb-4 p-4 bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border">
        <p className="text-sm text-gray-500">🚩 {flagged.filter(Boolean).length}/15 mines</p>
        {gameState === 'idle' && <button onClick={init} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Start</button>}
        {gameState === 'over' && <button onClick={init} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">{won ? '🎉 Play Again' : 'Try Again'}</button>}
      </div>
      {gameState === 'over' && <p className={`text-lg font-bold mb-3 ${won ? 'text-green-600' : 'text-red-600'}`}>{won ? '🎉 You cleared the field!' : '💥 Boom! You hit a mine!'}</p>}
      <div className="grid grid-cols-10 gap-0.5 bg-gray-400 p-1 rounded-lg">
        {Array.from({ length: SIZE * SIZE }).map((_, i) => {
          const r = Math.floor(i / SIZE), c = i % SIZE;
          const revealedCell = revealed[i];
          const isMine = mines[i] && revealedCell;
          const num = numbers[i];
          return (
            <button key={i} onClick={() => reveal(i)} onContextMenu={e => { e.preventDefault(); flag(i); }}
              className={`w-8 h-8 text-xs font-bold flex items-center justify-center transition-all ${revealedCell ? (isMine ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-gray-600 ' + NUM_COLORS[num]) : 'bg-gray-300 dark:bg-gray-500 hover:bg-gray-200'} ${flagged[i] && !revealedCell ? 'bg-yellow-200' : ''}`}>
              {revealedCell && isMine ? '💣' : revealedCell && num > 0 ? num : flagged[i] && !revealedCell ? '🚩' : ''}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-sm text-gray-500">Left-click to reveal • Right-click to flag</p>
    </div>
  );
}

// ─── Tetris ─────────────────────────────────────────────────────────────

function TetrisGame({ onGameOver }: { onGameOver?: (score: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => parseInt(localStorage.getItem('tetris-best') || '0'));
  const [gameState, setGameState] = useState<'idle'|'playing'|'over'>('idle');
  const stateRef = useRef({ board: Array.from({ length: 20 }, () => Array(10).fill(0)), piece: null as any, next: null as any, gameOver: false });

  const SHAPES = [
    [[1,1,1,1]], [[1,1],[1,1]], [[0,1,0],[1,1,1]], [[0,1,1],[1,1,0]], [[1,1,0],[0,1,1]],
    [[1,0,0],[1,1,1]], [[0,0,1],[1,1,1]]
  ];
  const COLORS = [0,'#06b6d4','#3b82f6','#f97316','#eab308','#22c55e','#a855f7','#ef4444'];

  const randomPiece = () => {
    const type = Math.floor(Math.random() * SHAPES.length) + 1;
    return { shape: SHAPES[type - 1], color: type, x: 3, y: 0 };
  };

  const collide = (board: any[][], piece: any, dx = 0, dy = 0) => {
    for (let r = 0; r < piece.shape.length; r++) for (let c = 0; c < piece.shape[r].length; c++) {
      if (piece.shape[r][c]) {
        const nx = piece.x + c + dx, ny = piece.y + r + dy;
        if (nx < 0 || nx >= 10 || ny >= 20) return true;
        if (ny >= 0 && board[ny][nx]) return true;
      }
    }
    return false;
  };

  const merge = (board: any[][], piece: any) => {
    for (let r = 0; r < piece.shape.length; r++) for (let c = 0; c < piece.shape[r].length; c++) {
      if (piece.shape[r][c]) { const ny = piece.y + r, nx = piece.x + c; if (ny >= 0) board[ny][nx] = piece.color; }
    }
  };

  const rotate = (shape: number[][]) => {
    const rows = shape.length, cols = shape[0].length;
    const result: number[][] = Array.from({ length: cols }, () => Array(rows).fill(0));
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) result[c][rows - 1 - r] = shape[r][c];
    return result;
  };

  const clearLines = (board: any[][]) => {
    let cleared = 0;
    for (let r = 19; r >= 0; r--) {
      if (board[r].every(c => c !== 0)) { board.splice(r, 1); board.unshift(Array(10).fill(0)); cleared++; r++; }
    }
    return cleared;
  };

  const reset = () => {
    stateRef.current = { board: Array.from({ length: 20 }, () => Array(10).fill(0)), piece: randomPiece(), next: randomPiece(), gameOver: false };
    setScore(0); setGameState('playing');
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      const s = stateRef.current;
      const p = s.piece;
      if (e.key === 'ArrowLeft' && !collide(s.board, p, -1, 0)) p.x--;
      else if (e.key === 'ArrowRight' && !collide(s.board, p, 1, 0)) p.x++;
      else if (e.key === 'ArrowDown') { while (!collide(s.board, p, 0, 1)) { p.y++; setScore(sc => sc + 1); } mergeAndNext(s); }
      else if (e.key === 'ArrowUp') { const rotated = rotate(p.shape); const orig = p.shape; p.shape = rotated; if (collide(s.board, p)) p.shape = orig; }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameState]);

  const mergeAndNext = (s: typeof stateRef.current) => {
    merge(s.board, s.piece);
    const cleared = clearLines(s.board);
    if (cleared > 0) setScore(sc => sc + cleared * 100);
    s.piece = s.next;
    s.next = randomPiece();
    if (collide(s.board, s.piece)) { s.gameOver = true; setGameState('over'); const finalScore = score; if (finalScore > best) { setBest(finalScore); localStorage.setItem('tetris-best', String(finalScore)); } onGameOver?.(score); }
  };

  useEffect(() => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = 250; canvas.height = 400;

    const draw = () => {
      const s = stateRef.current;
      // Gravity
      if (!collide(s.board, s.piece, 0, 1)) s.piece.y++;
      else mergeAndNext(s);

      ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, 250, 400);
      // Grid
      ctx.strokeStyle = 'rgba(255,255,255,0.03)'; ctx.lineWidth = 0.5;
      for (let r = 0; r < 20; r++) for (let c = 0; c < 10; c++) { ctx.strokeRect(c * 25, r * 20, 25, 20); }
      // Board
      for (let r = 0; r < 20; r++) for (let c = 0; c < 10; c++) {
        if (s.board[r][c]) { ctx.fillStyle = COLORS[s.board[r][c]]; ctx.fillRect(c * 25 + 1, r * 20 + 1, 23, 18); ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.fillRect(c * 25 + 1, r * 20 + 1, 23, 6); }
      }
      // Piece
      if (s.piece) {
        for (let r = 0; r < s.piece.shape.length; r++) for (let c = 0; c < s.piece.shape[r].length; c++) {
          if (s.piece.shape[r][c]) { const px = (s.piece.x + c) * 25, py = (s.piece.y + r) * 20; ctx.fillStyle = COLORS[s.piece.color]; ctx.fillRect(px + 1, py + 1, 23, 18); ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.fillRect(px + 1, py + 1, 23, 6); }
        }
      }
      // Next piece
      ctx.fillStyle = '#fff'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText(`Score: ${score}`, 10, 20);
      ctx.fillText(`Best: ${best}`, 10, 36);
      requestAnimationFrame(draw);
    };
    draw();
  }, [gameState, score, best, onGameOver]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-4 mb-4 p-4 bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border">
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Score</p><p className="text-2xl font-bold text-primary-600">{score}</p></div>
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Best</p><p className="text-2xl font-bold text-yellow-600">{best}</p></div>
        {gameState === 'idle' && <button onClick={reset} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Start</button>}
        {gameState === 'over' && <button onClick={reset} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Play Again</button>}
      </div>
      <canvas ref={canvasRef} className="rounded-xl shadow-lg border-4 border-gray-800" />
      <p className="mt-3 text-sm text-gray-500">Arrow keys: ← → move, ↑ rotate, ↓ fast drop</p>
    </div>
  );
}

// ─── Quick Math Speed ───────────────────────────────────────────────────

function SpeedMathGame({ onGameOver }: { onGameOver?: (score: number) => void }) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [question, setQuestion] = useState({ expr: '', answer: 0 });
  const [feedback, setFeedback] = useState('');
  const [gameState, setGameState] = useState<'idle'|'playing'|'over'>('idle');
  const [streak, setStreak] = useState(0);
  const [input, setInput] = useState('');

  const gen = () => {
    const ops = ['+','-','×'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a = Math.floor(Math.random() * 20) + 1, b = Math.floor(Math.random() * 20) + 1;
    if (op === '-' && a < b) [a, b] = [b, a];
    const ans = op === '+' ? a + b : op === '-' ? a - b : a * b;
    setQuestion({ expr: `${a} ${op} ${b} = ?`, answer: ans });
    setInput(''); setFeedback('');
  };

  const start = () => { setScore(0); setTimeLeft(60); setStreak(0); setGameState('playing'); gen(); };

  useEffect(() => { if (gameState === 'playing') gen(); }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing' || timeLeft <= 0) return;
    if (timeLeft <= 0) { setGameState('over'); onGameOver?.(score); return; }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [gameState, timeLeft, onGameOver, score]);

  const check = () => {
    if (feedback || !input) return;
    const val = parseFloat(input);
    if (Math.abs(val - question.answer) < 0.01) {
      const bonus = streak > 0 ? streak * 2 : 0;
      setScore(s => s + 10 + bonus);
      setStreak(s => s + 1);
      setFeedback('correct');
      setTimeout(() => { if (gameState === 'playing') gen(); }, 300);
    } else {
      setStreak(0); setFeedback('wrong');
      setTimeout(() => { setFeedback(''); setInput(''); }, 500);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-6 mb-4 p-4 bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border">
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Score</p><p className="text-2xl font-bold text-primary-600">{score}</p></div>
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Streak</p><p className="text-2xl font-bold text-yellow-600">{streak}🔥</p></div>
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Time</p><p className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-yellow-600'}`}>{timeLeft}s</p></div>
        {gameState === 'idle' && <button onClick={start} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Start</button>}
        {gameState === 'over' && <button onClick={start} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Play Again</button>}
      </div>
      {gameState === 'playing' && (
        <div className="card p-8 w-full max-w-md text-center">
          <p className="text-4xl font-bold font-display mb-6">{question.expr}</p>
          <input type="number" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && check()} autoFocus step="any"
            className="w-full px-4 py-3 text-center text-2xl border-2 border-gray-200 dark:border-dark-border rounded-xl dark:bg-dark-bg focus:outline-none focus:border-primary-500 mb-4" />
          <button onClick={check} className="btn-primary px-8">Answer</button>
          {feedback === 'correct' && <p className="text-green-600 font-medium mt-3">✅ Correct! +{10 + streak * 2}</p>}
          {feedback === 'wrong' && <p className="text-red-500 font-medium mt-3">❌ Wrong! Answer: {question.answer}</p>}
        </div>
      )}
      {gameState === 'over' && <div className="card p-8 text-center"><p className="text-3xl font-bold font-display text-green-600">🎯 Time's Up!</p><p className="text-xl text-gray-600 mt-1">Score: {score}</p><p className="text-gray-500">Best Streak: {streak}</p></div>}
    </div>
  );
}

// ─── Emoji Match ────────────────────────────────────────────────────────

function EmojiMatchGame({ onGameOver }: { onGameOver?: (score: number) => void }) {
  const EMOJIS = ['🐶','🐱','🐼','🦊','🐸','🐙','🦄','🐵','🐰','🐯','🐮','🐷'];
  const [cards, setCards] = useState<{id:number, emoji:string, flipped:boolean, matched:boolean}[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [lock, setLock] = useState(false);
  const [matched, setMatched] = useState(0);
  const [best, setBest] = useState(() => parseInt(localStorage.getItem('emoji-best') || '999'));

  const startGame = () => {
    const emojis = EMOJIS.slice(0, 8);
    const deck = [...emojis, ...emojis].map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false })).sort(() => Math.random() - 0.5);
    setCards(deck); setFlipped([]); setMoves(0); setLock(false); setMatched(0);
  };

  useEffect(() => { startGame(); }, []);

  const flip = (idx: number) => {
    if (lock || cards[idx].flipped || cards[idx].matched || flipped.length >= 2) return;
    const newCards = [...cards]; newCards[idx].flipped = true; setCards(newCards);
    const newFlipped = [...flipped, idx]; setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setLock(true); setMoves(m => m + 1);
      const [a, b] = newFlipped;
      if (cards[a].emoji === cards[b].emoji) {
        const matchedCards = [...cards]; matchedCards[a].matched = true; matchedCards[b].matched = true; setCards(matchedCards);
        setFlipped([]); setLock(false); setMatched(m => m + 2);
        if (matched + 2 === cards.length / 2 * 2) {
          const moveScore = Math.max(10, best - moves * 2);
          if (moves < best) { setBest(moves); localStorage.setItem('emoji-best', String(moves)); }
          setTimeout(() => onGameOver?.(moveScore), 500);
        }
      } else {
        setTimeout(() => {
          const reset = [...cards]; reset[a].flipped = false; reset[b].flipped = false; setCards(reset);
          setFlipped([]); setLock(false);
        }, 800);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-6 mb-4 p-4 bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border">
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Moves</p><p className="text-2xl font-bold text-primary-600">{moves}</p></div>
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Best</p><p className="text-2xl font-bold text-yellow-600">{best}</p></div>
        <button onClick={startGame} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">New Game</button>
      </div>
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {cards.map((card, idx) => (
          <button key={card.id} onClick={() => flip(idx)} disabled={lock}
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center text-3xl sm:text-4xl transition-all duration-300 hover:scale-105 active:scale-95 ${card.flipped || card.matched ? 'bg-white dark:bg-dark-card rotate-0 shadow-md border-2 border-primary-200' : 'bg-primary-600 text-white shadow-lg rotate-y-180'}`}>
            {card.flipped || card.matched ? card.emoji : '?'}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Bubble Shooter ─────────────────────────────────────────────────────

function BubbleShooterGame({ onGameOver }: { onGameOver?: (score: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'idle'|'playing'|'over'>('idle');
  type BubbleGrid = { color: string }[][];
type Bubble = { x:number,y:number,r:number,color:string,vx:number,vy:number } | null;
const stateRef = useRef<{ bubbles: {x:number,y:number,r:number,color:string,vx:number,vy:number}[]; shooter: { x: number; y: number; angle: number; color: string }; nextColor: string; grid: BubbleGrid; currentBubble: Bubble }>({ bubbles: [], shooter: { x: 175, y: 380, angle: -Math.PI/2, color: '' }, nextColor: '', grid: [] as BubbleGrid, currentBubble: null });

  const BUBBLE_COLORS = ['#ef4444','#3b82f6','#22c55e','#eab308','#a855f7','#f97316'];
  const BUBBLE_R = 15;
  const COLS = 11, ROWS = 8;
  const OFF_X = 25, OFF_Y = 30;

  const initGrid = () => {
    const grid: { color: string }[][] = [];
    for (let r = 0; r < ROWS; r++) {
      grid[r] = [];
      for (let c = 0; c < COLS; c++) {
        if (r < 3) grid[r][c] = { color: BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)] };
        else grid[r][c] = { color: '' };
      }
    }
    return grid;
  };

  const reset = () => {
    const grid = initGrid();
    const color = BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];
    stateRef.current = { bubbles: [], grid, shooter: { x: 175, y: 380, angle: -Math.PI/2, color }, nextColor: BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)], currentBubble: null, bubbles: [] };
    setScore(0); setGameState('playing');
  };

  useEffect(() => { reset(); }, []);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = 350; canvas.height = 420;

    const handleMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left, my = e.clientY - rect.top;
      stateRef.current.shooter.angle = Math.atan2(my - 380, mx - 175);
    };
    canvas.addEventListener('mousemove', handleMove);

    const handleClick = () => {
      const s = stateRef.current;
      if (s.currentBubble) return;
      const angle = s.shooter.angle;
      const speed = 8;
      s.currentBubble = { x: 175, y: 380, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, color: s.shooter.color };
    };
    canvas.addEventListener('click', handleClick);

    const tick = () => {
      const s = stateRef.current;
      // Move bubble
      if (s.currentBubble) {
        s.currentBubble.x += s.currentBubble.vx;
        s.currentBubble.y += s.currentBubble.vy;
        // Wall bounce
        if (s.currentBubble.x <= BUBBLE_R || s.currentBubble.x >= 350 - BUBBLE_R) s.currentBubble.vx *= -1;
        // Ceiling
        if (s.currentBubble.y <= OFF_Y + BUBBLE_R) { s.currentBubble = null; s.shooter.color = s.nextColor; s.nextColor = BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)]; }
        // Grid collision
        for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
          const gx = OFF_X + c * (BUBBLE_R * 2) + (r % 2 ? BUBBLE_R : 0);
          const gy = OFF_Y + r * (BUBBLE_R * 2 - 2);
          if (s.currentBubble && Math.hypot(s.currentBubble.x - gx, s.currentBubble.y - gy) < BUBBLE_R * 1.8) {
            // Find nearest grid cell
            let bestDist = Infinity, bestR = -1, bestC = -1;
            for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr, nc = c + dc;
              if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && !s.grid[nr][nc]?.color) {
                const ngx = OFF_X + nc * (BUBBLE_R * 2) + (nr % 2 ? BUBBLE_R : 0);
                const ngy = OFF_Y + nr * (BUBBLE_R * 2 - 2);
                const d = Math.hypot(s.currentBubble.x - ngx, s.currentBubble.y - ngy);
                if (d < bestDist) { bestDist = d; bestR = nr; bestC = nc; }
              }
            }
            if (bestR >= 0) {
              s.grid[bestR][bestC] = { color: s.currentBubble.color };
              // Check matches
              const matches = new Set<[number, number]>();
              const queue: [number, number][] = [[bestR, bestC]];
              const visited = new Set<string>();
              visited.add(`${bestR},${bestC}`);
              while (queue.length) {
                const [cr, cc] = queue.shift()!;
                matches.add([cr, cc]);
                for (const [dr, dc] of [[0,1],[0,-1],[1,0],[-1,0]]) {
                  const nr = cr + dr, nc = cc + dc;
                  const key = `${nr},${nc}`;
                  if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && s.grid[nr][nc]?.color === s.currentBubble.color && !visited.has(key)) {
                    visited.add(key); queue.push([nr, nc]);
                  }
                }
              }
              if (matches.size >= 3) {
                setScore(sc => sc + matches.size * 10);
                for (const [mr, mc] of matches) s.grid[mr][mc] = { color: '' };
              }
            }
            s.currentBubble = null;
            s.shooter.color = s.nextColor;
            s.nextColor = BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];
            break;
          }
        }
      }

      // Draw
      ctx.fillStyle = '#1e3a5f'; ctx.fillRect(0, 0, 350, 420);
      // Grid
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
        const gx = OFF_X + c * (BUBBLE_R * 2) + (r % 2 ? BUBBLE_R : 0);
        const gy = OFF_Y + r * (BUBBLE_R * 2 - 2);
        if (s.grid[r][c]?.color) {
          ctx.fillStyle = s.grid[r][c].color;
          ctx.beginPath(); ctx.arc(gx, gy, BUBBLE_R - 1, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = 'rgba(255,255,255,0.3)';
          ctx.beginPath(); ctx.arc(gx - 3, gy - 3, BUBBLE_R / 3, 0, Math.PI * 2); ctx.fill();
        }
      }
      // Shooter
      ctx.fillStyle = s.shooter.color;
      ctx.beginPath(); ctx.arc(175, 380, BUBBLE_R, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.beginPath(); ctx.arc(172, 377, BUBBLE_R / 3, 0, Math.PI * 2); ctx.fill();
      // Arrow
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(175, 380); ctx.lineTo(175 + Math.cos(s.shooter.angle) * 30, 380 + Math.sin(s.shooter.angle) * 30); ctx.stroke();
      // Current bubble
      if (s.currentBubble) {
        ctx.fillStyle = s.currentBubble.color;
        ctx.beginPath(); ctx.arc(s.currentBubble.x, s.currentBubble.y, BUBBLE_R - 1, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = '#fff'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText(`Score: ${score}`, 10, 20);

      requestAnimationFrame(tick);
    };
    tick();
    return () => canvas.removeEventListener('mousemove', handleMove);
  }, [gameState, score, onGameOver]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-4 mb-4 p-4 bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border">
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Score</p><p className="text-2xl font-bold text-primary-600">{score}</p></div>
        {gameState === 'idle' && <button onClick={reset} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Start</button>}
        {gameState === 'over' && <button onClick={reset} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Play Again</button>}
      </div>
      <canvas ref={canvasRef} onClick={() => {}} className="rounded-xl shadow-lg border-4 border-gray-800" />
      <p className="mt-3 text-sm text-gray-500">Aim with mouse • Click to shoot • Match 3+ same colors</p>
    </div>
  );
}

// ─── Dino Run (Endless Runner) ──────────────────────────────────────────

function DinoRunGame({ onGameOver }: { onGameOver?: (score: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => parseInt(localStorage.getItem('dino-best') || '0'));
  const [gameState, setGameState] = useState<'idle'|'playing'|'over'>('idle');
  const stateRef = useRef({ dino: { x: 50, y: 300, vy: 0, w: 40, h: 50, grounded: true }, obstacles: [] as {x:number,y:number,w:number,h:number,passed:boolean}[], speed: 5, frame: 0, jumping: false });

  const GROUND_Y = 350;

  const reset = () => {
    stateRef.current = { dino: { x: 50, y: GROUND_Y - 50, vy: 0, w: 40, h: 50, grounded: true }, obstacles: [], speed: 5, frame: 0, jumping: false };
    setScore(0); setGameState('playing');
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); jump(); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameState]);

  const jump = () => {
    const d = stateRef.current.dino;
    if (d.grounded && gameState === 'playing') { d.vy = -13; d.grounded = false; }
  };

  useEffect(() => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = 400; canvas.height = 400;

    let raf: number;
    const tick = () => {
      const s = stateRef.current;
      s.frame++;
      // Dino physics
      const d = s.dino;
      d.vy += 0.6; d.y += d.vy;
      if (d.y >= GROUND_Y - d.h) { d.y = GROUND_Y - d.h; d.vy = 0; d.grounded = true; }

      // Obstacles
      if (s.frame % (60 - Math.min(s.speed * 2, 30)) === 0) {
        const h = 30 + Math.random() * 30;
        s.obstacles.push({ x: 400, y: GROUND_Y - h, w: 20 + Math.random() * 20, h, passed: false });
      }
      s.obstacles.forEach(o => o.x -= s.speed);
      s.obstacles = s.obstacles.filter(o => o.x > -50);

      // Score
      s.obstacles.forEach(o => {
        if (!o.passed && o.x + o.w < d.x) { o.passed = true; setScore(sc => sc + 10); }
      });

      // Speed increase
      if (s.frame % 500 === 0) s.speed = Math.min(s.speed + 0.5, 15);

      // Collision
      for (const o of s.obstacles) {
        if (d.x < o.x + o.w && d.x + d.w > o.x && d.y + d.h > o.y && d.y < o.y + o.h) {
          setGameState('over'); setBest(bs => { if (score > bs) { localStorage.setItem('dino-best', String(score)); return score; } return bs; });
          onGameOver?.(score);
        }
      }

      // Draw
      ctx.fillStyle = '#f5f5dc'; ctx.fillRect(0, 0, 400, 400);
      // Ground
      ctx.fillStyle = '#333'; ctx.fillRect(0, GROUND_Y, 400, 50);
      // Dino
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(d.x, d.y, d.w, d.h);
      ctx.fillStyle = '#16a34a';
      ctx.fillRect(d.x + d.w, d.y + 10, 10, 10); // eye
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(d.x + 5, d.y + d.h, 8, 5); // leg
      // Obstacles
      s.obstacles.forEach(o => {
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(o.x, o.y, o.w, o.h);
        ctx.fillStyle = '#fca5a5';
        ctx.fillRect(o.x + 2, o.y + 2, o.w - 4, 4);
      });
      ctx.fillStyle = '#333'; ctx.font = 'bold 16px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText(`Score: ${score}`, 10, 25);

      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [gameState, score, best, onGameOver]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-6 mb-4 p-4 bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border">
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Score</p><p className="text-2xl font-bold text-primary-600">{score}</p></div>
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Best</p><p className="text-2xl font-bold text-yellow-600">{best}</p></div>
        {gameState === 'idle' && <button onClick={reset} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Run!</button>}
        {gameState === 'over' && <button onClick={reset} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Run Again</button>}
      </div>
      <canvas ref={canvasRef} onClick={jump} className="rounded-xl shadow-lg border-4 border-gray-800 cursor-pointer" />
      <p className="mt-3 text-sm text-gray-500">Space / Click to jump • Avoid red obstacles!</p>
    </div>
  );
}

// ─── Card Game: Blackjack ───────────────────────────────────────────────

function BlackjackGame({ onGameOver }: { onGameOver?: (score: number) => void }) {
  const SUITS = ['♠','♥','♦','♣'];
  const RANKS = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
  const [deck, setDeck] = useState<({suit:string,rank:string,value:number})[]>([]);
  const [playerHand, setPlayerHand] = useState<({suit:string,rank:string,value:number})[]>([]);
  const [dealerHand, setDealerHand] = useState<({suit:string,rank:string,value:number})[]>([]);
  const [gameState, setGameState] = useState<'idle'|'playing'|'over'>('idle');
  const [result, setResult] = useState('');
  const [balance, setBalance] = useState;
  const [bet, setBet] = useState(50);

  const createDeck = () => {
    const d: typeof deck = [];
    for (const suit of SUITS) for (const rank of RANKS) {
      let value = parseInt(rank) || 10;
      if (rank === 'A') value = 11;
      d.push({ suit, rank, value });
    }
    return d.sort(() => Math.random() - 0.5);
  };

  const calc = (hand: typeof playerHand) => {
    let sum = hand.reduce((a, c) => a + c.value, 0);
    const aces = hand.filter(c => c.rank === 'A').length;
    while (sum > 21 && aces > 0) { sum -= 10; }
    return sum;
  };

  const start = () => {
    if (balance < bet) { setResult('Not enough balance!'); return; }
    const d = createDeck();
    setDeck(d);
    setPlayerHand([d[0], d[1]]);
    setDealerHand([d[2], d[3]]);
    setBalance(b => b - bet);
    setGameState('playing'); setResult('');
  };

  const hit = () => {
    const d = [...deck];
    const card = d[playerHand.length + dealerHand.length + 2];
    const newHand = [...playerHand, card];
    setPlayerHand(newHand);
    setDeck(d);
    if (calc(newHand) > 21) { setResult(`Bust! Dealer wins. You had ${calc(newHand)}`); setGameState('over'); onGameOver?.(0); }
  };

  const stand = () => {
    let dealer = [...dealerHand];
    const d = [...deck];
    let idx = playerHand.length + dealerHand.length + 2;
    while (calc(dealer) < 17) { dealer.push(d[idx]); idx++; }
    setDealerHand(dealer); setDeck(d);
    const pSum = calc(playerHand), dSum = calc(dealer);
    if (dSum > 21) { setResult(`Dealer busts! You win!`); setBalance(b => b + bet * 2); }
    else if (pSum > dSum) { setResult(`You win! ${pSum} vs ${dSum}`); setBalance(b => b + bet * 2); }
    else if (pSum < dSum) { setResult(`Dealer wins. ${pSum} vs ${dSum}`); }
    else { setResult(`Push! ${pSum} vs ${dSum}`); setBalance(b => b + bet); }
    setGameState('over');
    onGameOver?.(pSum > dSum ? bet * 2 : 0);
  };

  const renderCard = (card: typeof playerHand[0], hidden = false) => {
    if (hidden) return <div className="w-10 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center text-white text-lg shadow-md">🎴</div>;
    const red = card.suit === '♥' || card.suit === '♦';
    return (
      <div className={`w-10 h-14 bg-white rounded-lg flex flex-col items-center justify-center text-sm font-bold shadow-md ${red ? 'text-red-600' : 'text-gray-800'}`}>
        <span>{card.rank}</span><span className="text-lg leading-none">{card.suit}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-6 mb-4 p-4 bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border">
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Balance</p><p className="text-2xl font-bold text-green-600">${balance}</p></div>
        <div className="text-center"><p className="text-xs text-gray-500 uppercase">Bet</p>
          <select value={bet} onChange={e => setBet(Number(e.target.value))} className="text-lg font-bold border rounded px-2">
            <option value="10">10</option><option value="25">25</option><option value="50">50</option><option value="100">100</option><option value="500">500</option>
          </select>
        </div>
        {gameState === 'idle' && <button onClick={start} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Deal</button>}
      </div>
      <div className="card p-6 w-full max-w-lg">
        {result && <p className="text-center text-lg font-bold mb-4 text-primary-600">{result}</p>}
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-1">Dealer ({gameState === 'playing' ? '??' : calc(dealerHand)})</p>
          <div className="flex gap-1.5">{dealerHand.map((c, i) => renderCard(c, gameState === 'playing' && i === 0))}</div>
        </div>
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-1">You ({calc(playerHand)})</p>
          <div className="flex gap-1.5">{playerHand.map(c => renderCard(c))}</div>
        </div>
        {gameState === 'playing' && (
          <div className="flex gap-3 justify-center">
            <button onClick={hit} className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">Hit</button>
            <button onClick={stand} className="px-6 py-2 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700">Stand</button>
          </div>
        )}
        {gameState === 'over' && <button onClick={start} className="w-full mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700">New Hand</button>}
      </div>
    </div>
  );
}
