import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Blog-Ghar',
  description: 'Learn about Blog-Ghar - your one-stop destination for blogs, games, news, online tools, horoscopes, and more.',
  alternates: { canonical: 'https://blogghar.com/about' },
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-display font-extrabold mb-6">About Blog-Ghar</h1>

      <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
        <p className="text-lg">
          Welcome to <strong>Blog-Ghar</strong> (Hindi for "Home of Blogs") — your ultimate online destination for diverse content, tools, games, and entertainment. We are passionate about creating a platform where users can discover, learn, and have fun all in one place.
        </p>

        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Our Mission</h2>
        <p>
          Our mission is to provide high-quality, free content and tools that make everyday tasks easier, learning more accessible, and browsing more enjoyable. From informative blog posts across multiple niches to interactive mini-games and powerful online tools — we aim to serve everyone, everywhere.
        </p>

        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">What We Offer</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { icon: '📝', title: 'Blogs & Articles', desc: 'Tech, lifestyle, finance, health, and more.' },
            { icon: '🎮', title: 'Mini Games', desc: 'Puzzles, quizzes, and fun browser games.' },
            { icon: '🔧', title: 'Free Online Tools', desc: 'Calculators, converters, generators & more.' },
            { icon: '📰', title: 'News Aggregator', desc: 'Latest news from around the world.' },
            { icon: '🔮', title: 'Horoscope', desc: 'Daily, weekly, and monthly predictions.' },
            { icon: '💬', title: 'Community', desc: 'Forums, Q&A, and job board.' },
          ].map((item) => (
            <div key={item.title} className="card p-4">
              <span className="text-2xl">{item.icon}</span>
              <h3 className="font-semibold mt-2">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Why Blog-Ghar?</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>100% free tools and content — no hidden charges</li>
          <li>Privacy-first approach — we don't sell your data</li>
          <li>SEO-optimized, high-quality content for genuine value</li>
          <li>Mobile-responsive design for all devices</li>
          <li>Dark mode support for comfortable browsing</li>
          <li>Regular updates with fresh content daily</li>
        </ul>

        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Contact Us</h2>
        <p>
          Have questions, feedback, or partnership inquiries? We&apos;d love to hear from you. Reach out at{' '}
          <Link href="mailto:hello@blogghar.com" className="text-primary-600 hover:underline">hello@blogghar.com</Link>
        </p>

        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Join Our Community</h2>
        <p>
          Stay connected with us on social media for the latest updates, tips, and community highlights.
        </p>
      </div>

      <script
        id="about-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: 'About Blog-Ghar',
            description: 'Learn about Blog-Ghar - your one-stop destination for blogs, games, news, online tools, and more.',
            url: 'https://blogghar.com/about',
            mainEntity: {
              '@type': 'Organization',
              name: 'Blog-Ghar',
              url: 'https://blogghar.com',
              description: 'Your one-stop destination for blogs, games, news, tools & more.',
            },
          }),
        }}
      />
    </div>
  );
}
