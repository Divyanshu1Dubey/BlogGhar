import { Metadata } from 'next';
import CommunityClient from './community-client';

export const metadata: Metadata = {
  title: 'Community',
  description: 'Share thoughts, discoveries, questions, and useful links with the Blog-Ghar community.',
  alternates: { canonical: 'https://bloghar.com/community' },
};

export default function CommunityPage() {
  return <CommunityClient />;
}
