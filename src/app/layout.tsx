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
        url: 'https://blogghar.com/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Blog-Ghar - Home of Blogs',
        type: 'image/svg+xml',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog-Ghar - Home of Blogs',
    description: 'Your one-stop destination for blogs, games, news, tools & more.',
    images: ['https://blogghar.com/og-image.svg'],
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
      url: 'https://blogghar.com/logo.svg',
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

        {/* Google Analytics (conditional on env var) */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}

        {/* Structured Data - Organization */}
        <Script
          id="structured-data-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Google Search Console Verification */}
        {process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && (
          <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION} />
        )}

        {/* Bing Verification */}
        {process.env.NEXT_PUBLIC_BING_VERIFICATION && (
          <meta name="msvalidate.01" content={process.env.NEXT_PUBLIC_BING_VERIFICATION} />
        )}

        {/* Sitemap Discovery */}
        <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />

        {/* Hreflang for regional targeting */}
        <link rel="alternate" hrefLang="en-IN" href="https://blogghar.com" />
        <link rel="alternate" hrefLang="en-US" href="https://blogghar.com" />
        <link rel="alternate" hrefLang="en-GB" href="https://blogghar.com" />
        <link rel="alternate" hrefLang="x-default" href="https://blogghar.com" />

        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Additional SEO Meta Tags */}
        <meta name="theme-color" content="#3b82f6" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1e293b" media="(prefers-color-scheme: dark)" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link rel="canonical" href="https://blogghar.com" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/svg+xml" />
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
