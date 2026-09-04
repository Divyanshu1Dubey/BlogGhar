import * as fs from 'node:fs';
function countFile(f: string){
  const c = fs.readFileSync(f,'utf8');
  const slugs = [...c.matchAll(/["']([a-z0-9][a-z0-9-]{6,})["']/g)].map(m=>m[1]).filter(s=>s.includes('-') && !s.startsWith('_') && s.length>10);
  // For f()/fix helper files, count unique slugs
  const fCalls = [...c.matchAll(/\bf\(\s*["'][^"']+["'],\s*["']([^"']+)["']/g)].map(m=>m[1]);
  const fixCalls = [...c.matchAll(/\bfix\(\s*["'][^"']+["'],\s*["']([^"']+)["']/g)].map(m=>m[1]);
  const helperSlugs = fCalls.length? fCalls : (fixCalls.length? fixCalls : []);
  if(helperSlugs.length){
    console.log(`  helper slugs (${helperSlugs.length}): ${helperSlugs.join(', ')}`);
    // measure body size: take text between body: ` and `,
    const bodies = [...c.matchAll(/`([\s\S]*?)`\s*\)\s*,/g)].map(m=>m[1]);
    const wcs = bodies.map(b=>b.replace(/<[^>]*>/g,' ').split(/\s+/).filter(Boolean).length);
    const avg = wcs.length? Math.round(wcs.reduce((a,b)=>a+b,0)/wcs.length):0;
    console.log(`  bodies=${bodies.length} avg=${avg} min=${wcs.length?Math.min(...wcs):0} max=${wcs.length?Math.max(...wcs):0}`);
  }
}
countFile('deepening/batch7-fixed2.ts');
countFile('deepening/batch8-fixed.ts');
countFile('deepening/batch8-expansion-remaining.ts');
countFile('deepening/batch9-deep-outer.ts');
countFile('deepening/batch7-asia-remaining1.ts');
