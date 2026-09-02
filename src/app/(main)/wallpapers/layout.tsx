import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HD Wallpapers - Free Download',
  description: 'Download stunning HD wallpapers for phone, tablet, and desktop. Free high-resolution backgrounds in Nature, City, Space, Abstract categories.',
  openGraph: { title: 'HD Wallpapers - Free Download', description: 'Free HD wallpapers for all devices.', type: 'website' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
