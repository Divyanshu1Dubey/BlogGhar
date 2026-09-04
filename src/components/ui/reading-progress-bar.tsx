'use client';

import { useEffect } from 'react';

export function ReadingProgressBar() {
  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;

      const bar = document.getElementById('reading-progress-bar');
      if (bar) {
        bar.style.width = `${scrolled}%`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-gray-100 dark:bg-dark-border">
      <div
        id="reading-progress-bar"
        className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-150"
        style={{ width: '0%' }}
      />
    </div>
  );
}
