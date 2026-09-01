# Blog-Ghar Platform — Design Specification

**Date:** 2026-09-01  
**Status:** Draft — awaiting user approval  
**Author:** Claude Code (Anthropic)

---

## 1. Overview

Blog-Ghar ("Home of Blogs") is a multi-niche SaaS content + gaming + tools platform built for maximum organic traffic, user engagement, and AdSense monetization. It serves as a one-stop destination: users come for one feature (a game, a calculator, a quiz) and discover and consume the rest (blogs, news, horoscopes, forums). This "discovery flywheel" drives high dwell time, repeat visits, and massive organic traffic.

### Core Goals
- Attract 10,000+ monthly visitors within 6 months via organic SEO
- Achieve AdSense approval and generate $500+/month revenue within 12 months
- Build a community of engaged users with high session duration
- Provide a fully manageable admin experience for the owner

---

## 2. Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | **Next.js 15** (App Router, TypeScript) | SSR/SSG for SEO, API routes, image optimization, PWA support |
| Database | **PostgreSQL** | Reliable, scalable, great for structured content |
| ORM | **Prisma** | Type-safe queries, migrations, great DX |
| Cache | **Redis** | Game scores, session data, rate limiting, caching |
| Auth | **NextAuth.js v5** | Social + email login, session management |
| File Storage | **Supabase Storage** (free tier) | Images, media uploads |
| Styling | **Tailwind CSS v4 + shadcn/ui** | Fast, consistent, beautiful UI |
| Email | **Resend** | Newsletters, notifications, OTP |
| Analytics | **GA4 + PostHog** | Traffic insights, user behavior |
| Hosting | **Railway.app** (free tier) | Optimal hosting, auto-scaling, built-in PostgreSQL |
| Error Tracking | **Sentry** | Error monitoring in production |

---

## 3. Platform Sections

### 3.1 Homepage (`/`)
Hero banner, category carousels (Tech, Lifestyle, Education, Finance, Entertainment, Health), trending articles, games preview, tools preview, news ticker, newsletter signup, search with autocomplete, dark/light mode toggle, SEO-optimized with structured data.

### 3.2 Blog System (`/blog`)
Multi-category posts with rich text editor, SEO tools (meta tags, focus keyword, readability score, auto-generated schema markup), table of contents, related articles, author profiles, bookmarks, share buttons, nested comments with likes and moderation.

### 3.3 Games Section (`/games`)
**Puzzle:** Sudoku, Sliding Puzzle, Crossword, Jigsaw  
**Quiz:** General Knowledge, Subject-wise, Personality, Trivia  
**Word:** Word Scramble, Word Search, Hangman, Typing Speed Test  
**Arcade:** Snake, 2048, Tic-Tac-Toe, Memory Cards, Minesweeper  
**Features:** Leaderboards per game, game categories, individual SEO-optimized game pages, achievements system

### 3.4 Tools Section (`/tools`)
**Calculators:** BMI, Age, Percentage, EMI/Loan, GST (India), Compound Interest, Date Difference, GPA, Tip, Discount, Time Zone  
**Converters:** Currency, Length, Weight, Temperature, Speed, Area, Volume, Number to Words, Time, Roman Numeral  
**Text Tools:** Word Counter, Character Counter, Case Converter (UPPER/lower/Title/camelCase), Lorem Ipsum Generator, Text Reverser, Remove Duplicates, Find & Replace, Markdown Editor, JSON Formatter, Password Generator, UUID Generator  
**Image Tools:** Image Compressor, QR Code Generator, Color Palette Generator, Image Resizer  
**Other:** Plagiarism Checker, Grammar Checker, Online Notepad, Random Name Picker, Random Number Generator, Spin Wheel, SHA256/MD5 Hash Generator, Base64 Encoder/Decoder

### 3.5 News Section (`/news`)
Curated multi-category news, auto-refresh, trending topics, category filters, search, newsletter-worthy top stories, news ticker on homepage.

### 3.6 Horoscope (`/horoscope`)
Daily horoscope for all 12 zodiac signs, compatibility checker, shareable results.

### 3.7 Fun & Entertainment
Jokes & Memes, Daily Motivation Quotes, Fun Facts of the Day, Birthday Calculator, Love/Name Compatibility, Photo Filters Editor, Wallpaper Gallery.

### 3.8 Community
Discussion Forums (category-wise), Q&A section, polls & surveys, contests & giveaways, user profiles with badges, follow authors.

### 3.9 Jobs (`/jobs`)
Job listings by category, post-a-job form, job applications.

### 3.10 User System
Registration/login (email + Google + GitHub), profile dashboard, avatar & bio, saved/bookmarked content, game score history & achievements, comment history, follow authors, notification settings.

### 3.11 Admin Dashboard (`/admin`)
Dashboard overview (views, users, revenue, top content), content management (blogs, news, games), user management (view, ban, roles), ad management (AdSense codes, ad slots, A/B test placements), SEO tools (sitemap, meta tags, 301 redirects), analytics (traffic sources, engagement), comments moderation, newsletter management, site settings, maintenance mode.

---

## 4. Monetization Strategy

| Source | Details | Expected Monthly (at scale) |
|--------|---------|---------------------------|
| Google AdSense | Strategic ad placements across all pages | $500–$5,000+ |
| Premium "Pro" Subscription | Ad-free experience, exclusive tools, early access | $200–$2,000 |
| Sponsored Content | Labeled sponsored articles | $100–$1,000 |
| Affiliate Links | Relevant product recommendations in articles | $50–$500 |
| Job Board | Employers pay to post listings | $100–$500 |
| Newsletter Sponsorships | Brands sponsor newsletter sends | $50–$300 |
| Total | | **$1,000–$9,300+/month** |

