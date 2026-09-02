import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Online Tools',
  description: '30+ free online tools including calculators, converters, and text tools. No registration required!',
  alternates: { canonical: 'https://blogghar.com/tools' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
