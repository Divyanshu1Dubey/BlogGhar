import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Blog-Ghar Privacy Policy - Learn how we collect, use, and protect your personal information.',
  alternates: { canonical: 'https://bloghar.com/privacy' },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-display font-extrabold mb-6">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: September 2026</p>

      <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
        <h2>Information We Collect</h2>
        <p>We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us. This may include your name, email address, and any other information you choose to provide.</p>

        <h2>How We Use Your Information</h2>
        <p>We use the information we collect to provide, maintain, and improve our services, communicate with you, and comply with legal obligations.</p>

        <h2>Cookies</h2>
        <p>We use cookies and similar tracking technologies to track activity on our website and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>

        <h2>Third-Party Services</h2>
        <p>We may use third-party services like Google AdSense, Google Analytics, and Resend for newsletters. These services have their own privacy policies governing their use of your data.</p>

        <h2>Data Security</h2>
        <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.</p>

        <h2>Contact</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at <Link href="mailto:hello@bloghar.com" className="text-primary-600 hover:underline">hello@bloghar.com</Link>.</p>
      </div>
    </div>
  );
}
