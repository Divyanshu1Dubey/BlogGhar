import { PrismaClient } from '@prisma/client';
import fs from 'node:fs';
import path from 'node:path';

const prisma = new PrismaClient();

interface ArticleData {
  exam: string;
  examCategory: string;
  country: string;
  niche: string;
  articleType: string;
  primaryKeyword: string;
  seoTitle: string;
  metaDescription: string;
  slug: string;
  h1: string;
  content: string;
  excerpt: string;
  wordCount: number;
  readTime: number;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100);
}

function slugifyCategory(s: string): string {
  return slugify('exams-' + s);
}

async function getOrCreateCategory(name: string, description?: string) {
  const slug = slugifyCategory(name);
  return prisma.category.upsert({
    where: { slug },
    update: description ? { description } : {},
    create: { name, slug, description: description || `${name} exam preparation guides` },
  });
}

async function getOrCreateTag(name: string) {
  const slug = slugify(name);
  return prisma.tag.upsert({
    where: { slug },
    update: {},
    create: { name, slug },
  });
}

async function getAuthorId(): Promise<string> {
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (admin) return admin.id;
  const user = await prisma.user.findFirst({ where: { role: 'USER' } });
  if (user) return user.id;
  const created = await prisma.user.create({
    data: {
      id: 'seed-author-exams',
      name: 'Blog-Ghar Exam Library',
      email: 'exams@blogghar.local',
      role: 'ADMIN',
    },
  });
  return created.id;
}

function parseArticles(filePath: string): ArticleData[] {
  const raw = fs.readFileSync(filePath, 'utf8');
  const text = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Split on ARTICLE markers
  const parts = text.split(/^ARTICLE \d+$/m).slice(1);
  if (parts.length !== 265) {
    console.warn(`Warning: Expected 265 articles, got ${parts.length}`);
  }

  const articles: ArticleData[] = [];

  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    const lines = p.split('\n');

    // Helper to extract value after a field marker (blank line after colon)
    const extract = (fieldName: string, numLinesAfter = 1): string => {
      const regex = new RegExp(`^${fieldName}:\\s*\\n([\\s\\S]*?)(?:\\n\\n|\\n[A-Z])`, 'm');
      const m = p.match(regex);
      if (!m) return '';
      return m[1].trim();
    };

    // Extract exam: first line of article
    const examMatch = p.match(/^EXAM:\s*(.+)$/m);
    const examCategoryMatch = p.match(/^EXAM CATEGORY:\s*(.+)$/m);

    const exam = examMatch ? examMatch[1].trim() : '';
    const examCategory = examCategoryMatch ? examCategoryMatch[1].trim() : 'General Exams';

    // SEO TITLE: value on next line after colon
    const seoTitleMatch = p.match(/^SEO TITLE:\s*\n(.+)$/m);
    const seoTitle = seoTitleMatch ? seoTitleMatch[1].trim() : '';

    // META DESCRIPTION: value on next line(s) until blank line
    const metaDescMatch = p.match(/^META DESCRIPTION:\s*\n([\s\S]*?)(?=\n\nSLUG:|\n\nH1:|\n\nPRIMARY)/m);
    const metaDescription = metaDescMatch ? metaDescMatch[1].trim() : '';

    // SLUG: value on next line
    const slugMatch = p.match(/^SLUG:\s*\n(.+)$/m);
    const slug = slugMatch ? slugMatch[1].trim() : '';

    // H1: value on next line
    const h1Match = p.match(/^H1:\s*\n(.+)$/m);
    const h1 = h1Match ? h1Match[1].trim() : '';

    // PRIMARY TOPIC/KEYWORD
    const primaryKeywordMatch = p.match(/^PRIMARY TOPIC\/KEYWORD:\s*\n(.+)$/m);
    const primaryKeyword = primaryKeywordMatch ? primaryKeywordMatch[1].trim() : exam;

    // COUNTRY/REGION
    const countryMatch = p.match(/^COUNTRY\/REGION:\s*\n(.+)$/m);
    const country = countryMatch ? countryMatch[1].trim() : '';

    // NICHE
    const nicheMatch = p.match(/^NICHE:\s*\n(.+)$/m);
    const niche = nicheMatch ? nicheMatch[1].trim() : examCategory;

    // ARTICLE TYPE
    const articleTypeMatch = p.match(/^ARTICLE TYPE:\s*\n(.+)$/m);
    const articleType = articleTypeMatch ? articleTypeMatch[1].trim() : '';

    // FULL ARTICLE body
    const bodyMatch = p.match(/^FULL ARTICLE:\s*\n\n([\s\S]+?)\n\nFAQ:/m);
    const body = bodyMatch ? bodyMatch[1].trim() : '';

    // Build content: prepend H1 heading
    const content = body ? `## ${h1 || slug}\n\n${body}` : '';

    // Word count
    const wordCount = content ? content.split(/\s+/).filter(Boolean).length : 0;

    // Read time: ceil(wordCount / 200), min 2
    const readTime = Math.max(2, Math.ceil(wordCount / 200));

    // Excerpt: first 160 chars of body, or H1
    const excerpt = body ? body.substring(0, 160).replace(/\n/g, ' ').trim() + '...' : h1;

    if (!slug || !content) {
      console.warn(`  Skipping article ${i + 1}: missing slug or content`);
      continue;
    }

    if (content.length < 2000) {
      console.warn(`  Warning: Article ${i + 1} (${slug}) content is ${content.length} chars (< 2000)`);
    }

    articles.push({
      exam: exam || 'Unknown',
      examCategory: examCategory || 'General Exams',
      country: country || 'Global',
      niche,
      articleType: '',
      primaryKeyword: primaryKeyword || exam,
      seoTitle: seoTitle || h1 || slug,
      metaDescription: metaDescription || excerpt.substring(0, 160),
      slug,
      h1: h1 || slug,
      content,
      excerpt,
      wordCount,
      readTime,
    });
  }

  return articles;
}

