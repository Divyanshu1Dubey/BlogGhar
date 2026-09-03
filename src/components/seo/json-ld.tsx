export type JsonLdType =
  | 'WebSite'
  | 'Organization'
  | 'Blog'
  | 'BlogPosting'
  | 'BreadcrumbList'
  | 'ItemList'
  | 'FAQPage'
  | 'HowTo'
  | 'Article'
  | 'NewsArticle'
  | 'VideoObject'
  | 'Product'
  | 'AggregateRating'
  | 'JobPosting'
  | 'DiscussionForumPosting'
  | 'VideoGame'
  | 'WebApplication'
  | 'Person'
  | 'AboutPage'
  | 'WebPage';

export interface JsonLdBase {
  '@context'?: string;
  '@type'?: string;
  [key: string]: unknown;
}

export interface JsonLdProps {
  type: JsonLdType;
  data: JsonLdBase;
}

export function JsonLd({ type, data }: JsonLdProps) {
  const json: JsonLdBase = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

export interface ArticleStructuredData {
  title: string;
  excerpt?: string;
  slug: string;
  publishedAt?: string;
  updatedAt?: string;
  authorName?: string;
  authorImage?: string;
  category?: string;
  tags?: string[];
  image?: string;
}

export function generateArticleSchema(post: ArticleStructuredData) {
  const schema: JsonLdBase = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || post.title,
    url: `https://bloghar.com/blog/${post.slug}`,
    datePublished: post.publishedAt || post.updatedAt,
    dateModified: post.updatedAt || post.publishedAt,
    inLanguage: 'en-IN',
    author: {
      '@type': 'Person',
      name: post.authorName || 'Blog-Ghar',
      ...(post.authorImage && { image: post.authorImage }),
    },
    publisher: {
      '@type': 'Organization',
      name: 'Blog-Ghar',
      url: 'https://bloghar.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://bloghar.com/logo.svg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://bloghar.com/blog/${post.slug}`,
    },
    ...(post.image && { image: post.image }),
    ...(post.tags && post.tags.length > 0 && { keywords: post.tags.join(', ') }),
    ...(post.category && { articleSection: post.category }),
  };
  return schema;
}

export interface ToolSchemaInput {
  name: string;
  description: string;
  slug: string;
  category: string;
  howTo?: { step: string; name: string; url?: string }[];
  faqs?: { question: string; answer: string }[];
  rating?: { value: number; count: number };
  image?: string;
}

export function generateToolSchema(tool: ToolSchemaInput) {
  const schema: JsonLdBase = {
    '@context': 'https://schema.org',
    '@type': tool.howTo && tool.howTo.length > 0 ? 'HowTo' : 'WebApplication',
    name: tool.name,
    description: tool.description,
    url: `https://bloghar.com/tools/${tool.slug}`,
    inLanguage: 'en-IN',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web Browser',
    publisher: {
      '@type': 'Organization',
      name: 'Blog-Ghar',
      url: 'https://bloghar.com',
    },
    ...(tool.image && { image: tool.image }),
    ...(tool.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: tool.rating.value,
        ratingCount: tool.rating.count,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };

  if (tool.howTo && tool.howTo.length > 0) {
    schema.step = tool.howTo.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.step,
      url: s.url || `https://bloghar.com/tools/${tool.slug}`,
    }));
  }

  const schemas: JsonLdBase[] = [schema];
  if (tool.faqs && tool.faqs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: tool.faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer,
        },
      })),
    });
  }
  return schemas;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export interface JobPostingInput {
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type?: string;
  description: string;
  url: string;
  postedAt?: string;
  salary?: string;
}

export function generateJobPostingSchema(job: JobPostingInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company,
      ...(job.companyLogo && { logo: job.companyLogo }),
    },
    jobLocationType: job.location.toLowerCase().includes('remote') ? 'TELECOMMUTE' : 'ONSITE',
    employmentType: (job.type || 'FULL_TIME').replace(/\W+/g, '_').toUpperCase(),
    description: job.description,
    datePosted: job.postedAt || new Date().toISOString(),
    url: job.url,
    validThrough: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    ...(job.salary && { baseSalary: { '@type': 'MonetaryAmount', currency: 'INR', value: { '@type': 'QuantitativeValue', value: job.salary } } }),
  };
}

export interface NewsArticleInput {
  title: string;
  excerpt?: string;
  id: string;
  slug: string;
  publishedAt?: string;
  source?: string;
  category?: string;
  image?: string;
  authorName?: string;
}

