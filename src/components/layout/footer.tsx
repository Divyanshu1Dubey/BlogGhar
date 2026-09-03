'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const footerSections = [
  {
    title: 'Quick Links',
    links: [
      { name: 'Blog', href: '/blog' },
      { name: 'Games', href: '/games' },
      { name: 'Tools', href: '/tools' },
      { name: 'News', href: '/news' },
      { name: 'Horoscope', href: '/horoscope' },
      { name: 'Forum', href: '/forum' },
      { name: 'Q&A', href: '/qa' },
      { name: 'Jobs', href: '/jobs' },
    ],
  },
  {
    title: 'Categories',
    links: [
      { name: 'Technology', href: '/blog?category=technology' },
      { name: 'Lifestyle', href: '/blog?category=lifestyle' },
      { name: 'Education', href: '/blog?category=education' },
      { name: 'Finance', href: '/blog?category=finance' },
      { name: 'Entertainment', href: '/blog?category=entertainment' },
      { name: 'Health', href: '/blog?category=health' },
    ],
  },
  {
    title: 'Support',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Advertise', href: '/advertise' },
      { name: 'Disclaimer', href: '/disclaimer' },
    ],
  },
];

const socialLinks = [
  { name: 'Twitter', href: 'https://twitter.com/bloghar', icon: 'Twitter' },
  { name: 'Facebook', href: 'https://facebook.com/bloghar', icon: 'Facebook' },
  { name: 'Instagram', href: 'https://instagram.com/bloghar', icon: 'Instagram' },
  { name: 'YouTube', href: 'https://youtube.com/@bloghar', icon: 'YouTube' },
  { name: 'RSS', href: '/rss.xml', icon: 'RSS' },
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [mobileOpenSections, setMobileOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (title: string) => {
    setMobileOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubmitted(true);
        setEmail('');
      } else {
        setError('Subscription failed. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto" role="contentinfo">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-xl font-display font-bold text-white">Stay Updated</h3>
              <p className="text-gray-400 text-sm mt-1 max-w-md">
                Get the latest blogs, games, tools, and news delivered to your inbox. No spam, unsubscribe anytime.
              </p>
            </div>
            {submitted ? (
              <div className="px-6 py-3 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium">
                Subscribed successfully! Check your inbox.
              </div>
            ) : error ? (
              <div className="px-6 py-3 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium">{error}</div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 w-full lg:w-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  aria-label="Email address for newsletter"
                  className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 w-full lg:w-72"
                  required
                />
                <button type="submit" className="btn-primary whitespace-nowrap">
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-1 group" aria-label="Blog-Ghar Home">
              <span className="text-2xl font-display font-extrabold text-white group-hover:text-primary-400 transition-colors">
                Blog<span className="text-primary-400">Ghar</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm mt-3 leading-relaxed">
              Your one-stop destination for blogs, games, news, online tools, horoscopes, and more. Free content updated daily.
            </p>
            <div className="flex gap-3 mt-5">
              {socialLinks.slice(0, 4).map((social) => (
                <SocialIcon key={social.name} href={social.href} label={social.name} />
              ))}
            </div>
          </div>

          {/* Link Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{section.title}</h4>
              <ul className="space-y-2.5" role="list">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-primary-400 transition-colors inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Blog-Ghar. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-500 flex items-center gap-1.5">
                Made with <HeartIcon /> in India
              </p>
              <button
                onClick={scrollToTop}
                aria-label="Back to top"
                className="text-sm text-primary-400 hover:text-primary-300 font-medium flex items-center gap-1 transition-colors"
              >
                Back to top
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow"
      aria-label={label}
      className="p-2.5 bg-gray-800 rounded-lg hover:bg-primary-600 hover:scale-110 hover:-translate-y-0.5 text-gray-400 hover:text-white transition-all duration-200"
    >
      <SocialIconSvg name={label} />
    </a>
  );
}

function SocialIconSvg({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    Twitter: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    Facebook: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
          clipRule="evenodd"
        />
      </svg>
    ),
    Instagram: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
          clipRule="evenodd"
        />
      </svg>
    ),
    YouTube: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3z"
          clipRule="evenodd"
        />
      </svg>
    ),
    RSS: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248-1.796 0-3.252-1.454-3.252-3.248 0-1.794 1.456-3.248 3.252-3.248 1.795.001 3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.817c-.062-8.71-7.118-15.758-15.839-15.82zm0-3.368c10.58.046 19.152 8.594 19.183 19.188h4.817c-.03-13.231-10.739-23.98-24-24.026v4.838z" />
      </svg>
    ),
  };
  return <>{icons[name] || null}</>;
}

function HeartIcon() {
  return (
    <svg className="w-4 h-4 text-red-500 fill-red-500 inline-block" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
