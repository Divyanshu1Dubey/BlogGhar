'use client';

import { useEffect, useRef } from 'react';

interface AdSlotProps {
  slot: string;
  format?: string;
  responsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function AdSlot({ slot, format = 'auto', responsive = true, style, className }: AdSlotProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const adSenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (err) {
      console.warn('AdSense push error:', err);
    }
  }, []);

  if (!adSenseClient) {
    // Show placeholder when AdSense is not configured
    return (
      <div
        className={`bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center ${className || ''}`}
        style={{ minHeight: '250px', ...style }}
      >
        <span className="text-gray-400 text-sm">Ad Space ({slot})</span>
      </div>
    );
  }

  return (
    <div
      ref={adRef}
      className={className}
      style={style}
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={adSenseClient}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
