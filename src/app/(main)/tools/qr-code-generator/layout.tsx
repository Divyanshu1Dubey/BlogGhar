import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'QR Code Generator',
  description: 'Generate free QR codes online. Create custom QR codes for URLs, text, phone numbers and more.',
  openGraph: { title: 'QR Code Generator', description: 'Generate free QR codes online.', type: 'website' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
