import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
async function main() {
  const posts = await p.post.findMany({ select: { slug: true, title: true, content: true } });
  const items = posts.map(x => {
    const wc = x.content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
    return { slug: x.slug, wc };
  }).sort((a, b) => a.wc - b.wc);
  const total = items.length;
  const avg = Math.round(items.reduce((s, x) => s + x.wc, 0) / total);
  const cats = {
    '<300': items.filter(x => x.wc < 300).length,
    '300-599': items.filter(x => x.wc >= 300 && x.wc < 600).length,
    '600-999': items.filter(x => x.wc >= 600 && x.wc < 1000).length,
    '1000-1499': items.filter(x => x.wc >= 1000 && x.wc < 1500).length,
    '1500+': items.filter(x => x.wc >= 1500).length,
  };
  console.log('TOTAL:', total, 'AVG:', avg);
  console.log('DIST:', cats);
  console.log('THINNEST 10:', items.slice(0, 10).map(x => x.wc + ' ' + x.slug).join('; '));
  console.log('LONGEST 10:', items.slice(-10).reverse().map(x => x.wc + ' ' + x.slug).join('; '));
  await p.$disconnect();
}
main().catch(e => { console.error(e); p.$disconnect(); });