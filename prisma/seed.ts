import { PrismaClient } from '@prisma/client';
import fs from 'node:fs';
import path from 'node:path';
import { parseContent } from '../src/lib/content-parser';
import { additionalOfficialJobs, expansionJobs, expansionPosts } from './expanded-content';

const prisma = new PrismaClient();

type SourceBlog = {
  title: string;
  metaDescription: string;
  slug: string;
  keywords: string;
  category: string;
  author: string;
  date: string;
  status: string;
  body: string;
};

type SourceNewsBlog = {
  title: string;
  metaDescription: string;
  slug: string;
  author: string;
  date: string;
  body: string;
};

function parseSourceBlogs(source: string): SourceBlog[] {
  const blocks = source
    .split(/(?=^BLOG POST #\d+:)/m)
    .map(block => block.trim())
    .filter(block => /^BLOG POST #\d+:/.test(block));

  return blocks.map((block, index) => {
    const lines = block.split(/\r?\n/);
    const openingDelimiter = lines.findIndex((line, lineIndex) => line.trim() === '---' && lineIndex > 0);
    const closingDelimiter = lines.findIndex((line, lineIndex) => line.trim() === '---' && lineIndex > openingDelimiter);

    if (openingDelimiter < 0 || closingDelimiter < 0) {
      throw new Error(`Blog ${index + 1} is missing valid frontmatter delimiters`);
    }

    const metadata: Record<string, string> = {};
    for (const line of lines.slice(openingDelimiter + 1, closingDelimiter)) {
      const separator = line.indexOf(':');
      if (separator < 0) continue;
      const key = line.slice(0, separator).trim();
      const value = line.slice(separator + 1).trim().replace(/^"(.*)"$/, '$1');
      metadata[key] = value;
    }

    const requiredFields = ['title', 'meta_description', 'slug', 'keywords', 'category', 'author', 'date', 'status'];
    for (const field of requiredFields) {
      if (!metadata[field]) {
        throw new Error(`Blog ${index + 1} is missing frontmatter field "${field}"`);
      }
    }

    const bodyLines = lines.slice(closingDelimiter + 1);
    const endMarker = bodyLines.findIndex(line => /^END OF BLOG POST #\d+/.test(line.trim()));
    const articleLines = endMarker >= 0 ? bodyLines.slice(0, endMarker) : bodyLines;
    const body = articleLines.join('\n').trim();
    if (!body) throw new Error(`Blog ${index + 1} has no article body`);

    return {
      title: metadata.title,
      metaDescription: metadata.meta_description,
      slug: metadata.slug,
      keywords: metadata.keywords,
      category: metadata.category,
      author: metadata.author,
      date: metadata.date,
      status: metadata.status,
      body,
    };
  });
}

function parseSourceNewsBlogs(source: string): SourceNewsBlog[] {
  return source
    .split(/(?=^NEWS BLOG #\d+:)/m)
    .map(block => block.trim())
    .filter(block => /^NEWS BLOG #\d+:/.test(block))
    .map((block, index) => {
      const lines = block.split(/\r?\n/);
      const heading = lines.find(line => /^#{1,6}\s+/.test(line))?.replace(/^#{1,6}\s+/, '').trim();
      const title = lines.find(line => line.startsWith('title:'))?.slice(6).trim().replace(/^"(.*)"$/, '$1') || heading;
      const metaDescription = lines.find(line => line.startsWith('meta_description:'))?.slice(17).trim().replace(/^"(.*)"$/, '$1') || 'Source-cited news and analysis from Blog-Ghar.';
      const slug = lines.find(line => line.startsWith('slug:'))?.slice(5).trim() || `news-corpus-${index + 1}`;
      const author = lines.find(line => line.startsWith('author:'))?.slice(7).trim() || 'Blog-Ghar Editorial';
      const date = lines.find(line => line.startsWith('date:'))?.slice(5).trim() || '2026-09-03';
      const bodyStart = lines.findIndex(line => /^#{1,6}\s+/.test(line));
      const body = bodyStart >= 0
        ? lines.slice(bodyStart).join('\n').replace(/\n---[\s\S]*$/, '').trim()
        : `## Source report\n\n${title || `News report ${index + 1}`}\n\n${metaDescription}`;
      if (!title || !slug) throw new Error(`News blog ${index + 1} is missing a usable title`);
      return { title, metaDescription, slug, author, date, body };
    });
}

function categorySlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function main() {
  console.log('🌱 Seeding database...');

  // Categories
  const categories = [
    { name: 'Technology', slug: 'technology', icon: '💻', color: '#3b82f6', description: 'Tech news, tutorials, reviews, AI, programming' },
    { name: 'Lifestyle', slug: 'lifestyle', icon: '🌟', color: '#ec4899', description: 'Lifestyle tips, trends, wellness, self-improvement' },
    { name: 'Education', slug: 'education', icon: '📚', color: '#10b981', description: 'Learning, study tips, courses, exams' },
    { name: 'Finance', slug: 'finance', icon: '💰', color: '#f59e0b', description: 'Money, investing, saving, taxes, crypto' },
    { name: 'Entertainment', slug: 'entertainment', icon: '🎬', color: '#8b5cf6', description: 'Movies, music, games, celebrities, reviews' },
    { name: 'Health', slug: 'health', icon: '🏥', color: '#ef4444', description: 'Health, fitness, nutrition, medical tips' },
    { name: 'Travel', slug: 'travel', icon: '✈️', color: '#06b6d4', description: 'Travel destinations, guides, tips' },
    { name: 'Food', slug: 'food', icon: '🍳', color: '#f97316', description: 'Recipes, cooking, food guides, restaurants' },
    { name: 'Sports', slug: 'sports', icon: '⚽', color: '#14b8a6', description: 'Sports news, scores, analysis' },
    { name: 'Science', slug: 'science', icon: '🔬', color: '#6366f1', description: 'Scientific discoveries, space, research' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log(`✅ Seeded ${categories.length} categories`);

  // Games - 21 total with variety
  const games = [
    // Puzzle
    { name: 'Sudoku', slug: 'sudoku', category: 'PUZZLE', description: 'Classic number puzzle. Fill the 9x9 grid with digits 1-9. Multiple difficulty levels.', icon: '🔢', difficulty: 'MEDIUM', players: '1', tags: 'logic,numbers,puzzle', playCount: 0 },
    { name: '2048', slug: '2048', category: 'PUZZLE', description: 'Slide and merge numbered tiles to reach 2048! Addictive puzzle game.', icon: '🎯', difficulty: 'EASY', players: '1', tags: 'numbers,merge,puzzle', playCount: 0 },
    { name: 'Memory Cards', slug: 'memory-cards', category: 'PUZZLE', description: 'Match pairs of cards. Test your memory with increasing difficulty.', icon: '🃏', difficulty: 'EASY', players: '1', tags: 'memory,matching,puzzle', playCount: 0 },
    { name: 'Crossword', slug: 'crossword', category: 'PUZZLE', description: 'Solve crossword puzzles. Tech-themed clues and answers.', icon: '📰', difficulty: 'HARD', players: '1', tags: 'words,vocabulary,puzzle', playCount: 0 },
    // Arcade
    { name: 'Snake', slug: 'snake', category: 'ARCADE', description: 'Classic snake game. Eat food, grow longer, avoid walls and yourself!', icon: '🐍', difficulty: 'EASY', players: '1', tags: 'classic,arcade,retro', playCount: 0 },
    { name: 'Flappy Bird', slug: 'flappy-bird', category: 'ARCADE', description: 'Tap to fly through pipes. How far can you go? Simple but addictive!', icon: '🐦', difficulty: 'HARD', players: '1', tags: 'tap,arcade,classic', playCount: 0 },
    { name: 'Breakout', slug: 'breakout', category: 'ARCADE', description: 'Break all the bricks with your ball and paddle. Multiple levels and power-ups!', icon: '🧱', difficulty: 'MEDIUM', players: '1', tags: 'bricks,arcade,classic', playCount: 0 },
    { name: 'Pac Maze', slug: 'pac-maze', category: 'ARCADE', description: 'Navigate the maze, collect dots, avoid ghosts! Classic arcade action.', icon: '👻', difficulty: 'MEDIUM', players: '1', tags: 'maze,arcade,classic', playCount: 0 },
    // Word
    { name: 'Word Scramble', slug: 'word-scramble', category: 'WORD', description: 'Unscramble letters to form words. Great vocabulary builder!', icon: '📝', difficulty: 'EASY', players: '1', tags: 'words,vocabulary,spelling', playCount: 0 },
    { name: 'Hangman', slug: 'hangman', category: 'WORD', description: 'Guess the word before the drawing completes. Tech-themed words!', icon: '🪢', difficulty: 'MEDIUM', players: '1', tags: 'words,guessing,classic', playCount: 0 },
    { name: 'Typing Speed Test', slug: 'typing-speed', category: 'WORD', description: 'Test your typing speed. See your WPM and accuracy in real-time!', icon: '⌨️', difficulty: 'EASY', players: '1', tags: 'typing,speed,keyboard', playCount: 0 },
    // Board
    { name: 'Tic-Tac-Toe', slug: 'tic-tac-toe', category: 'BOARD', description: 'Classic X and O game. Play vs AI or friend!', icon: '⭕', difficulty: 'EASY', players: '1-2', tags: 'classic,strategy,board', playCount: 0 },
    { name: 'Chess', slug: 'chess', category: 'BOARD', description: 'The classic strategy game. Play against AI or a friend locally.', icon: '♟️', difficulty: 'HARD', players: '1-2', tags: 'strategy,classic,board', playCount: 0 },
    { name: 'Dice Game', slug: 'dice-game', category: 'BOARD', description: 'Roll dice and score points! Multiple game modes for 1-4 players.', icon: '🎲', difficulty: 'EASY', players: '1-4', tags: 'dice,luck,multiplayer', playCount: 0 },
    { name: 'Rock Paper Scissors', slug: 'rock-paper-scissors', category: 'BOARD', description: 'Classic hand game. Beat the AI or challenge a friend!', icon: '✌️', difficulty: 'EASY', players: '1-2', tags: 'classic,luck,quick', playCount: 0 },
    // Quiz
    { name: 'Trivia Quiz', slug: 'trivia', category: 'QUIZ', description: 'Test your knowledge with 15 questions across various topics. 15-second timer!', icon: '❓', difficulty: 'MEDIUM', players: '1', tags: 'quiz,knowledge,trivia', playCount: 0 },
    { name: 'Math Challenge', slug: 'math-challenge', category: 'QUIZ', description: 'Solve math problems against the clock. How many can you get right?', icon: '🔢', difficulty: 'MEDIUM', players: '1', tags: 'math,numbers,quiz', playCount: 0 },
    // Memory
    { name: 'Memory Sequence', slug: 'memory-sequence', category: 'PUZZLE', description: 'Simon says! Remember and repeat the growing sequence of colors.', icon: '🎵', difficulty: 'MEDIUM', players: '1', tags: 'memory,sequence,colors', playCount: 0 },
    { name: 'Color Match', slug: 'color-match', category: 'ARCADE', description: 'Match the color name as fast as you can! Stroop effect challenge.', icon: '🎨', difficulty: 'EASY', players: '1', tags: 'colors,reflex,speed', playCount: 0 },
    { name: 'Number Chain', slug: 'number-chain', category: 'PUZZLE', description: 'Connect numbers 1-25 in order as fast as possible!', icon: '🔗', difficulty: 'MEDIUM', players: '1', tags: 'numbers,speed,puzzle', playCount: 0 },
  ];

  for (const game of games) {
    const { instructions, ...gameData } = game as any;
    await prisma.game.upsert({
      where: { slug: game.slug },
      update: { playCount: game.playCount },
      create: gameData,
    });
  }
  console.log(`✅ Seeded ${games.length} games`);

  // Tools
  const tools = [
    { name: 'BMI Calculator', slug: 'bmi-calculator', category: 'Calculators', icon: '⚖️', route: '/tools/bmi-calculator' },
    { name: 'Age Calculator', slug: 'age-calculator', category: 'Calculators', icon: '🎂', route: '/tools/age-calculator' },
    { name: 'Percentage Calculator', slug: 'percentage-calculator', category: 'Calculators', icon: '%', route: '/tools/percentage-calculator' },
    { name: 'EMI Calculator', slug: 'emi-calculator', category: 'Finance', icon: '🏦', route: '/tools/emi-calculator' },
    { name: 'GST Calculator', slug: 'gst-calculator', category: 'Finance', icon: '🧾', route: '/tools/gst-calculator' },
    { name: 'QR Code Generator', slug: 'qr-code-generator', category: 'Dev Tools', icon: '📱', route: '/tools/qr-code-generator' },
    { name: 'Password Generator', slug: 'password-generator', category: 'Security', icon: '🔒', route: '/tools/password-generator' },
    { name: 'Word Counter', slug: 'word-counter', category: 'Text Tools', icon: '📝', route: '/tools/word-counter' },
    { name: 'Unit Converter', slug: 'unit-converter', category: 'Converters', icon: '🔄', route: '/tools/unit-converter' },
    { name: 'Image Compressor', slug: 'image-compressor', category: 'Image Tools', icon: '🖼️', route: '/tools/image-compressor' },
    { name: 'Color Picker', slug: 'color-picker', category: 'Dev Tools', icon: '🎨', route: '/tools/color-picker' },
    { name: 'Case Converter', slug: 'case-converter', category: 'Text Tools', icon: 'Aa', route: '/tools/case-converter' },
    { name: 'Lorem Ipsum Generator', slug: 'lorem-ipsum', category: 'Text Tools', icon: '📄', route: '/tools/lorem-ipsum' },
    { name: 'URL Encoder/Decoder', slug: 'url-encoder', category: 'Dev Tools', icon: '🔗', route: '/tools/url-encoder' },
    { name: 'Hash Generator', slug: 'hash-generator', category: 'Security', icon: '#️⃣', route: '/tools/hash-generator' },
    { name: 'Meta Tag Generator', slug: 'meta-tag-generator', category: 'SEO Tools', icon: '🏷️', route: '/tools/meta-tag-generator' },
    { name: 'Invoice Generator', slug: 'invoice-generator', category: 'Business', icon: '🧾', route: '/tools/invoice-generator' },
    { name: 'Resume Builder', slug: 'resume-builder', category: 'Business', icon: '📋', route: '/tools/resume-builder' },
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
    { name: 'General Discussion', slug: 'general', description: 'Talk about anything and everything', icon: '💬' },
    { name: 'Technology', slug: 'technology', description: 'Tech discussions, news, and help', icon: '💻' },
    { name: 'Gaming', slug: 'gaming', description: 'Gaming discussions, tips, and strategies', icon: '🎮' },
    { name: 'Help & Support', slug: 'help', description: 'Ask for help with anything', icon: '❓' },
    { name: 'Feedback & Suggestions', slug: 'feedback', description: 'Share your feedback and ideas', icon: '💡' },
    { name: 'Career & Jobs', slug: 'career', description: 'Career advice, job postings, interviews', icon: '💼' },
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
  const tags = [
    'AI', 'Web Development', 'JavaScript', 'TypeScript', 'React', 'Next.js',
    'Health', 'Money', 'Productivity', 'Travel', 'Food', 'Lifestyle',
    'Programming', 'Tutorial', 'Guide', 'Tips', 'How To', 'Review',
    'Crypto', 'Investment', 'Fitness', 'Recipe', 'DIY', 'Career',
    'Data Science', 'Cloud', 'Cybersecurity', 'Mobile', 'Design',
  ];
  for (const name of tags) {
    await prisma.tag.upsert({
      where: { slug: name.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: { name, slug: name.toLowerCase().replace(/\s+/g, '-') },
    });
  }
  console.log(`✅ Seeded ${tags.length} tags`);

  // News Categories
  const newsCategories = [
    { name: 'Technology', slug: 'technology' },
    { name: 'World', slug: 'world' },
    { name: 'Business', slug: 'business' },
    { name: 'Sports', slug: 'sports' },
    { name: 'Entertainment', slug: 'entertainment' },
    { name: 'Health', slug: 'health' },
    { name: 'Science', slug: 'science' },
  ];

  for (const nc of newsCategories) {
    await prisma.newsCategory.upsert({
      where: { slug: nc.slug },
      update: {},
      create: nc,
    });
  }
  console.log(`✅ Seeded ${newsCategories.length} news categories`);

  const blogsFile = path.join(process.cwd(), 'Blogs.txt');
  if (!fs.existsSync(blogsFile)) {
    throw new Error(`Required blog source file not found: ${blogsFile}`);
  }

  const sourceBlogs = parseSourceBlogs(fs.readFileSync(blogsFile, 'utf-8'));
  const authors = new Map<string, string>();
  let addedBlogs = 0;
  let updatedBlogs = 0;

  for (const blog of sourceBlogs) {
    const category = await prisma.category.upsert({
      where: { slug: categorySlug(blog.category) },
      update: {},
      create: {
        name: blog.category,
        slug: categorySlug(blog.category),
        description: `${blog.category} articles and guides`,
      },
    });

    let authorId = authors.get(blog.author);
    if (!authorId) {
      const author = await prisma.user.upsert({
        where: { email: `${categorySlug(blog.author)}@bloghar.com` },
        update: { name: blog.author },
        create: {
          id: `seed-author-${categorySlug(blog.author)}`,
          name: blog.author,
          email: `${categorySlug(blog.author)}@bloghar.com`,
          role: 'AUTHOR',
        },
      });
      authorId = author.id;
      authors.set(blog.author, authorId);
    }

    const parsed = parseContent(blog.body);
    const publishedAt = new Date(`${blog.date}T00:00:00.000Z`);
    if (Number.isNaN(publishedAt.getTime())) {
      throw new Error(`Blog "${blog.slug}" has an invalid date: ${blog.date}`);
    }

    const keyword = blog.keywords.split(',')[0].trim();
    const tag = await prisma.tag.upsert({
      where: { slug: categorySlug(keyword) },
      update: { name: keyword },
      create: { name: keyword, slug: categorySlug(keyword) },
    });

    const postData = {
      title: blog.title,
      content: parsed.content,
      excerpt: blog.metaDescription,
      postType: 'BLOG',
      status: blog.status.toUpperCase(),
      categoryId: category.id,
      authorId,
      tagId: tag.id,
      focusKeyword: blog.keywords,
      seoTitle: blog.title,
      seoDesc: blog.metaDescription,
      readTime: parsed.readTime,
      publishedAt: blog.status.toLowerCase() === 'published' ? publishedAt : null,
    };

    const existing = await prisma.post.findUnique({ where: { slug: blog.slug }, select: { id: true } });
    await prisma.post.upsert({
      where: { slug: blog.slug },
      update: postData,
      create: { slug: blog.slug, ...postData },
    });
    if (existing) updatedBlogs++;
    else addedBlogs++;
  }

  console.log(`✅ Imported ${sourceBlogs.length} blogs from Blogs.txt (${addedBlogs} added, ${updatedBlogs} updated)`);

  const expansionAuthor = await prisma.user.upsert({
    where: { email: 'editorial@bloghar.com' },
    update: { name: 'Blog-Ghar Editorial' },
    create: { id: 'seed-author-editorial', name: 'Blog-Ghar Editorial', email: 'editorial@bloghar.com', role: 'AUTHOR' },
  });

  for (const blog of expansionPosts) {
    const category = await prisma.category.upsert({
      where: { slug: categorySlug(blog.category) },
      update: {},
      create: { name: blog.category, slug: categorySlug(blog.category), description: `${blog.category} articles and guides` },
    });
    const tag = await prisma.tag.upsert({
      where: { slug: categorySlug(blog.focusKeyword) },
      update: { name: blog.focusKeyword },
      create: { name: blog.focusKeyword, slug: categorySlug(blog.focusKeyword) },
    });
    const parsed = parseContent(blog.body);
    await prisma.post.upsert({
      where: { slug: blog.slug },
      update: {
        title: blog.title,
        content: parsed.content,
        excerpt: blog.excerpt,
        postType: 'BLOG',
        status: 'PUBLISHED',
        categoryId: category.id,
        authorId: expansionAuthor.id,
        tagId: tag.id,
        focusKeyword: blog.focusKeyword,
        seoTitle: blog.title,
        seoDesc: blog.excerpt,
        readTime: parsed.readTime,
        publishedAt: new Date('2026-09-03T00:00:00.000Z'),
      },
      create: {
        slug: blog.slug,
        title: blog.title,
        content: parsed.content,
        excerpt: blog.excerpt,
        postType: 'BLOG',
        status: 'PUBLISHED',
        categoryId: category.id,
        authorId: expansionAuthor.id,
        tagId: tag.id,
        focusKeyword: blog.focusKeyword,
        seoTitle: blog.title,
        seoDesc: blog.excerpt,
        readTime: parsed.readTime,
        publishedAt: new Date('2026-09-03T00:00:00.000Z'),
      },
    });
  }
  console.log(`✅ Imported ${expansionPosts.length} source-linked expansion blogs`);

  const newsFile = path.join(process.cwd(), 'news_all_unique_complete.txt');
  if (fs.existsSync(newsFile)) {
    const newsCategory = await prisma.category.upsert({
      where: { slug: 'verified-news' },
      update: {},
      create: { name: 'Verified News', slug: 'verified-news', description: 'Source-cited news and analysis' },
    });
    const newsBlogs = parseSourceNewsBlogs(fs.readFileSync(newsFile, 'utf-8'));
    for (const news of newsBlogs) {
      const parsed = parseContent(news.body);
      await prisma.post.upsert({
        where: { slug: news.slug },
        update: {
          title: news.title,
          content: parsed.content,
          excerpt: news.metaDescription,
          postType: 'BLOG',
          status: 'PUBLISHED',
          categoryId: newsCategory.id,
          authorId: expansionAuthor.id,
          focusKeyword: news.title,
          seoTitle: news.title,
          seoDesc: news.metaDescription,
          readTime: parsed.readTime,
          publishedAt: new Date(`${news.date}T00:00:00.000Z`),
        },
        create: {
          slug: news.slug,
          title: news.title,
          content: parsed.content,
          excerpt: news.metaDescription,
          postType: 'BLOG',
          status: 'PUBLISHED',
          categoryId: newsCategory.id,
          authorId: expansionAuthor.id,
          focusKeyword: news.title,
          seoTitle: news.title,
          seoDesc: news.metaDescription,
          readTime: parsed.readTime,
          publishedAt: new Date(`${news.date}T00:00:00.000Z`),
        },
      });
    }
    console.log(`✅ Imported ${newsBlogs.length} source-cited news blogs`);
  }

  for (const job of [...expansionJobs, ...additionalOfficialJobs]) {
    const { category: categoryName, isRemote: _isRemote, ...jobData } = job;
    const { isRemote, ...safeJobData } = jobData as Record<string, unknown>;
    const category = await prisma.category.upsert({
      where: { slug: categorySlug(categoryName) },
      update: {},
      create: { name: categoryName, slug: categorySlug(categoryName), description: `${categoryName} opportunities` },
    });
    await prisma.jobListing.upsert({
      where: { id: `seed-job-${categorySlug(job.company)}-${categorySlug(job.title)}` },
      update: { ...safeJobData, categoryId: category.id, postedAt: new Date('2026-09-03T00:00:00.000Z'), isActive: true },
      create: { id: `seed-job-${categorySlug(job.company)}-${categorySlug(job.title)}`, ...safeJobData, categoryId: category.id, postedAt: new Date('2026-09-03T00:00:00.000Z'), isActive: true },
    });
  }
  console.log(`✅ Imported ${expansionJobs.length + additionalOfficialJobs.length} official job-board links`);

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
