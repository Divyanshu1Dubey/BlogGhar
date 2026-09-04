import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
async function main(){
  const posts = await p.post.findMany({ select:{ slug:true, title:true, content:true, category:true }});
  // compute word counts from HTML stripped
  const items = posts.map(x=>{
    const wc = x.content.replace(/<[^>]*>/g,' ').split(/\s+/).filter(Boolean).length;
    return { slug: x.slug, wc, cat: (x as any).category?.name || '' };
  }).sort((a,b)=>a.wc-b.wc);
  const total = items.length;
  const avg = Math.round(items.reduce((s,x)=>s+x.wc,0)/total);
  const thin = items.filter(x=>x.wc < 600).length;
  const mid = items.filter(x=>x.wc >= 600 && x.wc < 1000).length;
  const good = items.filter(x=>x.wc >= 1000 && x.wc < 1500).length;
  const excellent = items.filter(x=>x.wc >= 1500).length;
  console.log(`TOTAL posts: ${total}  AVG words: ${avg}`);
  console.log(`DISTRIBUTION: <600=${thin} | 600-999=${mid} | 1000-1499=${good} | 1500+=${excellent}`);
  console.log('\n10 thinnest remaining:');
  for(const t of items.slice(0,10)){
    console.log(`  ${String(t.wc).padStart(4)}  ${t.slug}`);
  }
  console.log('\n10 longest (deepened):');
  for(const t of items.slice(-10).reverse()){
    console.log(`  ${String(t.wc).padStart(4)}  ${t.slug}`);
  }
  // count deepened slugs
  const deepened = new Set([
    ... (await import('./deepening/batch1-exams.ts')).then(m=>m.deepenedExamBlogs.map((x:any)=>x.slug)).catch(()=>[]),
  ]);
  await p.$disconnect();
}
main().catch(e=>{console.error(e); process.exit(1)}).finally(()=>{});