import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Daily Horoscope - All Zodiac Signs',
  description: 'Get your free daily, weekly, and monthly horoscope for all 12 zodiac signs. Love, career, health predictions and lucky numbers.',
  openGraph: { title: 'Free Daily Horoscope', description: 'Daily horoscope readings for all zodiac signs.', type: 'website' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
