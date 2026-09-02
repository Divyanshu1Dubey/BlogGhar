import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { template: '%s | Blog-Ghar', default: 'Authentication' },
  robots: { index: false, follow: false },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
