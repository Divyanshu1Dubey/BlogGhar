import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BMI Calculator',
  description: 'Calculate your Body Mass Index (BMI) free online. Supports metric (kg/cm) and imperial (ft/lbs) units.',
  openGraph: { title: 'BMI Calculator', description: 'Calculate your Body Mass Index free online.', type: 'website' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
