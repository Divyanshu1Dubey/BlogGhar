import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import Script from 'next/script';

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
  description: 'Blog-Ghar is your one-stop destination for blogs, games, news, online tools, horoscopes, and more. Play games, read articles, calculate, convert, and discover daily content updated for you.',
  keywords: ['blog', 'games', 'news', 'online tools', 'calculator', 'horoscope', 'quizzes', 'free tools', 'online games', 'tech blog', 'lifestyle', 'entertainment', 'SEO tools', 'text tools', 'BMI calculator', 'EMI calculator', 'QR code generator'],
  authors: [{ name: 'Blog-Ghar' }],
  creator: 'Blog-Ghar',
  publisher: 'Blog-Ghar',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://blogghar.com',
    siteName: 'Blog-Ghar',
    title: 'Blog-Ghar - Home of Blogs | Games, News, Tools & More',
    description: 'Your one-stop destination for blogs, games, news, online tools, horoscopes, and more. Discover daily updated content.',
    images: [
      {
        url: 'https://blogghar.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Blog-Ghar - Home of Blogs',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog-Ghar - Home of Blogs',
    description: 'Your one-stop destination for blogs, games, news, tools & more.',
    images: ['https://blogghar.com/og-image.png'],
    creator: '@blogghar',
  },
  alternates: {
    canonical: 'https://blogghar.com',
  },
  category: 'Lifestyle',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Blog-Ghar',
  description: 'Your one-stop destination for blogs, games, news, tools & more',
  url: 'https://blogghar.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://blogghar.com/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Blog-Ghar',
    url: 'https://blogghar.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://blogghar.com/logo.png',
    },
  },
  inLanguage: 'en-IN',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adSenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google AdSense */}
        {adSenseClient && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSenseClient}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>

        {/* Structured Data - Organization */}
        <Script
          id="structured-data-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content="YOUR_GOOGLE_SITE_VERIFICATION_CODE" />

        {/* Bing Verification */}
        <meta name="msvalidate.01" content="YOUR_BING_VERIFICATION_CODE" />

        {/* Additional SEO Meta Tags */}
        <meta name="theme-color" content="#3b82f6" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1e293b" media="(prefers-color-scheme: dark)" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://blogghar.com" />
      </head>

      <body className={`${inter.variable} ${poppins.variable} font-sans min-h-screen flex flex-col bg-white dark:bg-dark-bg text-gray-900 dark:text-gray-100`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
