'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';

const footerLinks = {
  content: [
    { name: 'Blog', href: '/blog' },
    { name: 'Games', href: '/games' },
    { name: 'Tools', href: '/tools' },
    { name: 'News', href: '/news' },
    { name: 'Horoscope', href: '/horoscope' },
  ],
  community: [
    { name: 'Forum', href: '/forum' },
    { name: 'Q&A', href: '/qa' },
    { name: 'Jobs', href: '/jobs' },
    { name: 'Wallpapers', href: '/wallpapers' },
  ],
  tools: [
    { name: 'BMI Calculator', href: '/tools/bmi-calculator' },
    { name: 'Age Calculator', href: '/tools/age-calculator' },
    { name: 'QR Code Generator', href: '/tools/qr-code-generator' },
    { name: 'Password Generator', href: '/tools/password-generator' },
    { name: 'All Tools', href: '/tools' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      {/* Newsletter section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-display font-bold text-white">Stay Updated!</h3>
              <p className="text-gray-400 text-sm mt-1">Get the latest blogs, news, and tools delivered to your inbox.</p>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-2xl font-display font-extrabold text-white">
              Blog<span className="text-primary-400">Ghar</span>
            </Link>
            <p className="text-gray-400 text-sm mt-3">
              Your one-stop destination for blogs, games, news, tools & more.
            </p>
            <div className="flex gap-3 mt-4">
              <SocialLink href="https://twitter.com" icon={<Twitter className="w-4 h-4" />} />
              <SocialLink href="https://github.com" icon={<Github className="w-4 h-4" />} />
              <SocialLink href="https://linkedin.com" icon={<Linkedin className="w-4 h-4" />} />
              <SocialLink href="mailto:hello@bloghar.com" icon={<Mail className="w-4 h-4" />} />
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Content</h4>
            <ul className="space-y-2">
              {footerLinks.content.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-primary-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Community</h4>
            <ul className="space-y-2">
              {footerLinks.community.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-primary-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Popular Tools</h4>
            <ul className="space-y-2">
              {footerLinks.tools.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-primary-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm hover:text-primary-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="text-sm hover:text-primary-400 transition-colors">Contact Us</Link></li>
              <li><Link href="/advertise" className="text-sm hover:text-primary-400 transition-colors">Advertise</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Blog-Ghar. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
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

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full md:w-auto">
      {submitted ? (
        <div className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm">
          Subscribed successfully!
        </div>
      ) : error ? (
        <div className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm">
          {error}
        </div>
      ) : (
        <>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 w-full md:w-72"
            required
          />
          <button type="submit" className="btn-primary whitespace-nowrap">
            Subscribe
          </button>
        </>
      )}
    </form>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 bg-gray-800 rounded-lg hover:bg-primary-600 transition-colors"
    >
      {icon}
    </a>
  );
}
