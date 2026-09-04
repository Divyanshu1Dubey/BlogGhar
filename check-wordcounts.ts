const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function check() {
  const upsc = await prisma.post.findUnique({ where: { slug: 'upsc-cse-preparation-guide-2026' }, select: { title: true, content: true } });
  if (upsc) { const wordCount = upsc.content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length; console.log('UPSC CSE:', wordCount, 'words'); }
  const ibps = await prisma.post.findUnique({ where: { slug: 'ibps-po-clerk-official-guide' }, select: { title: true, content: true } });
  if (ibps) { const wordCount = ibps.content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length; console.log('IBPS PO:', wordCount, 'words'); }
  const spa = await prisma.post.findUnique({ where: { slug: 'malaysia-spa9-government-jobs-guide' }, select: { title: true, content: true } });
  if (spa) { const wordCount = spa.content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length; console.log('Malaysia SPA9:', wordCount, 'words'); }
  const nzqa = await prisma.post.findUnique({ where: { slug: 'new-zealand-nzqa-international-qualification-assessment' }, select: { title: true, content: true } });
  if (nzqa) { const wordCount = nzqa.content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length; console.log('NZQA:', wordCount, 'words'); }
  await prisma.$disconnect();
}
check().catch(e => { console.error(e); prisma.$disconnect(); });