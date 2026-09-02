# Blog-Ghar Deployment Guide

## Architecture

- **Frontend**: Next.js 15 on Vercel
- **Backend + DB**: Railway (PostgreSQL + Redis + Next.js SSR)
- **Storage**: Supabase (images, files)

## Prerequisites

1. GitHub account (for code hosting)
2. Vercel account (free tier works)
3. Railway account (free tier works)
4. Supabase account (free tier works)

---

## Step 1: Push to GitHub

```bash
# Create repo at github.com first, then:
cd c:/Users/DIVYANSHU/Desktop/Blog-Ghar
git remote add origin https://github.com/YOUR_USERNAME/blog-ghar.git
git branch -M main
git push -u origin main
```

---

## Step 2: Database Setup

### Option A: Railway (Recommended)

1. Go to [railway.app](https://railway.app) → "New Project" → "Provision PostgreSQL"
2. Copy the DATABASE_URL from the PostgreSQL service variables
3. Optionally add a Redis service from the same Railway project
4. Copy the REDIS_URL

### Option B: Supabase

1. Go to [supabase.com](https://supabase.com) → "New Project"
2. Get the connection string from Settings → Database

---

## Step 3: Environment Variables

### Vercel (Frontend)

Set these in Vercel → Settings → Environment Variables:

```env
# Site
NEXT_PUBLIC_SITE_URL=https://blogghar.vercel.app
NEXT_PUBLIC_SITE_NAME=Blog-Ghar

# Auth
AUTH_SECRET=<generate-with-openssl-rand-base64-32>
AUTH_URL=https://blogghar.vercel.app

# Google OAuth
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>

# GitHub OAuth
GITHUB_CLIENT_ID=<your-github-client-id>
GITHUB_CLIENT_SECRET=<your-github-client-secret>

# Email (Resend)
RESEND_API_KEY=<your-resend-api-key>
EMAIL_FROM=noreply@blogghar.com

# Ads
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX

# Database (remote)
DATABASE_URL=<your-postgres-connection-string>

# Sentry (optional)
SENTRY_DSN=

# Supabase (optional, for storage)
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

### Railway (Backend API — if using separate API)

```env
DATABASE_URL=<same-postgres-url>
REDIS_URL=<redis-url>
AUTH_SECRET=<same-as-vercel>
AUTH_URL=https://blogghar.vercel.app
```

---

## Step 4: Deploy

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Or connect your GitHub repo in the Vercel dashboard and enable auto-deploys.

### Railway Deployment

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway link
railway up
```

---

## Step 5: Database Migration

After deployment, run migrations:

```bash
# Locally (if DATABASE_URL points to production)
npx prisma migrate deploy

# Or via Railway shell
railway run npx prisma migrate deploy
```

---

## Step 6: Seed Data (Optional)

```bash
npx prisma db seed
```

---

## Post-Deployment Checklist

- [ ] Verify homepage loads at https://blogghar.vercel.app
- [ ] Test blog, news, games, tools, horoscope, forum, jobs pages
- [ ] Set up Google Search Console
- [ ] Set up Google Analytics
- [ ] Apply for Google AdSense
- [ ] Configure OAuth providers (Google, GitHub)
- [ ] Set up custom domain (blogghar.com) in Vercel
- [ ] Enable automatic database backups on Railway
