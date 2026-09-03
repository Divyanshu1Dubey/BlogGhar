import { Metadata } from 'next';
import { JsonLd, useJsonLd, BreadcrumbItem } from './json-ld';

export interface PageSeoProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  authorImage?: string;
  tags?: string[];
  category?: string;
  readTime?: number;
  jsonLd?: any[];
  breadcrumbs?: BreadcrumbItem[];
  robots?: string;
  noindex?: boolean;
  nofollow?: boolean;
  images?: string[];
  locale?: string;
  alternateLocales?: { locale: string; url: string }[];
}

const SITE_URL = 'https://bloghar.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.svg`;
const DEFAULT_TWITTER_HANDLE = '@bloghar';

export function generatePageMetadata({
  title,
  description,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  publishedTime,
  modifiedTime,
  author,
  tags,
  category,
  readTime,
  robots,
  noindex,
  nofollow,
}: PageSeoProps): Metadata {
  const url = canonical || SITE_URL;
  const robotsMeta = robots || `${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}`;
  const absoluteOgImage = ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`;
  const ogImageType = absoluteOgImage.endsWith('.svg') ? 'image/svg+xml' : absoluteOgImage.endsWith('.webp') ? 'image/webp' : absoluteOgImage.endsWith('.jpg') || absoluteOgImage.endsWith('.jpeg') ? 'image/jpeg' : 'image/png';

  const metadata: Metadata = {
    title,
    description,
    keywords: tags?.join(', '),
    authors: author ? [{ name: author }] : undefined,
    robots: robotsMeta as Metadata['robots'],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: ogType,
      url,
      siteName: 'Blog-Ghar',
      title,
      description,
      images: [
        {
          url: absoluteOgImage,
          width: 1200,
          height: 630,
          alt: title,
          type: ogImageType,
          ...(readTime && { caption: `${readTime} min read` }),
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(author && { authors: [author] }),
      ...(category && { articleSection: category }),
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteOgImage],
      creator: DEFAULT_TWITTER_HANDLE,
      ...(author && { site: author }),
    },
  };

  return metadata;
}

export function PageSeo({
  title,
  description,
  canonical,
  ogImage,
  ogType = 'website',
  publishedTime,
  modifiedTime,
  author,
  authorImage,
  tags,
  category,
  readTime,
  jsonLd = [],
  breadcrumbs,
  robots,
  noindex,
  nofollow,
  locale = 'en_IN',
  alternateLocales,
}: PageSeoProps) {
  const url = canonical || SITE_URL;
  const absoluteOgImage = ogImage || DEFAULT_OG_IMAGE;
  const fullOgImage = absoluteOgImage.startsWith('http') ? absoluteOgImage : `${SITE_URL}${absoluteOgImage.startsWith('/') ? '' : '/'}${absoluteOgImage}`;
  const robotsMeta = robots || `${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}`;

  const { webSiteSchema, organizationSchema } = useJsonLd();

  const articleJsonLd =
    ogType === 'article' && title ? generateArticleJsonLd({ title, description, canonical: url, publishedTime, modifiedTime, author, authorImage, category, tags, readTime, ogImage: absoluteOgImage }) : null;

  return (
    <>
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Robots Meta */}
      <meta name="robots" content={robotsMeta} />
      {noindex && <meta name="googlebot" content="noindex" />}

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Blog-Ghar" />
      <meta property="og:locale" content={locale} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      {readTime && <meta property="og:image:caption" content={`${readTime} min read`} />}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}
      {category && <meta property="article:section" content={category} />}
      {tags?.map((tag) => (
        <meta property="article:tag" content={tag} key={tag} />
      ))}

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:site" content={DEFAULT_TWITTER_HANDLE} />

      {/* Hreflang Tags */}
      <link rel="alternate" hrefLang="en-IN" href={url} />
      <link rel="alternate" hrefLang="en-US" href={url} />
      <link rel="alternate" hrefLang="en-GB" href={url} />
      <link rel="alternate" hrefLang="x-default" href={url} />
      {alternateLocales?.map((localeEntry) => (
        <link key={localeEntry.locale} rel="alternate" hrefLang={localeEntry.locale} href={localeEntry.url} />
      ))}

      {/* JSON-LD Structured Data */}
      <JsonLd type="WebSite" data={webSiteSchema} />
      <JsonLd type="Organization" data={organizationSchema} />

      {breadcrumbs && breadcrumbs.length > 0 && (
        <JsonLd type="BreadcrumbList" data={generateBreadcrumbSchema(breadcrumbs)} />
      )}

      {articleJsonLd && <JsonLd type="Article" data={articleJsonLd} />}

      {jsonLd?.map((schema, i) => (
        <script
          key={`custom-jsonld-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}

function generateArticleJsonLd({
  title,
  description,
  canonical,
  publishedTime,
  modifiedTime,
  author,
  authorImage,
  category,
  tags,
  readTime,
  ogImage,
}: {
  title: string;
  description: string;
  canonical: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  authorImage?: string;
  category?: string;
  tags?: string[];
  readTime?: number;
  ogImage: string;
}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: canonical,
    datePublished: publishedTime || modifiedTime,
    dateModified: modifiedTime || publishedTime,
    inLanguage: 'en-IN',
    wordCount: readTime ? readTime * 200 : undefined,
    timeRequired: readTime ? `PT${readTime}M` : undefined,
    author: {
      '@type': 'Person',
      name: author || 'Blog-Ghar',
      ...(authorImage && { image: authorImage }),
    },
    publisher: {
      '@type': 'Organization',
      name: 'Blog-Ghar',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.svg`,
        width: 200,
        height: 60,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonical,
    },
    image: ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`,
  };

  if (category) {
    schema.articleSection = category;
  }
  if (tags && tags.length > 0) {
    schema.keywords = tags.join(', ');
  }

  return schema;
}
