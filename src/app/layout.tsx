import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Blog-Ghar - Home of Blogs | Games, News, Tools & More',
    template: '%s | Blog-Ghar',
  },
  description: 'Blog-Ghar is your one-stop destination for blogs, games, news, online tools, horoscopes, and more. Play games, read articles, calculate, convert, and discover daily.',
  keywords: ['blog', 'games', 'news', 'tools', 'calculator', 'horoscope', 'quizzes', 'entertainment', 'free tools', 'online games'],
  authors: [{ name: 'Blog-Ghar' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://blogghar.com',
    siteName: 'Blog-Ghar',
    title: 'Blog-Ghar - Home of Blogs',
    description: 'Your one-stop destination for blogs, games, news, tools & more.',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} font-sans min-h-screen flex flex-col bg-white dark:bg-dark-bg text-gray-900 dark:text-gray-100`}>
        {children}
      </body>
    </html>
  );
}
