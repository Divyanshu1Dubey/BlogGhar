import type { Metadata } from 'next';

export interface JsonLdProps {
  type: 'WebSite' | 'Article' | 'BreadcrumbList' | 'FAQPage' | 'Organization' | 'HowTo' | 'Product' | 'ItemList' | 'JobPosting' | 'NewsArticle' | 'DiscussionForumPosting' | 'VideoGame' | 'WebApplication' | 'Person' | 'AboutPage';
  data: Record<string, any>;
}

export function JsonLd({ type, data }: JsonLdProps) {
  const json = {
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

export function generateArticleSchema(post: {
  title: string;
  excerpt?: string;
  slug: string;
  publishedAt?: string;
  updatedAt?: string;
  authorName?: string;
  category?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || post.title,
    url: `https://bloghar.com/blog/${post.slug}`,
    datePublished: post.publishedAt || post.updatedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.authorName || 'Blog-Ghar',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Blog-Ghar',
      url: 'https://bloghar.com',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://bloghar.com/blog/${post.slug}`,
    },
    inLanguage: 'en-IN',
  };
}

export function generateToolSchema(tool: {
  name: string;
  description: string;
  slug: string;
  category: string;
  howTo?: { step: string; name: string; url?: string }[];
  faqs?: { question: string; answer: string }[];
}) {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    description: tool.description,
    url: `https://bloghar.com/tools/${tool.slug}`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web Browser',
    inLanguage: 'en-IN',
    publisher: {
      '@type': 'Organization',
      name: 'Blog-Ghar',
    },
  };

  if (tool.howTo && tool.howTo.length > 0) {
    schema['@type'] = 'HowTo';
    schema.step = tool.howTo.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.step,
      url: s.url || `https://bloghar.com/tools/${tool.slug}`,
    }));
  }

  if (tool.faqs && tool.faqs.length > 0) {
    const faqSchema = {
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
    };
    return [schema, faqSchema];
  }

  return [schema];
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
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

export function generateJobPostingSchema(job: {
  title: string;
  company: string;
  location: string;
  type?: string;
  description: string;
  url: string;
  postedAt?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company,
    },
    jobLocationType: job.location.toLowerCase().includes('remote') ? 'TELECOMMUTE' : 'ONSITE',
    employmentType: (job.type || 'FULL_TIME').toUpperCase(),
    description: job.description,
    datePosted: job.postedAt || new Date().toISOString(),
    url: job.url,
  };
}

export function generateNewsSchema(article: {
  title: string;
  excerpt?: string;
  id: string;
  publishedAt?: string;
  source?: string;
  category?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt || article.title,
    datePublished: article.publishedAt || new Date().toISOString(),
    publisher: {
      '@type': 'Organization',
      name: 'Blog-Ghar',
    },
    articleSection: article.category || 'General',
    inLanguage: 'en-IN',
  };
}
