/**
 * merge-deepened.ts
 * Reads Blogs.txt, finds exam guide sections by slug, and replaces them
 * with the deepened content from batch1-exams.txt.
 */
import fs from 'node:fs';
import path from 'node:path';

const PROJECT_ROOT = process.cwd();
const BLOGS_FILE = path.join(PROJECT_ROOT, 'Blogs.txt');
const DEEPENING_FILE = path.join(PROJECT_ROOT, 'deepening', 'batch1-exams.txt');

// Parse the deepening file to extract new content by slug
function parseDeepenedContent(file: string): Map<string, { frontmatter: string; body: string }> {
  const raw = fs.readFileSync(file, 'utf-8');
  const result = new Map<string, { frontmatter: string; body: string }>();

  const sections = raw.split(/EXAM_GUIDE_START:/).slice(1);
  for (const section of sections) {
    const endMatch = section.match(/EXAM_GUIDE_END:(\S+)/);
    if (!endMatch) continue;
    const slug = endMatch[1].trim();

    const content = section.substring(0, section.indexOf(`EXAM_GUIDE_END:${slug}`)).trim();

    // Split frontmatter from body
    const fmStart = content.indexOf('---');
    const fmEnd = content.indexOf('---', fmStart + 3);
    if (fmStart < 0 || fmEnd < 0) continue;

    const frontmatter = content.substring(fmStart, fmEnd + 3);
    const body = content.substring(fmEnd + 3).trim();

    result.set(slug, { frontmatter, body });
  }

  return result;
}

// Parse Blogs.txt to find blog sections by slug
function findBlogSections(blogsContent: string): Array<{
  slug: string;
  startIndex: number;
  endIndex: number;
  headerLine: string;
}> {
  const results: Array<{
    slug: string;
    startIndex: number;
    endIndex: number;
    headerLine: string;
  }> = [];

  // Find all BLOG POST markers
  const blogMarkers = [
    ...blogsContent.matchAll(/^(={60,})\nBLOG POST #(\d+): (.+)\n\1$/gm),
  ];

  for (let i = 0; i < blogMarkers.length; i++) {
    const match = blogMarkers[i];
    const markerStart = match.index!;
    const blogNumber = parseInt(match[2]);
    const blogTitle = match[3];

    // Find the slug in the frontmatter after this marker
    const afterMarker = blogsContent.substring(markerStart);
    const slugMatch = afterMarker.match(/slug:\s*(\S+)/);
    if (!slugMatch) continue;

    const slug = slugMatch[1].trim();

    // Find the end of this blog section
    let endIndex: number;
    if (i + 1 < blogMarkers.length) {
      // End before the next blog's separator line (two lines before)
      endIndex = blogMarkers[i + 1].index! - 1;
      // Go back to find the END OF BLOG POST line
      const beforeNext = blogsContent.substring(0, blogMarkers[i + 1].index!);
      const endMarker = beforeNext.lastIndexOf('END OF BLOG POST');
      if (endMarker > markerStart) {
        const endSepLine = beforeNext.lastIndexOf('=', endMarker);
        endIndex = endSepLine > markerStart ? endSepLine + 61 : endIndex;
      }
    } else {
      // Last blog — end of file
      endIndex = blogsContent.length;
    }

    results.push({
      slug,
      startIndex: markerStart,
      endIndex,
      headerLine: match[0],
    });
  }

  return results;
}

function main() {
  console.log('📝 merge-deepened.ts — Merging deepened content into Blogs.txt');

  // Read files
  const blogsContent = fs.readFileSync(BLOGS_FILE, 'utf-8');
  const deepened = parseDeepenedContent(DEEPENING_FILE);

  console.log(`  Found ${deepened.size} deepened articles`);
  console.log(`  Deepened slugs: ${[...deepened.keys()].join(', ')}`);

  // Find blog sections
  const sections = findBlogSections(blogsContent);
  console.log(`  Found ${sections.length} blog sections in Blogs.txt`);

  // Build replacement map
  let updatedContent = blogsContent;
  let replaced = 0;

  for (const section of sections) {
    const deep = deepened.get(section.slug);
    if (!deep) continue;

    console.log(`  Replacing: ${section.slug} (was ${section.endIndex - section.startIndex} chars)`);

    const separator = '='.repeat(80);
    const blogNumber = section.headerLine.match(/BLOG POST #(\d+)/)?.[1] || '??';
    const blogLabel = section.headerLine.match(/BLOG POST #\d+: (.+)/)?.[1] || 'UNKNOWN';

    const newSection = `${separator}\nBLOG POST #${blogNumber}: ${blogLabel}\n${separator}\n\n${deep.frontmatter}\n\n${deep.body}\n\n${separator}\nEND OF BLOG POST #${blogNumber}\n${separator}\n`;

    updatedContent = updatedContent.substring(0, section.startIndex) + newSection + updatedContent.substring(section.endIndex);
    replaced++;
  }

  // Write updated file
  if (replaced > 0) {
    fs.writeFileSync(BLOGS_FILE, updatedContent, 'utf-8');
    console.log(`\n✅ Replaced ${replaced} blog sections in Blogs.txt`);
  } else {
    console.log('\n⚠️  No sections were replaced. Check slug matching.');
  }
}

main();