export function generateNewsSchema(article: NewsArticleInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt || article.title,
    datePublished: article.publishedAt || new Date().toISOString(),
    url: `https://bloghar.com/news/${article.slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'Blog-Ghar',
      logo: {
        '@type': 'ImageObject',
        url: 'https://bloghar.com/logo.svg',
      },
    },
    ...(article.source && { isBasedOn: { '@type': 'NewsMediaOrganization', name: article.source } }),
    ...(article.image && { image: article.image }),
    ...(article.authorName && { author: { '@type': 'Person', name: article.authorName } }),
    articleSection: article.category || 'General',
    inLanguage: 'en-IN',
  };
}

export interface OrganizationSchemaInput {
  name: string;
  description: string;
  url: string;
  logo: string;
  foundingDate?: string;
  sameAs?: string[];
  contactPoint?: { contactType: string; email: string }[];
}

export function generateOrganizationSchema(org: OrganizationSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: org.name,
    description: org.description,
    url: org.url,
    logo: {
      '@type': 'ImageObject',
      url: org.logo,
    },
    ...(org.foundingDate && { foundingDate: org.foundingDate }),
    ...(org.sameAs && org.sameAs.length > 0 && { sameAs: org.sameAs }),
    ...(org.contactPoint && org.contactPoint.length > 0 && { contactPoint: org.contactPoint }),
  };
}

export interface WebSiteSchemaInput {
  name: string;
  description: string;
  url: string;
  searchUrl?: string;
  siteLogo?: string;
}

export function generateWebSiteSchema(site: WebSiteSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    description: site.description,
    url: site.url,
    inLanguage: 'en-IN',
    ...(site.siteLogo && { logo: site.siteLogo }),
    ...(site.searchUrl && {
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: site.searchUrl,
        },
        'query-input': 'required name=search_term_string',
      },
    }),
    publisher: {
      '@type': 'Organization',
      name: 'Blog-Ghar',
      logo: {
        '@type': 'ImageObject',
        url: site.siteLogo || 'https://bloghar.com/logo.svg',
      },
    },
  };
}

export interface GameSchemaInput {
  name: string;
  description: string;
  slug: string;
  category: string;
  image?: string;
  playMode?: string;
  applicationCategory?: string;
  operatingSystem?: string;
}

export function generateGameSchema(game: GameSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.name,
    description: game.description,
    url: `https://bloghar.com/games/${game.slug}`,
    image: game.image,
    playMode: game.playMode || 'SinglePlayer',
    applicationCategory: game.applicationCategory || 'Game',
    operatingSystem: game.operatingSystem || 'Web Browser',
    inLanguage: 'en-IN',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Blog-Ghar',
    },
  };
}

export interface ProductSchemaInput {
  name: string;
  description: string;
  image?: string;
  brand?: string;
  sku?: string;
  offers?: { price: number; currency: string; availability: string };
  aggregateRating?: { ratingValue: number; reviewCount: number };
}

export function generateProductSchema(product: ProductSchemaInput) {
  const schema: JsonLdBase = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    ...(product.image && { image: product.image }),
    ...(product.brand && {
      brand: {
        '@type': 'Brand',
        name: product.brand,
      },
    }),
    ...(product.sku && { sku: product.sku }),
    ...(product.offers && {
      offers: {
        '@type': 'Offer',
        price: product.offers.price,
        priceCurrency: product.offers.currency,
        availability: product.offers.availability || 'https://schema.org/InStock',
        url: 'https://bloghar.com',
      },
    }),
    ...(product.aggregateRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.aggregateRating.ratingValue,
        ratingCount: product.aggregateRating.reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };
  return schema;
}

export function useJsonLd() {
  const webSiteSchema = generateWebSiteSchema({
    name: 'Blog-Ghar',
    description: 'Your one-stop destination for blogs, games, news, tools & more',
    url: 'https://bloghar.com',
    searchUrl: 'https://bloghar.com/search?q={search_term_string}',
    siteLogo: 'https://bloghar.com/logo.svg',
  });

  const organizationSchema = generateOrganizationSchema({
    name: 'Blog-Ghar',
    description: 'Your one-stop destination for blogs, games, news, online tools, horoscopes, and more.',
    url: 'https://bloghar.com',
    logo: 'https://bloghar.com/logo.svg',
    sameAs: [
      'https://twitter.com/bloghar',
      'https://facebook.com/bloghar',
      'https://instagram.com/bloghar',
      'https://youtube.com/@bloghar',
    ],
    contactPoint: [
      { contactType: 'customer support', email: 'hello@bloghar.com' },
    ],
  });

  return {
    webSiteSchema,
    organizationSchema,
  };
}
