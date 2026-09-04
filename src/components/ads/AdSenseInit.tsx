'use client';

import { useEffect } from 'react';

const AD_SLOTS = {
  HORIZONTAL: 'horizontal-leaderboard',
  RECTANGLE: 'rectangle-medium',
  SIDEBAR: 'sidebar-skyscraper',
  INARTICLE: 'inarticle-mid',
  GRID_1: 'grid-rectangle-1',
  GRID_2: 'grid-rectangle-2',
  GRID_3: 'grid-rectangle-3',
  MOBILE_BANNER: 'mobile-banner',
  FEED: 'feed-native',
};

export { AD_SLOTS };

export default function AdSenseInit() {
  useEffect(() => {
    const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
    if (!client) return;

    try {
      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);

      script.onload = () => {
        console.log('AdSense script loaded');
      };

      script.onerror = () => {
        console.warn('AdSense script failed to load');
      };
    } catch (e) {
      console.warn('AdSense init error:', e);
    }
  }, []);

  return null;
}
