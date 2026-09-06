import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    select: { id: true, slug: true, title: true, content: true },
  });

  const withWc = posts
    .filter(p => !p.slug.startsWith('news-') && !p.slug.startsWith('_placeholder'))
    .map(p => ({
      ...p,
      wc: p.content.replace(/<[^>]*>/g,' ').split(/\s+/).filter(Boolean).length,
    }))
    .sort((a, b) => a.wc - b.wc);

  const stubs = withWc.filter(p => p.wc < 500);

  console.log(`Total non-news posts: ${withWc.length}`);
  console.log(`Stubs under 500 words: ${stubs.length}\n`);
  console.log('SLUGS TO DELETE:');
  for (const p of stubs) {
    console.log(`  ${p.slug}  (${p.wc}w)`);
  }
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
