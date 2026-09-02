import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Text Case Converter',
  description: 'Convert text between uppercase, lowercase, title case, camelCase and more. Free online tool.',
  openGraph: { title: 'Text Case Converter', description: 'Convert text between different cases online free.', type: 'website' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
