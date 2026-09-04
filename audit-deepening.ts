import * as fs from 'node:fs';
const files = [
  'deepening/batch1-exams.ts',
  'deepening/batch2-expansion.ts',
  'deepening/batch3-asia-oceania.ts',
  'deepening/batch4-americas-tech.ts',
  'deepening/batch5-europe-africa.ts',
  'deepening/batch6-regional-v2.ts',
  'deepening/batch7-asia-remaining1.ts',
  'deepening/batch7-fixed2.ts',
  'deepening/batch8-expansion-remaining.ts',
  'deepening/batch8-fixed.ts',
  'deepening/batch9-deep-outer.ts',
  'prisma/deepened-batch1-exams.ts',
  'prisma/deepened-batch1-tech.ts',
  'prisma/deepened-batch1-lifestyle.ts',
  'prisma/deepened-blogs-2026.ts',
];
for (const f of files) {
  try {
    const c = fs.readFileSync(f, 'utf8');
    // count slug occurrences
    const slugs = [...c.matchAll(/slug:\s*["']([^"']+)["']/g)].map(m=>m[1]).filter(s=>!s.startsWith('_placeholder'));
    // estimate words per body - find body: `...` or body: "..."
    const bodies = [...c.matchAll(/body:\s*`([\s\S]*?)`/g)].map(m=>m[1]);
    const bodies2 = [...c.matchAll(/content:\s*`([\s\S]*?)`/g)].map(m=>m[1]);
    const allBodies = bodies.length ? bodies : bodies2;
    const wordCounts = allBodies.map(b=>b.replace(/<[^>]*>/g,' ').split(/\s+/).filter(Boolean).length);
    const avg = wordCounts.length ? Math.round(wordCounts.reduce((a,b)=>a+b,0)/wordCounts.length) : 0;
    const min = wordCounts.length ? Math.min(...wordCounts) : 0;
    const max = wordCounts.length ? Math.max(...wordCounts) : 0;
    console.log(`${f.padEnd(40)} slugs=${String(slugs.length).padStart(2)} bodies=${String(allBodies.length).padStart(2)} avg=${String(avg).padStart(4)} min=${String(min).padStart(3)} max=${String(max).padStart(4)}`);
    if (slugs.length <= 8) console.log('  slugs:', slugs.join(', '));
  } catch(e:any){ console.log(f+': missing - '+e.message)}
}
