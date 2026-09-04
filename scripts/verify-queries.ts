import prisma from '../src/lib/prisma';

async function verifyQueries() {
  console.log('🔍 [Sanity Check] Verifying Blog & Public Database Queries...\n');

  let hasError = false;

  // 1. Verify Blog Listing Query (used in /blog)
  try {
    const posts = await prisma.post.findMany({
      where: {
        postType: 'BLOG',
        status: 'PUBLISHED',
      },
      orderBy: { publishedAt: 'desc' },
      take: 50,
      include: {
        author: { select: { name: true } },
        category: { select: { name: true, slug: true, icon: true } },
      },
    });

    const totalPosts = await prisma.post.count({
      where: {
        postType: 'BLOG',
        status: 'PUBLISHED',
      },
    });

    if (posts.length === 0) {
      console.error('❌ /blog query returned 0 posts! Expected published posts.');
      hasError = true;
    } else {
      console.log(`✅ /blog listing query: SUCCESS (${posts.length} posts loaded, total in DB: ${totalPosts})`);
      console.log(`   Sample post: "${posts[0].title}" [${posts[0].category?.name}]`);
    }
  } catch (err: any) {
    console.error('❌ /blog listing query failed:', err.message);
    hasError = true;
  }

  // 2. Verify Category Filter Query
  try {
    const techCategory = await prisma.category.findFirst();
    if (techCategory) {
      const categoryPosts = await prisma.post.findMany({
        where: {
          postType: 'BLOG',
          status: 'PUBLISHED',
          category: { slug: techCategory.slug },
        },
        orderBy: { publishedAt: 'desc' },
        take: 10,
        include: {
          author: { select: { name: true } },
          category: { select: { name: true, slug: true, icon: true } },
        },
      });
      console.log(`✅ Category filter query (${techCategory.name}): SUCCESS (${categoryPosts.length} posts)`);
    }
  } catch (err: any) {
    console.error('❌ Category filter query failed:', err.message);
    hasError = true;
  }

  // 3. Verify Single Blog Post Page Query (used in /blog/[slug])
  try {
    const firstPost = await prisma.post.findFirst({
      where: { postType: 'BLOG', status: 'PUBLISHED' },
    });

    if (firstPost) {
      const postDetail = await prisma.post.findUnique({
        where: { slug: firstPost.slug },
        include: {
          author: { select: { name: true, image: true } },
          category: { select: { name: true, slug: true, icon: true } },
          tags: { select: { id: true, name: true, slug: true } },
        },
      });

      if (!postDetail) {
        console.error(`❌ /blog/${firstPost.slug} post detail query returned null!`);
        hasError = true;
      } else {
        console.log(`✅ /blog/[slug] detail query: SUCCESS (Loaded "${postDetail.title}", read time: ${postDetail.readTime}m)`);
      }
    }
  } catch (err: any) {
    console.error('❌ /blog/[slug] detail query failed:', err.message);
    hasError = true;
  }

  // 4. Verify Homepage API Queries (used in /api/home)
  try {
    const [featuredPosts, trendingPosts, tools] = await Promise.all([
      prisma.post.findMany({
        where: { postType: 'BLOG', status: 'PUBLISHED' },
        take: 3,
        orderBy: { publishedAt: 'desc' },
        include: {
          author: { select: { name: true, image: true } },
          category: { select: { name: true, slug: true, icon: true } },
        },
      }),
      prisma.post.findMany({
        where: { postType: 'BLOG', status: 'PUBLISHED' },
        take: 6,
        orderBy: { views: 'desc' },
        include: {
          author: { select: { name: true } },
          category: { select: { name: true, slug: true, icon: true } },
        },
      }),
      prisma.tool.findMany({
        where: { isActive: true },
        orderBy: { usages: { _count: 'desc' } },
        take: 8,
      }),
    ]);

    console.log(`✅ Homepage queries: SUCCESS (${featuredPosts.length} featured blogs, ${trendingPosts.length} trending blogs, ${tools.length} tools)`);
  } catch (err: any) {
    console.error('❌ Homepage queries failed:', err.message);
    hasError = true;
  }

  await prisma.$disconnect();

  if (hasError) {
    console.error('\n🚨 Query verification FAILED. One or more database queries are invalid.\n');
    process.exit(1);
  } else {
    console.log('\n🎉 ALL BLOG & HOMEPAGE QUERIES VERIFIED SUCCESSFULLY!\n');
    process.exit(0);
  }
}

verifyQueries();