async function main() {
  console.log('📚 Loading exam-blog-library.txt...');
  const articles = parseArticles(path.join(process.cwd(), 'exam-blog-library.txt'));
  console.log(`   Parsed ${articles.length} articles`);

  const authorId = await getAuthorId();
  console.log(`   Author ID: ${authorId}`);

  // Collect all unique categories and create them
  const categorySet = new Set<string>();
  for (const a of articles) categorySet.add(a.examCategory);
  const categories = [...categorySet].sort();
  console.log(`   Creating/verifying ${categories.length} exam categories...`);

  const categoryMap = new Map<string, string>();
  for (const cat of categories) {
    const created = await getOrCreateCategory(cat, `${cat} exam preparation guides, study tips, and official information`);
    categoryMap.set(cat, created.id);
    console.log(`     ✓ Category: ${cat} (${created.id})`);
  }

  // Collect tags: exam short names + countries
  const tagNameSet = new Set<string>();
  for (const a of articles) {
    // Add exam tag (short name from exam field)
    const examShort = a.exam.split('(')[0].split('–')[0].trim().substring(0, 30);
    if (examShort) tagNameSet.add(examShort);
    // Add country tag
    if (a.country && a.country !== 'Global') {
      tagNameSet.add(a.country);
    }
  }
  const tags = [...tagNameSet].sort();
  console.log(`   Creating/verifying ${tags.length} tags...`);

  const tagMap = new Map<string, string>();
  for (const tag of tags) {
    const created = await getOrCreateTag(slugify(tag));
    tagMap.set(tag, created.id);
  }

  // Seed articles in batches of 25
  const BATCH_SIZE = 25;
  const results = { created: 0, updated: 0, failed: 0, skipped: 0 };
  const report: any[] = [];

  console.log(`\n   Seeding ${articles.length} articles in batches of ${BATCH_SIZE}...`);

  for (let i = 0; i < articles.length; i += BATCH_SIZE) {
    const batch = articles.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(articles.length / BATCH_SIZE);

    try {
      const resultsBatch = await Promise.allSettled(
        batch.map(async (article) => {
          const categoryId = categoryMap.get(article.examCategory) || categoryMap.values().next().value;
          // Use exam short name as tag
          const examShort = article.exam.split('(')[0].split('–')[0].trim().substring(0, 30);
          const tagId = tagMap.get(examShort) || tagMap.get(article.country) || null;

          // Build featuredImage path
          const featuredImage = `/images/exams/${article.slug}.jpg`;

          try {
            const result = await prisma.post.upsert({
              where: { slug: article.slug },
              update: {
                title: article.seoTitle,
                content: article.content,
                excerpt: article.excerpt,
                seoTitle: article.seoTitle,
                seoDesc: article.metaDescription,
                focusKeyword: article.primaryKeyword,
                readTime: article.readTime,
                status: 'PUBLISHED',
                postType: 'BLOG',
                publishedAt: new Date(),
                categoryId,
                authorId,
                tagId: tagId || undefined,
                featuredImage,
                updatedAt: new Date(),
              },
              create: {
                slug: article.slug,
                title: article.seoTitle,
                content: article.content,
                excerpt: article.excerpt,
                seoTitle: article.seoTitle,
                seoDesc: article.metaDescription,
                focusKeyword: article.primaryKeyword,
                readTime: article.readTime,
                status: 'PUBLISHED',
                postType: 'BLOG',
                publishedAt: new Date(),
                categoryId,
                authorId,
                tagId: tagId || undefined,
                featuredImage,
              },
            });

            const isNew = result.createdAt.getTime() === result.updatedAt.getTime();
            return { success: true as const, isNew, article };
          } catch (err: any) {
            return { success: false as const, error: err.message, article };
          }
        })
      );

      for (const r of resultsBatch) {
        if (r.status === 'fulfilled') {
          const { success, isNew, article } = r.value;
          if (!success) {
            results.failed++;
            report.push({ slug: article.slug, status: 'failed', error: r.value.error });
          } else if (isNew) {
            results.created++;
            report.push({ slug: article.slug, category: article.examCategory, wordCount: article.wordCount, readTime: article.readTime, status: 'created' });
          } else {
            results.updated++;
            report.push({ slug: article.slug, category: article.examCategory, wordCount: article.wordCount, readTime: article.readTime, status: 'updated' });
          }
        } else {
          results.failed++;
        }
      }

      console.log(`   Batch ${batchNum}/${totalBatches}: ${results.created + results.updated} processed`);
    } catch (err) {
      console.error(`   Batch ${batchNum} error:`, err);
      results.failed += batch.length;
    }
  }

  // Write report
  const reportPath = path.join(process.cwd(), 'seed-exam-library-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    date: new Date().toISOString().split('T')[0],
    totalAttempted: articles.length,
    created: results.created,
    updated: results.updated,
    failed: results.failed,
    categoriesCreated: categories.length,
    authorUsed: authorId,
    articles: report,
  }, null, 2));
  console.log(`\\n📊 Report written to: ${reportPath}`);

  // Update audit in exam-blog-library.txt
  const auditLine = `\\nSEED REPORT ${new Date().toISOString().split('T')[0]}: Seeded ${results.created + results.updated} articles (${results.created} created, ${results.updated} updated) from 53 exams across ${categories.length} categories. Author: ${authorId}.`;
  try {
    const txtPath = path.join(process.cwd(), 'exam-blog-library.txt');
    fs.appendFileSync(txtPath, auditLine);
    console.log(`   Audit appended to exam-blog-library.txt`);
  } catch (e) {
    console.warn(`   Could not append audit: ${e}`);
  }

  // Final counts
  console.log('\\n═══════════════════════════════════════');
  console.log('TOTAL:', results.created + results.updated, 'attempted,',
    results.created, 'created,', results.updated, 'updated,', results.failed, 'failed');
  console.log('Categories:', categories.length);
  console.log('Tags:', tags.length);
  console.log('═══════════════════════════════════════');
}

main()
  .catch((e) => { console.error('Fatal:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
