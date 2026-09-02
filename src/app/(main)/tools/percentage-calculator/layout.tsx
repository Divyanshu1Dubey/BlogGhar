import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Percentage Calculator',
  description: 'Calculate percentages online free. Find percentage of a number, increase/decrease percentage, and more.',
  openGraph: { title: 'Percentage Calculator', description: 'Calculate percentages online free.', type: 'website' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
