import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Blog-Ghar Terms of Service - Rules and guidelines for using our platform.',
  alternates: { canonical: 'https://bloghar.com/terms' },
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-display font-extrabold mb-6">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: September 2026</p>

      <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
        <h2>Acceptance of Terms</h2>
        <p>By accessing and using Blog-Ghar, you accept and agree to be bound by the terms and conditions set forth in this agreement.</p>

        <h2>Use License</h2>
        <p>Permission is granted to temporarily access the materials on Blog-Ghar for personal, non-commercial use only. This is the grant of a license, not a transfer of title.</p>

        <h2>Disclaimer</h2>
        <p>The materials on Blog-Ghar are provided "as is". We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties.</p>

        <h2>Limitations</h2>
        <p>In no event shall Blog-Ghar or its suppliers be liable for any damages arising out of the use or inability to use the materials.</p>

        <h2>Governing Law</h2>
        <p>These terms and conditions are governed by and construed in accordance with the laws of India.</p>
      </div>
    </div>
  );
}
