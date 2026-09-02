import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Password Generator',
  description: 'Generate strong, secure passwords online free. Customize length, characters, and copy instantly.',
  openGraph: { title: 'Password Generator', description: 'Generate strong, secure passwords online free.', type: 'website' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
