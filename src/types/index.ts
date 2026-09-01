export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featuredImage: string | null;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  views: number;
  likes: number;
  readingTime: number | null;
  seoTitle: string | null;
  seoDesc: string | null;
  focusKeyword: string | null;
  isFeatured: boolean;
  isSponsored: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
  category: {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
    color: string | null;
  };
  tags: { tag: { id: string; name: string; slug: string } }[];
  _count: {
    comments: number;
    likes: number;
    bookmarks: number;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  _count?: { posts: number };
}

export interface Comment {
  id: string;
  content: string;
  likes: number;
  isApproved: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  replies?: Comment[];
  _count: { replies: number };
}

export interface Game {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: 'PUZZLE' | 'QUIZ' | 'WORD' | 'ARCADE';
  icon: string | null;
  instructions: string | null;
  isActive: boolean;
  playCount: number;
  _count: { scores: number };
}

export interface GameScore {
  id: string;
  score: number;
  metadata: string | null;
  playedAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  summary: string | null;
  imageUrl: string | null;
  source: string;
  sourceUrl: string | null;
  isBreaking: boolean;
  isTrending: boolean;
  publishedAt: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  icon: string | null;
  route: string;
}

export interface Quiz {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  questions: Question[];
  timeLimit: number | null;
  playCount: number;
  category?: { id: string; name: string; slug: string };
}

export interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  views: number;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  forum: {
    id: string;
    name: string;
    slug: string;
  };
  _count: { replies: number };
}

export interface QnAQuestion {
  id: string;
  title: string;
  content: string;
  views: number;
  votes: number;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  answers: {
    id: string;
    content: string;
    votes: number;
    isAccepted: boolean;
    user: {
      id: string;
      name: string | null;
      image: string | null;
    };
  }[];
  tags: string[];
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string | null;
  salary: string | null;
  applyUrl: string | null;
  isRemote: boolean;
  isActive: boolean;
  postedAt: string;
  expiresAt: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
  bio: string | null;
  createdAt: string;
  _count: {
    posts: number;
    comments: number;
    gameScores: number;
  };
}

export interface SearchResult {
  type: 'post' | 'game' | 'tool' | 'news' | 'quiz';
  title: string;
  slug: string;
  description: string;
  url: string;
}
