import { Metadata } from 'next';
import { JsonLd } from './json-ld';

export interface PageSeoProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
  jsonLd?: any[];
  breadcrumbs?: { name: string; url: string }[];
}

export function generateMetadata({
  title,
  description,
  canonical,
  ogImage = '/og-image.svg',
  ogType = 'website',
  publishedTime,
  modifiedTime,
  author,
  tags,
}: PageSeoProps): Metadata {
  const url = canonical || 'https://bloghar.com';

  return {
    title: `${title} | Blog-Ghar`,
    description,
    keywords: tags,
    authors: author ? [{ name: author }] : undefined,
    openGraph: {
      type: ogType,
      url,
      siteName: 'Blog-Ghar',
      title,
      description,
      images: [
        {
          url: ogImage.startsWith('http') ? ogImage : `https://bloghar.com${ogImage}`,
          width: 1200,
          height: 630,
          alt: title,
          type: ogImage.endsWith('.svg') ? 'image/svg+xml' : 'image/png',
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage.startsWith('http') ? ogImage : `https://bloghar.com${ogImage}`],
    },
    alternates: {
      canonical: url,
    },
  };
}

export function PageSeo({ title, description, canonical, jsonLd, breadcrumbs }: PageSeoProps) {
  return (
    <>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <JsonLd
          type="BreadcrumbList"
          data={{
            itemListElement: breadcrumbs.map((item, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: item.name,
              item: item.url,
            })),
          }}
        />
      )}
      {jsonLd?.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {canonical && (
        <link rel="canonical" href={canonical} />
      )}
      <meta property="og:title" content={`${title} | Blog-Ghar`} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical || 'https://bloghar.com'} />
      <meta name="twitter:title" content={`${title} | Blog-Ghar`} />
      <meta name="twitter:description" content={description} />
    </>
  );
}
