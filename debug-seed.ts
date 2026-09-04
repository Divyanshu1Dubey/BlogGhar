import { PrismaClient } from '@prisma/client';
import { parseContent } from './src/lib/content-parser';
import { deepenedExpansionPosts } from './deepening/batch2-expansion';
const p = new PrismaClient();
async function main(){
  const slug = 'ssc-cgl-official-notification-guide';
  const found = deepenedExpansionPosts.find(x=>x.slug===slug);
  console.log('FOUND in file?', !!found);
  if(found){
    const parsed = parseContent(found.body);
    console.log('parsed wordCount', parsed.wordCount, 'readTime', parsed.readTime, 'content length', parsed.content.length);
    console.log('content preview', parsed.content.slice(0,500));
  }
  const db = await p.post.findUnique({ where: { slug }, select: { title:true, content:true }});
  console.log('DB found?', !!db);
  if(db){
    const wc = db.content.replace(/<[^>]*>/g,' ').split(/\s+/).filter(Boolean).length;
    console.log('DB wc', wc, 'content length', db.content.length);
    console.log('DB preview', db.content.slice(0,800));
  }
  await p.$disconnect();
}
main().catch(e=>{console.error(e); process.exit(1)});
