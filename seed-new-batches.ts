import { PrismaClient } from '@prisma/client';
import { parseContent } from './src/lib/content-parser';
import { deepenedAmericasPosts } from './deepening/batch4-americas-tech';
import { deepenedEuropeAfricaPosts } from './deepening/batch5-europe-africa';
import { deepenedRegionalV2Posts } from './deepening/batch6-regional-v2';
import { deepenedAsiaRemaining1Posts } from './deepening/batch7-asia-remaining1';
import { deepenedExpansionRemainingPosts } from './deepening/batch8-expansion-remaining';
import { deepenedOuterPosts } from './deepening/batch9-deep-outer';
import { deepenedExamJobPosts } from './deepening/batch10-exams-jobs';
import { deepenedTechFinancePosts } from './deepening/batch10-tech-finance';
import { deepenedAsiaPosts } from './deepening/batch10-asia-worldwide';
import { deepenedAmericasEuropePosts } from './deepening/batch10-americas-europe';
import { deepenedPosts11 } from './deepening/batch11-deep';

const prisma = new PrismaClient();

function categorySlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function main(){
  const posts = [
    ...deepenedAmericasPosts,
    ...deepenedEuropeAfricaPosts,
    ...deepenedRegionalV2Posts,
    ...deepenedAsiaRemaining1Posts,
    ...deepenedExpansionRemainingPosts,
    ...deepenedOuterPosts,
    ...deepenedExamJobPosts,
    ...deepenedTechFinancePosts,
    ...deepenedAsiaPosts,
    ...deepenedAmericasEuropePosts,
    ...deepenedPosts11,
  ];
  console.log(`Upserting ${posts.length} deepened posts`);
  console.log(`  batch4=${deepenedAmericasPosts.length}, batch5=${deepenedEuropeAfricaPosts.length}, batch6=${deepenedRegionalV2Posts.length}, batch7=${deepenedAsiaRemaining1Posts.length}, batch8=${deepenedExpansionRemainingPosts.length}, batch9=${deepenedOuterPosts.length}, batch10-exams=${deepenedExamJobPosts.length}, batch10-tech=${deepenedTechFinancePosts.length}, batch10-asia=${deepenedAsiaPosts.length}, batch10-europe=${deepenedAmericasEuropePosts.length}, batch11=${deepenedPosts11.length}`);
  const editorial = await prisma.user.upsert({
    where: { email: 'editorial@bloghar.com' },
    update: { name: 'Blog-Ghar Editorial' },
    create: { id: 'seed-author-editorial', name: 'Blog-Ghar Editorial', email: 'editorial@bloghar.com', role: 'AUTHOR' },
  });
  for(const blog of posts){
    const cat = await prisma.category.upsert({
      where: { slug: categorySlug(blog.category) },
      update: {},
      create: { name: blog.category, slug: categorySlug(blog.category), description: `${blog.category} source-researched guides` },
    });
    const tag = await prisma.tag.upsert({
      where: { slug: categorySlug(blog.focusKeyword) },
      update: { name: blog.focusKeyword },
      create: { name: blog.focusKeyword, slug: categorySlug(blog.focusKeyword) },
    });
    const parsed = parseContent(blog.body);
    const saved = await prisma.post.upsert({
      where: { slug: blog.slug },
      update: {
        title: blog.title,
        content: parsed.content,
        excerpt: blog.excerpt,
        postType: 'BLOG',
        status: 'PUBLISHED',
        categoryId: cat.id,
        authorId: editorial.id,
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
        categoryId: cat.id,
        authorId: editorial.id,
        tagId: tag.id,
        focusKeyword: blog.focusKeyword,
        seoTitle: blog.title,
        seoDesc: blog.excerpt,
        readTime: parsed.readTime,
        publishedAt: new Date('2026-09-03T00:00:00.000Z'),
      },
    });
    const wc = parsed.content.replace(/<[^>]*>/g,' ').split(/\s+/).filter(Boolean).length;
    console.log(`  ✓ ${blog.slug} — ${wc} words — id ${saved.id}`);
  }
  console.log('Done');
}

main().catch(e=>{ console.error(e); process.exit(1); }).finally(()=> prisma.$disconnect());
