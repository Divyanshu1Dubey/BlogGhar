import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Blog-Ghar - We are here to help with any questions, feedback, or partnerships.',
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-display font-extrabold mb-6">Contact Us</h1>

      <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
        <p>We&apos;d love to hear from you! Whether you have a question, feedback, business inquiry, or partnership opportunity — reach out and we&apos;ll respond as soon as we can.</p>

        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { title: 'General Inquiries', email: 'hello@blogghar.com', icon: '📧' },
            { title: 'Advertise With Us', email: 'advertise@blogghar.com', icon: '📢' },
            { title: 'Submit Content', email: 'submit@blogghar.com', icon: '✍️' },
            { title: 'Press & Media', email: 'press@blogghar.com', icon: '📰' },
          ].map((c) => (
            <div key={c.title} className="card p-5">
              <span className="text-3xl">{c.icon}</span>
              <h3 className="font-semibold mt-2">{c.title}</h3>
              <Link href={`mailto:${c.email}`} className="text-sm text-primary-600 hover:underline">{c.email}</Link>
            </div>
          ))}
        </div>

        <h2>Other Ways to Reach Us</h2>
        <ul>
          <li>Twitter: <Link href="https://twitter.com/blogghar" className="text-primary-600 hover:underline">@blogghar</Link></li>
          <li>GitHub: <Link href="https://github.com/blogghar" className="text-primary-600 hover:underline">github.com/blogghar</Link></li>
        </ul>
      </div>
    </div>
  );
}
