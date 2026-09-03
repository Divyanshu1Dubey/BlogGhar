import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Advertise With Us | Blog-Ghar',
  description: 'Reach thousands of daily readers on Blog-Ghar. Advertise your brand, product, or service with our affordable ad packages.',
  alternates: { canonical: 'https://bloghar.com/advertise' },
};

export default function AdvertisePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-display font-extrabold mb-4">📢 Advertise With Blog-Ghar</h1>
      <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
        Reach a global audience of readers interested in technology, lifestyle, education, and entertainment.
        We offer banner ads, sponsored posts, and newsletter placements.
      </p>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <div className="card p-5 text-center">
          <p className="text-3xl font-bold text-primary-600">10K+</p>
          <p className="text-sm text-gray-500">Monthly Visitors</p>
        </div>
        <div className="card p-5 text-center">
          <p className="text-3xl font-bold text-primary-600">50+</p>
          <p className="text-sm text-gray-500">Countries</p>
        </div>
        <div className="card p-5 text-center">
          <p className="text-3xl font-bold text-primary-600">30+</p>
          <p className="text-sm text-gray-500">Free Tools</p>
        </div>
      </div>

      {/* Ad Packages */}
      <h2 className="text-2xl font-display font-bold mb-6">Ad Packages</h2>
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <div className="card p-6">
          <h3 className="font-display font-bold text-lg mb-1">Banner Ad</h3>
          <p className="text-3xl font-bold text-primary-600 mb-3">$49<span className="text-sm text-gray-500">/week</span></p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>✓ 728×90 leaderboard</li>
            <li>✓ Homepage placement</li>
            <li>✓ 30-day campaign</li>
          </ul>
        </div>
        <div className="card p-6 border-2 border-primary-500 relative">
          <span className="absolute -top-2 left-4 bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">Popular</span>
          <h3 className="font-display font-bold text-lg mb-1">Sponsored Post</h3>
          <p className="text-3xl font-bold text-primary-600 mb-3">$99<span className="text-sm text-gray-500">/post</span></p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>✓ Full article placement</li>
            <li>✓ Social media share</li>
            <li>✓ Backlink included</li>
          </ul>
        </div>
        <div className="card p-6">
          <h3 className="font-display font-bold text-lg mb-1">Newsletter</h3>
          <p className="text-3xl font-bold text-primary-600 mb-3">$149<span className="text-sm text-gray-500">/edition</span></p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>✓ Featured in email</li>
            <li>✓ 5K+ subscribers</li>
            <li>✓ Click tracking</li>
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div className="card p-8 bg-gradient-to-r from-primary-600 to-primary-800 text-white text-center">
        <h2 className="text-2xl font-display font-bold mb-2">Ready to Get Started?</h2>
        <p className="text-primary-100 mb-4">Email us at advertise@bloghar.com or fill out the form below.</p>
        <Link href="/contact" className="inline-block bg-white text-primary-700 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
          Contact Us →
        </Link>
      </div>

      {/* Sample ad slots showcase */}
      <div className="mt-10">
        <h2 className="text-2xl font-display font-bold mb-4">Ad Placement Examples</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Your ad could appear in these locations across Blog-Ghar:</p>
        <div className="space-y-4">
          <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center">
            <p className="text-xs text-gray-500 mb-2">Leaderboard (728×90) — Homepage</p>
            <div className="bg-gray-100 dark:bg-dark-card rounded h-[90px] flex items-center justify-center">
              <span className="text-gray-400 text-sm">Your Ad Here (728×90)</span>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500 mb-2">Sidebar (300×250)</p>
              <div className="bg-gray-100 dark:bg-dark-card rounded h-[250px] flex items-center justify-center max-w-[300px] mx-auto">
                <span className="text-gray-400 text-sm">Your Ad Here (300×250)</span>
              </div>
            </div>
            <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500 mb-2">In-Feed Native</p>
              <div className="bg-gray-100 dark:bg-dark-card rounded h-[250px] flex items-center justify-center">
                <span className="text-gray-400 text-sm">Native Ad Placement</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
