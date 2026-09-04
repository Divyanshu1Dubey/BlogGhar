'use client';

import { useEffect, useRef, useState } from 'react';

interface AdSlotProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  style?: React.CSSProperties;
  className?: string;
  label?: string;
}

export function AdSlot({ slot, format = 'auto', style, className = '', label }: AdSlotProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const adSenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  useEffect(() => {
    if (!adSenseClient) {
      setShowPlaceholder(true);
      return;
    }
    // Small delay to allow AdSense script to load
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        try {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
          setIsLoaded(true);
        } catch (err) {
          console.warn('AdSense push error:', err);
          setShowPlaceholder(true);
        }
      } else {
        // AdSense not loaded yet, show placeholder
        setShowPlaceholder(true);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [adSenseClient]);

  if (!adSenseClient || showPlaceholder) {
    const heights: Record<string, string> = {
      horizontal: '90px',
      rectangle: '250px',
      vertical: '600px',
      auto: '250px',
    };
    return (
      <div
        className={`bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center gap-1 ${className}`}
        style={{ minHeight: heights[format] || '250px', ...style }}
      >
        <span className="text-gray-400 text-xs">Advertisement</span>
        {label && <span className="text-gray-300 text-[10px]">{label}</span>}
        <span className="text-gray-300 text-[10px]">{slot}</span>
      </div>
    );
  }

  const adStyles: Record<string, React.CSSProperties> = {
    horizontal: { display: 'block', textAlign: 'center', minHeight: '90px' },
    rectangle: { display: 'block', textAlign: 'center', minHeight: '250px' },
    vertical: { display: 'block', textAlign: 'center', minHeight: '600px' },
    auto: { display: 'block', textAlign: 'center' },
  };

  return (
    <div ref={adRef} className={`ad-slot ${isLoaded ? 'ad-loaded' : ''} ${className}`}>
      <ins
        className="adsbygoogle"
        style={adStyles[format]}
        data-ad-client={adSenseClient}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

// ─── In-Article Ad ─────────────────────────────────────────────────────

export function InArticleAd({ slot = 'inarticle-mid' }: { slot?: string }) {
  const adSenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  if (!adSenseClient) {
    return (
      <div className="my-8 bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center py-6">
        <span className="text-gray-400 text-xs">In-Article Advertisement</span>
      </div>
    );
  }

  return (
    <div className="my-8">
      <div className="text-center text-[10px] text-gray-400 mb-2 uppercase tracking-wider">Advertisement</div>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center', minHeight: '250px' }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client={adSenseClient}
        data-ad-slot={slot}
      />
    </div>
  );
}

// ─── Sticky Sidebar Ad ─────────────────────────────────────────────────

export function StickySidebarAd({ slot }: { slot: string }) {
  const adSenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  if (!adSenseClient) {
    return (
      <div className="sticky top-20 bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center" style={{ width: '300px', height: '600px' }}>
        <span className="text-gray-400 text-xs text-center px-4">Sidebar Ad<br />{slot}</span>
      </div>
    );
  }

  return (
    <div className="sticky top-20">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '300px', height: '600px' }}
        data-ad-client={adSenseClient}
        data-ad-slot={slot}
        data-ad-format="vertical"
      />
    </div>
  );
}

// ─── Banner Ad (Top/Bottom) ────────────────────────────────────────────

export function BannerAd({ slot, position = 'top' }: { slot: string; position?: 'top' | 'bottom' }) {
  const adSenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  if (!adSenseClient) {
    return (
      <div className={`w-full bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center ${position === 'top' ? 'mb-6' : 'mt-6'}`} style={{ minHeight: '90px' }}>
        <span className="text-gray-400 text-xs">Banner Ad ({position}) - {slot}</span>
      </div>
    );
  }

  return (
    <div className={`w-full ${position === 'top' ? 'mb-6' : 'mt-6'}`}>
      <div className="text-center text-[10px] text-gray-400 mb-1">Advertisement</div>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center', minHeight: '90px', width: '100%' }}
        data-ad-client={adSenseClient}
        data-ad-slot={slot}
        data-ad-format="horizontal"
        data-full-width-responsive="true"
      />
    </div>
  );
}

// ─── Grid Ad ──────────────────────────────────────────────────────────

export function GridAd({ slot, cols = 2 }: { slot: string; cols?: number }) {
  const adSenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  if (!adSenseClient) {
    return (
      <div
        className="bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center"
        style={{
          minHeight: '250px',
          gridColumn: `span ${cols}`,
        }}
      >
        <span className="text-gray-400 text-xs">Grid Ad ({cols} cols) - {slot}</span>
      </div>
    );
  }

  return (
    <div
      className="bg-gray-50 dark:bg-dark-bg rounded-lg overflow-hidden"
      style={{ gridColumn: `span ${cols}` }}
    >
      <div className="text-center text-[10px] text-gray-400 py-1">Sponsored</div>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center', minHeight: '250px' }}
        data-ad-client={adSenseClient}
        data-ad-slot={slot}
        data-ad-format="rectangle"
      />
    </div>
  );
}

// ─── Ad Container with Lazy Loading ────────────────────────────────────

export function AdContainer({ children, label = 'Sponsored' }: { children: React.ReactNode; label?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="ad-container">
      {isVisible && children}
      {!isVisible && (
        <div className="bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center" style={{ minHeight: '250px' }}>
          <span className="text-gray-400 text-xs">{label}</span>
        </div>
      )}
    </div>
  );
}
