import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const examPosts = await prisma.post.count({
    where: { postType: 'BLOG', status: 'PUBLISHED' }
  });
  const totalPosts = await prisma.post.count();
  const categories = await prisma.category.count();
  const tags = await prisma.tag.count();

  // Get sample exam posts
  const samples = await prisma.post.findMany({
    where: { postType: 'BLOG', status: 'PUBLISHED' },
    take: 5,
    select: { title: true, slug: true, readTime: true, excerpt: true, seoTitle: true }
  });

  console.log('📊 DATABASE STATE:');
  console.log('  Published blog posts:', examPosts);
  console.log('  Total posts:', totalPosts);
  console.log('  Categories:', categories);
  console.log('  Tags:', tags);
  console.log('\n  Sample exam posts:');
  samples.forEach(s => {
    console.log(`    - ${s.slug} (${s.readTime}min)`);
  });

  // Show the report
  const fs = await import('node:fs');
  const report = JSON.parse(fs.readFileSync('seed-exam-library-report.json', 'utf8'));
  console.log('\n📋 SEED REPORT SUMMARY:');
  console.log('  Total attempted:', report.totalAttempted);
  console.log('  Created:', report.created);
  console.log('  Updated:', report.updated);
  console.log('  Failed:', report.failed);
  console.log('  Categories:', report.categoriesCreated);
  console.log('  Tags:', report.tagsCreated);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
