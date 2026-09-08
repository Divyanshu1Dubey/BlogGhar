import { NextResponse } from 'next/server';

/**
 * Serves placeholder SVG images for /images/exams/* paths.
 * This prevents 404 floods in the browser console when exam blog images
 * reference paths that don't have corresponding files in public/images/exams/.
 */
const COLOR_MAP: Record<string, [string, string]> = {
  'exams': ['#8b5cf6', '#a78bfa'],
  'education': ['#3b82f6', '#60a5fa'],
  'technology': ['#6366f1', '#818cf8'],
  'default': ['#6b7280', '#9ca3af'],
};

function getColorsForPath(path: string): [string, string] {
  const segment = path.split('/').pop()?.toLowerCase() || '';
  for (const [name, colors] of Object.entries(COLOR_MAP)) {
    if (segment.includes(name)) return colors;
  }
  return COLOR_MAP.default;
}

export async function GET(request: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const fullPath = path.join('/');
  const [color1, color2] = getColorsForPath(fullPath);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${color1}"/>
        <stop offset="100%" style="stop-color:${color2}"/>
      </linearGradient>
    </defs>
    <rect width="800" height="450" fill="url(#g)"/>
    <text x="400" y="215" text-anchor="middle" font-family="system-ui,sans-serif" font-size="42" opacity="0.35" fill="white">📝</text>
    <text x="400" y="265" text-anchor="middle" font-family="system-ui,sans-serif" font-size="18" opacity="0.5" fill="white">Blog-Ghar</text>
  </svg>`;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400, immutable',
    },
  });
}
