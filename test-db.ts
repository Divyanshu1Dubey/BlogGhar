import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
async function main(){
  const c = await p.post.count();
  console.log('DB OK count', c);
  await p.$disconnect();
}
main().catch(e=>{ console.error('DB FAIL', e.message); p.$disconnect(); });
