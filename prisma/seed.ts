import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Categories
  const categories = [
    { name: 'Technology', slug: 'technology', icon: '💻', color: '#3b82f6', description: 'Tech news, tutorials, and reviews' },
    { name: 'Lifestyle', slug: 'lifestyle', icon: '🌟', color: '#ec4899', description: 'Lifestyle tips and trends' },
    { name: 'Education', slug: 'education', icon: '📚', color: '#10b981', description: 'Learning and study tips' },
    { name: 'Finance', slug: 'finance', icon: '💰', color: '#f59e0b', description: 'Money, investing, and saving' },
    { name: 'Entertainment', slug: 'entertainment', icon: '🎬', color: '#8b5cf6', description: 'Movies, music, celebrities' },
    { name: 'Health', slug: 'health', icon: '🏥', color: '#ef4444', description: 'Health, fitness, and wellness' },
    { name: 'Travel', slug: 'travel', icon: '✈️', color: '#06b6d4', description: 'Travel destinations and tips' },
    { name: 'Food', slug: 'food', icon: '🍳', color: '#f97316', description: 'Recipes and food guides' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log(`✅ Seeded ${categories.length} categories`);

  // Games
  const games = [
    { name: 'Minesweeper', slug: 'minesweeper', category: 'PUZZLE', description: 'Classic minesweeper game. Find all the mines without exploding!', icon: '💣', instructions: 'Left-click to reveal a cell. Right-click to flag a mine.' },
    { name: 'Sudoku', slug: 'sudoku', category: 'PUZZLE', description: 'Fill the 9x9 grid with digits so each column, row, and 3x3 subgrid contains 1-9.', icon: '🔢', instructions: 'Click a cell and select a number from 1-9.' },
    { name: 'Snake', slug: 'snake', category: 'ARCADE', description: 'Classic snake game. Eat food to grow longer. Avoid walls and yourself!', icon: '🐍', instructions: 'Use arrow keys to move the snake.' },
    { name: '2048', slug: '2048', category: 'PUZZLE', description: 'Join the tiles, get to 2048!', icon: '🎯', instructions: 'Use arrow keys to move tiles.' },
    { name: 'Tic-Tac-Toe', slug: 'tic-tac-toe', category: 'ARCADE', description: 'Classic X & O game.', icon: '⭕', instructions: 'Click a cell to place your mark.' },
    { name: 'Memory Cards', slug: 'memory-cards', category: 'PUZZLE', description: 'Match pairs of cards by remembering their positions.', icon: '🃏', instructions: 'Click cards to flip them.' },
    { name: 'Word Scramble', slug: 'word-scramble', category: 'WORD', description: 'Unscramble the letters to form a word.', icon: '📝', instructions: 'Rearrange the letters to spell the word.' },
    { name: 'Hangman', slug: 'hangman', category: 'WORD', description: 'Guess the word before the man is hanged!', icon: '🪢', instructions: 'Guess letters one at a time.' },
    { name: 'Typing Speed Test', slug: 'typing-speed', category: 'WORD', description: 'Test your typing speed in words per minute (WPM).', icon: '⌨️', instructions: 'Type the displayed text as fast as you can.' },
    { name: 'Crossword', slug: 'crossword', category: 'PUZZLE', description: 'Solve the crossword puzzle.', icon: '📰', instructions: 'Click a cell and type your answer.' },
  ];

  for (const game of games) {
    const { instructions, ...gameData } = game as any;
    await prisma.game.upsert({
      where: { slug: game.slug },
      update: {},
      create: gameData,
    });
  }
  console.log(`✅ Seeded ${games.length} games`);

  // Tools
  const tools = [
    { name: 'BMI Calculator', slug: 'bmi-calculator', category: 'Calculators', icon: '⚖️', route: '/tools/bmi-calculator' },
    { name: 'Age Calculator', slug: 'age-calculator', category: 'Calculators', icon: '🎂', route: '/tools/age-calculator' },
    { name: 'Percentage Calculator', slug: 'percentage-calculator', category: 'Calculators', icon: '%', route: '/tools/percentage-calculator' },
    { name: 'EMI Calculator', slug: 'emi-calculator', category: 'Calculators', icon: '🏦', route: '/tools/emi-calculator' },
    { name: 'QR Code Generator', slug: 'qr-code-generator', category: 'Dev Tools', icon: '📱', route: '/tools/qr-code-generator' },
    { name: 'Password Generator', slug: 'password-generator', category: 'Text Tools', icon: '🔒', route: '/tools/password-generator' },
    { name: 'Word Counter', slug: 'word-counter', category: 'Text Tools', icon: '📝', route: '/tools/word-counter' },
  ];

  for (const tool of tools) {
    await prisma.tool.upsert({
      where: { slug: tool.slug },
      update: {},
      create: tool,
    });
  }
  console.log(`✅ Seeded ${tools.length} tools`);

  // Forums
  const forums = [
    { name: 'General Discussion', slug: 'general', description: 'Talk about anything', icon: '💬' },
    { name: 'Technology', slug: 'technology', description: 'Tech discussions', icon: '💻' },
    { name: 'Help & Support', slug: 'help', description: 'Ask for help', icon: '❓' },
    { name: 'Feedback & Suggestions', slug: 'feedback', description: 'Share your thoughts', icon: '💡' },
  ];

  for (const forum of forums) {
    await prisma.forum.upsert({
      where: { slug: forum.slug },
      update: {},
      create: forum,
    });
  }
  console.log(`✅ Seeded ${forums.length} forums`);

  // Tags
  const tags = ['AI', 'Web Development', 'JavaScript', 'TypeScript', 'Health', 'Money', 'Productivity', 'Travel', 'Food', 'Lifestyle'];
  for (const name of tags) {
    await prisma.tag.upsert({
      where: { slug: name.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: { name, slug: name.toLowerCase().replace(/\s+/g, '-') },
    });
  }
  console.log(`✅ Seeded ${tags.length} tags`);

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
