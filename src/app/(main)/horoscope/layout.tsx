import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daily Horoscope',
  description: 'Get your daily horoscope for all zodiac signs. Check love, career, and health predictions.',
  alternates: { canonical: 'https://bloghar.com/horoscope' },
};

export default function HoroscopeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
