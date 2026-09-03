import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HD Wallpapers - Free Download | Blog-Ghar',
  description: 'Download stunning HD wallpapers for your phone, tablet, and desktop. Free high-quality wallpapers in Nature, City, Space, Abstract categories.',
  alternates: { canonical: 'https://bloghar.com/wallpapers' },
};

export default function WallpapersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
