import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Word Counter',
  description: 'Count words, characters, sentences, and paragraphs online free.',
  openGraph: { title: 'Word Counter', description: 'Count words, characters, and more online free.', type: 'website' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
