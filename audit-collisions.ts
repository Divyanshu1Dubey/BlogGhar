import { deepenedAmericasPosts } from './deepening/batch4-americas-tech';
import { deepenedEuropeAfricaPosts } from './deepening/batch5-europe-africa';
import { deepenedRegionalV2Posts } from './deepening/batch6-regional-v2';
import { deepenedAsiaRemaining1Posts } from './deepening/batch7-asia-remaining1';
import { deepenedExpansionRemainingPosts } from './deepening/batch8-expansion-remaining';
import { deepenedOuterPosts } from './deepening/batch9-deep-outer';
import { deepenedExamJobPosts } from './deepening/batch10-exams-jobs';
import { deepenedTechFinancePosts } from './deepening/batch10-tech-finance';
import { deepenedAsiaPosts } from './deepening/batch10-asia-worldwide';
import { deepenedAmericasEuropePosts } from './deepening/batch10-americas-europe';

const oldSlugs = new Set([
  ...deepenedAmericasPosts.map(p => p.slug),
  ...deepenedEuropeAfricaPosts.map(p => p.slug),
  ...deepenedRegionalV2Posts.map(p => p.slug),
  ...deepenedAsiaRemaining1Posts.map(p => p.slug),
  ...deepenedExpansionRemainingPosts.map(p => p.slug),
  ...deepenedOuterPosts.map(p => p.slug),
]);

const newSlugs = new Set([
  ...deepenedExamJobPosts.map(p => p.slug),
  ...deepenedTechFinancePosts.map(p => p.slug),
  ...deepenedAsiaPosts.map(p => p.slug),
  ...deepenedAmericasEuropePosts.map(p => p.slug),
]);

const collisions = [...oldSlugs].filter(s => newSlugs.has(s));
console.log(`Collisions (old slug also in batch10): ${collisions.length}`);
for (const s of collisions) {
  const old = [...deepenedAmericasPosts, ...deepenedEuropeAfricaPosts, ...deepenedRegionalV2Posts, ...deepenedAsiaRemaining1Posts, ...deepenedExpansionRemainingPosts, ...deepenedOuterPosts].find(p => p.slug === s);
  const nw = [...deepenedExamJobPosts, ...deepenedTechFinancePosts, ...deepenedAsiaPosts, ...deepenedAmericasEuropePosts].find(p => p.slug === s);
  console.log(`  ${s}: old=${old?.body.split(/\s+/).length}w, new=${nw?.body.split(/\s+/).length}w`);
}
