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

const posts = [
  ...researchedContentEuropeAfrica,
  ...researchedContentAsiaOceania,
  ...researchedContentAmericasTech,
  ...researchedContentFoodRecipes,
  ...researchedContentHealthFitness,
  ...researchedContentIndianCulture,
  ...researchedContentMoneyTech,
  ...researchedContentScienceSpace,
  ...researchedContentWorldHistory,
  ...researchedContentIndia2026,
  ...deepenedBlogs,
];

console.log('Total researched posts:', posts.length);
console.log('New 2026 blogs:', researchedContentIndia2026.length, '| Deepened blogs:', deepenedBlogs.length);
