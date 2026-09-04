import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
async function main(){
  const c = await p.post.count();
  console.log('post count', c);
  const samp = await p.post.findFirst({ select: { slug: true }});
  console.log('sample', samp?.slug);
  await p.$disconnect();
}
main().catch(e=>{ console.error(e.message); p.$disconnect(); });
