import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EMI Calculator',
  description: 'Calculate loan EMI (Equated Monthly Installment) online free. Get detailed amortization schedule.',
  openGraph: { title: 'EMI Calculator', description: 'Calculate loan EMI online free.', type: 'website' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
