import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
async function main(){
  const posts = await p.post.findMany({ select:{ slug:true, title:true, content:true }});
  const items = posts.map(x=>{
    const wc = x.content.replace(/<[^>]*>/g,' ').split(/\s+/).filter(Boolean).length;
    return { slug: x.slug, title: x.title.slice(0,60), wc };
  }).sort((a,b)=>a.wc-b.wc);
  console.log(`TOTAL ${items.length}`);
  for(const t of items){
    const marker = t.wc < 300 ? '🔴' : t.wc < 600 ? '🟡' : t.wc < 1000 ? '🟢' : '🔵';
    console.log(`${marker} ${String(t.wc).padStart(4)}  ${t.slug}`);
  }
  await p.$disconnect();
}
main().catch(e=>{console.error(e); process.exit(1);});
