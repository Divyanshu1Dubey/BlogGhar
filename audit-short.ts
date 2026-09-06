import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    select: { id: true, slug: true, title: true, readTime: true, content: true },
  });

  const withLen = posts.map(p => ({
    ...p,
    wc: p.content.replace(/<[^>]*>/g,' ').split(/\s+/).filter(Boolean).length,
  }));
  withLen.sort((a, b) => a.wc - b.wc);

  const short = withLen.filter(p => p.wc < 1500);
  console.log(`Total published: ${posts.length}`);
  console.log(`Under 1500 words: ${short.length}\n`);
  console.log('SHORT POSTS (need rewriting):');
  for (const p of short) {
    console.log(`  ${String(p.wc).padStart(4)}w | ${p.slug}`);
  }
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
