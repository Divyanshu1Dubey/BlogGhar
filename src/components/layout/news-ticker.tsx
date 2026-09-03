'use client';

import { useEffect, useRef } from 'react';

const TICKER_SPEED_MS = 60;

interface NewsTickerProps {
  items: { title: string; slug: string }[];
}

export function NewsTicker({ items }: NewsTickerProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isPaused = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || items.length === 0) return;

    // Duplicate items for seamless loop
    const allItems = [...items, ...items];
    track.innerHTML = '';
    const fragment = document.createDocumentFragment();

    allItems.forEach((item) => {
      const span = document.createElement('span');
      span.className = 'whitespace-nowrap inline-flex items-center gap-2';
      span.innerHTML = `<span class="text-primary-400">&#9679;</span> ${escapeHtml(item.title)}`;
      fragment.appendChild(span);
    });

    track.appendChild(fragment);

    let offset = 0;
    let rafId: number;
    const singleWidth = () => track.scrollWidth / 2;

    const tick = () => {
      if (!isPaused.current) {
        offset -= TICKER_SPEED_MS / 16;
        const sw = singleWidth();
        if (offset <= -sw) offset = 0;
        if (track) track.style.transform = `translateX(${offset}px)`;
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    const handlePause = () => { isPaused.current = true; };
    const handleResume = () => { isPaused.current = false; };

    track.addEventListener('mouseenter', handlePause);
    track.addEventListener('mouseleave', handleResume);
    track.addEventListener('touchstart', handlePause, { passive: true });
    track.addEventListener('touchend', handleResume);

    return () => {
      cancelAnimationFrame(rafId);
      track.removeEventListener('mouseenter', handlePause);
      track.removeEventListener('mouseleave', handleResume);
      track.removeEventListener('touchstart', handlePause);
      track.removeEventListener('touchend', handleResume);
    };
  }, [items]);

  if (items.length === 0) return null;

  return (
    <div className="relative w-full bg-gray-900 dark:bg-black text-white overflow-hidden select-none">
      {/* Breaking indicator */}
      <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center pl-3 bg-gradient-to-r from-gray-900 dark:from-black to-transparent">
        <span className="flex items-center gap-1.5 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          Live
        </span>
      </div>

      {/* Track */}
      <div
        className="flex items-center py-2 will-change-transform"
        style={{ paddingLeft: '4rem' }}
      >
        <div
          ref={trackRef}
          className="flex items-center gap-6"
          style={{ transition: 'none' }}
        />
      </div>

      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-gray-900 dark:from-black to-transparent pointer-events-none" />
    </div>
  );
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
