const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function check() {
  const posts = [
    'hong-kong-hkpfs-phd-fellowship-guide',
    'indonesia-cpns-sscasn-civil-service-guide',
    'taiwan-employment-gold-card-guide',
    'vietnam-vneid-digital-identity-guide',
    'japan-jasso-scholarship-guide'
  ];
  for (const slug of posts) {
    const post = await prisma.post.findUnique({ where: { slug }, select: { title: true, content: true } });
    if (post) { 
      const wordCount = post.content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length; 
      console.log(slug + ':', wordCount, 'words');
    } else {
      console.log(slug + ': NOT FOUND');
    }
  }
  await prisma.$disconnect();
}
check().catch(e => { console.error(e); prisma.$disconnect(); });