import { deepenedAsiaPosts } from './deepening/batch10-asia-worldwide';
import { deepenedAmericasEuropePosts } from './deepening/batch10-americas-europe';
import { deepenedExamJobPosts } from './deepening/batch10-exams-jobs';
import { deepenedTechFinancePosts } from './deepening/batch10-tech-finance';

const all = [...deepenedAsiaPosts, ...deepenedAmericasEuropePosts, ...deepenedExamJobPosts, ...deepenedTechFinancePosts];
for (const p of all) {
  const wc = p.body.split(/\s+/).length;
  console.log(`${String(wc).padStart(4)}w | ${p.slug}`);
}
const under2k = all.filter(p => p.body.split(/\s+/).length < 1500);
console.log(`\nTotal batch10: ${all.length}, Under 1500 words: ${under2k.length}`);
