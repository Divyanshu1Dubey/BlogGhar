import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    select: { id: true, slug: true, content: true },
  });

  const toDelete = posts
    .filter(p => !p.slug.startsWith('news-') && !p.slug.startsWith('_placeholder'))
    .map(p => ({
      ...p,
      wc: p.content.replace(/<[^>]*>/g,' ').split(/\s+/).filter(Boolean).length,
    }))
    .filter(p => p.wc < 500)
    .map(p => p.id);

  console.log(`Deleting ${toDelete.length} stubs...`);
  await prisma.post.deleteMany({
    where: { id: { in: toDelete } },
  });
  console.log('Done');
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
