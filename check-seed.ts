import { deepenedAsiaFix2Posts } from './deepening/batch7-fixed2';
import { deepenedOuterPosts } from './deepening/batch9-deep-outer';
console.log('fix2', deepenedAsiaFix2Posts.length);
console.log('outer', deepenedOuterPosts.length, 'filtered', deepenedOuterPosts.filter(p=>!p.slug.startsWith('_placeholder')).length);
