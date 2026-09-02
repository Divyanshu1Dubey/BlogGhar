import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Age Calculator',
  description: 'Calculate your exact age in years, months, and days. Free online age calculator.',
  openGraph: { title: 'Age Calculator', description: 'Calculate your exact age in years, months, and days.', type: 'website' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
