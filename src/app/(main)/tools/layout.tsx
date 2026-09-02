import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Online Tools',
  description: '30+ free online tools including calculators, converters, and text tools. No registration required!',
  openGraph: { title: 'Free Online Tools', description: '30+ free online tools including calculators, converters, and text tools.', type: 'website' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
