import { Metadata } from 'next';
import SearchPageClient from './search-client';

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search blogs, games, news, tools, and community posts on Blog-Ghar.',
  alternates: { canonical: 'https://bloghar.com/search' },
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  return <SearchPageClient initialQuery={params.q} />;
}
