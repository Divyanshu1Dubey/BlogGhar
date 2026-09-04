import { researchedContentEuropeAfrica } from '../prisma/researched-content-europe-africa';
import { researchedContentAsiaOceania } from '../prisma/researched-content-asia-oceania';
import { researchedContentAmericasTech } from '../prisma/researched-content-americas-tech';
import { researchedContentFoodRecipes } from '../prisma/researched-content-food-recipes';
import { researchedContentHealthFitness } from '../prisma/researched-content-health-fitness';
import { researchedContentIndianCulture } from '../prisma/researched-content-indian-culture';
import { researchedContentMoneyTech } from '../prisma/researched-content-money-tech';
import { researchedContentScienceSpace } from '../prisma/researched-content-science-space';
import { researchedContentWorldHistory } from '../prisma/researched-content-world-history';
import { researchedContentIndia2026 } from '../prisma/researched-content-2026-india';
import { deepenedBlogs } from '../prisma/deepened-blogs-2026';

const fileMap = {
  'europe-africa': researchedContentEuropeAfrica,
  'asia-oceania': researchedContentAsiaOceania,
  'americas-tech': researchedContentAmericasTech,
  'food-recipes': researchedContentFoodRecipes,
  'health-fitness': researchedContentHealthFitness,
  'indian-culture': researchedContentIndianCulture,
  'money-tech': researchedContentMoneyTech,
  'science-space': researchedContentScienceSpace,
  'world-history': researchedContentWorldHistory,
  '2026-india': researchedContentIndia2026,
  'deepened-2026': deepenedBlogs,
};

type AuditItem = {
  file: string;
  slug: string;
  title: string;
  category: string;
  focusKeyword: string;
  wordCount: number;
  h2Count: number;
  h3Count: number;
  tableCount: number;
  sourcesCount: number;
  hasFaq: boolean;
  contentLength: number;
};

const items: AuditItem[] = [];

for (const [file, list] of Object.entries(fileMap)) {
  for (const post of list) {
    const content = (post as any).body || (post as any).content || '';
    const wordCount = content.split(/\s+/).filter(Boolean).length;
    const h2Count = (content.match(/^##\s+/gm) || []).length;
    const h3Count = (content.match(/^###\s+/gm) || []).length;
    const tableCount = (content.match(/\|.*\|/g) || []).length;
    const sourcesCount = ((post as any).sources || []).length + ((post as any).sourceUrl ? 1 : 0);
    const hasFaq = /###\s+FAQ|##\s+FAQ|Frequently Asked Questions/i.test(content);
    items.push({
      file,
      slug: post.slug,
      title: post.title,
      category: post.category,
      focusKeyword: post.focusKeyword,
      wordCount,
      h2Count,
      h3Count,
      tableCount,
      sourcesCount,
      hasFaq,
      contentLength: content.length,
    });
  }
}

console.log('\n=== FILE-BY-FILE SUMMARY ===');
for (const [file, list] of Object.entries(fileMap)) {
  const fileItems = items.filter((i) => i.file === file);
  const words = fileItems.map((i) => i.wordCount);
  const min = Math.min(...words);
  const max = Math.max(...words);
  const avg = (words.reduce((a, b) => a + b, 0) / (words.length || 1)).toFixed(1);
  console.log(`${file.padEnd(20)} | count: ${fileItems.length.toString().padStart(2)} | avg: ${avg.padStart(6)} words | range: [${min} - ${max}]`);
}

console.log('\n=== ALL POSTS BY FILE ===');
for (const [file, list] of Object.entries(fileMap)) {
  console.log(`\n--- FILE: ${file} (${list.length} posts) ---`);
  list.forEach((p, idx) => {
    console.log(`${idx + 1}. [${p.category}] "${p.title}" | slug: ${p.slug} | kw: ${p.focusKeyword}`);
  });
}

console.log(`Total posts audited: ${items.length}`);
console.log(`Average word count: ${(items.reduce((acc, i) => acc + i.wordCount, 0) / items.length).toFixed(1)} words`);

// Sort by word count ascending
const sorted = [...items].sort((a, b) => a.wordCount - b.wordCount);

console.log('\n=== DISTRIBUTION BY LENGTH ===');
console.log('< 600 words:', items.filter((i) => i.wordCount < 600).length);
console.log('600 - 1000 words:', items.filter((i) => i.wordCount >= 600 && i.wordCount < 1000).length);
console.log('1000 - 1500 words:', items.filter((i) => i.wordCount >= 1000 && i.wordCount < 1500).length);
console.log('1500+ words:', items.filter((i) => i.wordCount >= 1500).length);

console.log('\n=== BOTTOM 25 SHORTEST POSTS ===');
sorted.slice(0, 25).forEach((p, idx) => {
  console.log(`${idx + 1}. [${p.file}] [${p.wordCount} words, ${p.h2Count} H2s, ${p.sourcesCount} sources] "${p.title}" (${p.slug})`);
});

console.log('\n=== DUPLICATE / OVERLAPPING CHECK ===');
const slugMap = new Map<string, AuditItem[]>();
const kwMap = new Map<string, AuditItem[]>();

for (const p of items) {
  const sList = slugMap.get(p.slug) || [];
  sList.push(p);
  slugMap.set(p.slug, sList);

  const kw = p.focusKeyword.toLowerCase().trim();
  const kList = kwMap.get(kw) || [];
  kList.push(p);
  kwMap.set(kw, kList);
}

for (const [slug, list] of slugMap.entries()) {
  if (list.length > 1) {
    console.log(`Duplicate slug: "${slug}" in files: ${list.map((x) => x.file).join(', ')}`);
  }
}

for (const [kw, list] of kwMap.entries()) {
  if (list.length > 1) {
    console.log(`Duplicate keyword: "${kw}" in files: ${list.map((x) => `${x.file}:${x.slug}`).join(', ')}`);
  }
}

console.log('\n=== CATEGORY COUNTS ===');
const catMap = new Map<string, number>();
for (const p of items) {
  catMap.set(p.category, (catMap.get(p.category) || 0) + 1);
}
for (const [cat, count] of catMap.entries()) {
  console.log(`- ${cat}: ${count} posts`);
}
