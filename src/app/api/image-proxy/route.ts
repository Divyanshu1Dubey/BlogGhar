import { NextResponse } from 'next/server';

export const runtime = 'edge';

const COLOR_MAP: Record<string, string> = {
  technology: ['#6366f1', '#818cf8'],
  lifestyle: ['#f59e0b', '#fbbf24'],
  education: ['#3b82f6', '#60a5fa'],
  finance: ['#10b981', '#34d399'],
  entertainment: ['#ef4444', '#f87171'],
  health: ['#ec4899', '#f472b6'],
  exams: ['#8b5cf6', '#a78bfa'],
  jobs: ['#06b6d4', '#22d3ee'],
  default: ['#6b7280', '#9ca3af'],
};

function getCategoryColor(category: string): [string, string] {
  const key = category.toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const [k, v] of Object.entries(COLOR_MAP)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  return COLOR_MAP.default;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const src = searchParams.get('url');
  const category = searchParams.get('category') || 'default';

  if (!src) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  // For external URLs, fetch them through the proxy
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(src, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'BlogGhar-ImageProxy/1.0',
        'Accept': 'image/*',
      },
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const buffer = await response.arrayBuffer();
      const contentType = response.headers.get('content-type') || 'image/jpeg';
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=86400, immutable',
        },
      });
    }
  } catch {
    // fall through to placeholder
  }

  // Serve SVG placeholder
  const [color1, color2] = getCategoryColor(category);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${color1}"/>
        <stop offset="100%" style="stop-color:${color2}"/>
      </linearGradient>
    </defs>
    <rect width="800" height="450" fill="url(#g)"/>
    <text x="400" y="230" text-anchor="middle" font-family="system-ui,sans-serif" font-size="48" opacity="0.3" fill="white">${category}</text>
    <text x="400" y="275" text-anchor="middle" font-family="system-ui,sans-serif" font-size="20" opacity="0.5" fill="white">Blog-Ghar</text>
  </svg>`;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400, immutable',
    },
  });
}
