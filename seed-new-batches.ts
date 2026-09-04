import { PrismaClient } from '@prisma/client';
import { parseContent } from './src/lib/content-parser';
import { deepenedAmericasPosts } from './deepening/batch4-americas-tech';
import { deepenedEuropeAfricaPosts } from './deepening/batch5-europe-africa';

const prisma = new PrismaClient();

function categorySlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function main(){
  const posts = [...deepenedAmericasPosts, ...deepenedEuropeAfricaPosts];
  console.log(`Upserting ${posts.length} deepened posts (Americas=${deepenedAmericasPosts.length}, Europe=${deepenedEuropeAfricaPosts.length})`);
  const editorial = await prisma.user.upsert({
    where: { email: 'editorial@bloghar.com' },
    update: { name: 'Blog-Ghar Editorial' },
    create: { id: 'seed-author-editorial', name: 'Blog-Ghar Editorial', email: 'editorial@bloghar.com', role: 'AUTHOR' },
  });
  for(const blog of posts){
    const cat = await prisma.category.upsert({
      where: { slug: categorySlug(blog.category) },
      update: {},
      create: { name: blog.category, slug: categorySlug(blog.category), description: `${blog.category} source-researched guides` },
    });
    const tag = await prisma.tag.upsert({
      where: { slug: categorySlug(blog.focusKeyword) },
      update: { name: blog.focusKeyword },
      create: { name: blog.focusKeyword, slug: categorySlug(blog.focusKeyword) },
    });
    const parsed = parseContent(blog.body);
    const saved = await prisma.post.upsert({
      where: { slug: blog.slug },
      update: {
        title: blog.title,
        content: parsed.content,
        excerpt: blog.excerpt,
        postType: 'BLOG',
        status: 'PUBLISHED',
        categoryId: cat.id,
        authorId: editorial.id,
        tagId: tag.id,
        focusKeyword: blog.focusKeyword,
        seoTitle: blog.title,
        seoDesc: blog.excerpt,
        readTime: parsed.readTime,
        publishedAt: new Date('2026-09-03T00:00:00.000Z'),
      },
      create: {
        slug: blog.slug,
        title: blog.title,
        content: parsed.content,
        excerpt: blog.excerpt,
        postType: 'BLOG',
        status: 'PUBLISHED',
        categoryId: cat.id,
        authorId: editorial.id,
        tagId: tag.id,
        focusKeyword: blog.focusKeyword,
        seoTitle: blog.title,
        seoDesc: blog.excerpt,
        readTime: parsed.readTime,
        publishedAt: new Date('2026-09-03T00:00:00.000Z'),
      },
    });
    const wc = parsed.content.replace(/<[^>]*>/g,' ').split(/\s+/).filter(Boolean).length;
    console.log(`  ✓ ${blog.slug} — ${wc} words — id ${saved.id}`);
  }
  console.log('Done');
}

main().catch(e=>{ console.error(e); process.exit(1); }).finally(()=> prisma.$disconnect());