**Ad Placement Strategy:**
- Header banner (728×90)
- Sidebar ads (300×250) on blog posts and tool pages
- In-content native ads (within article body)
- Footer banner
- Interstitial ads between games
- Sticky ad on mobile
- Ad rotation system supporting multiple networks (AdSense, Ezoic, Media.net)

---

## 5. SEO & Growth Strategy

1. **Multi-niche content** targets multiple search audiences simultaneously
2. **Tools with direct search intent** (e.g., "BMI calculator") bring high-intent organic traffic
3. **Games with SEO content** — high dwell time signals Google positively
4. **Regular blog publishing** — fresh content signals, topic authority
5. **Shareable content** (quizzes, horoscopes, compatibility checks) — natural backlinks & social shares
6. **News aggregation** — real-time traffic for trending topics
7. **Community features** — user-generated content, repeat visits, more pages indexed
8. **Auto-generated sitemap + schema markup** — rich snippets in Google results
9. **RSS feeds** — syndication, subscriber base
10. **PWA support** — better mobile experience, higher rankings

---

## 6. Database Schema

```
Users & Auth:
  User (id, email, name, avatar, role, createdAt, isBanned)
  Account (OAuth provider data)
  Session (active sessions)

Content:
  Post (id, title, slug, content, excerpt, featuredImage, status, views, seoTitle, seoDesc, focusKeyword, authorId, categoryId)
  Category (id, name, slug, description, icon)
  Tag (id, name, slug)
  PostTag (postId, tagId)
  Comment (id, content, postId, userId, parentId, likes, isApproved, createdAt)
  Like (id, postId, userId)
  Bookmark (id, postId, userId)

News:
  NewsArticle (id, title, content, source, sourceUrl, imageUrl, category, publishedAt)
  NewsCategory (id, name, slug)

Games:
  Game (id, name, slug, description, category, icon, isActive)
  GameScore (id, gameId, userId, score, playedAt)
  Achievement (id, userId, name, description, icon, earnedAt)
  Leaderboard (aggregated from GameScore)

Tools:
  Tool (id, name, slug, description, category, icon, route)
  ToolUsage (id, toolId, userId, usedAt, metadata)

Community:
  Forum (id, name, slug, description, category)
  ForumPost (id, forumId, userId, title, content, views, createdAt)
  QnAQuestion (id, title, content, userId, views, votes, acceptedAnswerId)
  QnAAnswer (id, questionId, userId, content, votes)
  Poll (id, question, options, votes, createdAt)

Jobs:
  JobListing (id, title, company, description, location, category, salary, applyUrl, postedAt, isActive)

Monetization:
  AdSlot (id, name, location, size, code, isActive)
  Subscription (id, userId, plan, startsAt, expiresAt, isActive)
  AffiliateLink (id, title, url, description, category)

Newsletter:
  Subscriber (id, email, name, isVerified, subscribedAt)
  Campaign (id, subject, content, sentAt, recipients, opens, clicks)

Settings:
  SiteConfig (key, value) — site title, description, logo, maintenance mode, etc.

Analytics:
  PageView (id, path, userId, ip, userAgent, referrer, visitedAt)
```

---

## 7. Implementation Phases

This project will be built in **7 phases** to enable incremental delivery:

**Phase 1 — Foundation:** Project setup, database schema, auth, admin dashboard scaffolding, base layout components  
**Phase 2 — Blog System:** Blog CRUD, categories, tags, SEO tools, comments, author profiles  
**Phase 3 — Games:** All game types, leaderboards, achievements, game pages  
**Phase 4 — Tools:** All calculator tools, converter tools, text tools, image tools  
**Phase 5 — News & Community:** News system, forums, Q&A, horoscope, fun content  
**Phase 6 — Monetization:** Ad management, subscriptions, affiliate links, job board  
**Phase 7 — Polish & Launch:** SEO optimization, PWA, analytics, email, testing, deployment

---

## 8. Admin Capabilities

The admin dashboard provides complete control:
- **Content Management:** Create, edit, publish, delete all content types
- **User Management:** View all users, ban/suspend, assign roles (Admin, Editor, Author, User)
- **Ad Management:** Add/edit AdSense codes, manage ad slots per page, A/B test placements, view ad performance
- **SEO Tools:** Edit meta tags, manage sitemap, set up 301 redirects, view SEO scores
- **Analytics Dashboard:** Total views, unique visitors, top pages, traffic sources, user engagement, revenue estimates
- **Comments Moderation:** Approve, reject, delete, bulk actions
- **Newsletter:** Create campaigns, manage subscribers, view open/click rates
- **Site Settings:** Site title, description, logo, favicon, maintenance mode toggle, dark/light mode default

---

## 9. User Experience Principles

- **Fast loading** — optimized images, lazy loading, code splitting
- **Mobile-first** — responsive design, PWA installable
- **Dark/Light mode** — with system preference detection and manual toggle
- **Search everywhere** — global search with autocomplete across all content types
- **Personalization** — saved content, recommendations, notifications
- **Accessibility** — keyboard navigation, screen reader support, proper contrast

---

## 10. Success Metrics

| Metric | 3-Month Target | 6-Month Target | 12-Month Target |
|--------|---------------|----------------|-----------------|
| Monthly Visitors | 5,000 | 25,000 | 100,000+ |
| Avg Session Duration | 3 min | 5 min | 8+ min |
| Pages per Session | 3 | 5 | 8+ |
| AdSense Revenue | $50/mo | $300/mo | $1,000+/mo |
| Registered Users | 500 | 3,000 | 10,000+ |
| Newsletter Subscribers | 200 | 1,500 | 5,000+ |

---

*Spec written 2026-09-01. Ready for user review.*
