import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, MapPin, ExternalLink, Calendar } from 'lucide-react';
import { JsonLd, generateJobPostingSchema } from '@/components/seo/json-ld';
import { PageSeo } from '@/components/seo/page-seo';

type JobParams = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: JobParams }) {
  const { id } = await params;
  try {
    const job = await prisma.jobListing.findUnique({ where: { id: parseInt(id) } });
    if (!job) return {};
    const url = `https://blogghar.com/jobs/${job.id}`;
    return {
      title: `${job.title} at ${job.company} | Blog-Ghar Jobs`,
      description: `${job.title} ${job.location ? `- ${job.location}` : ''}`,
      alternates: { canonical: url },
    };
  } catch {
    return {};
  }
}

export default async function JobDetailPage({ params }: { params: JobParams }) {
  const { id } = await params;
  let job;
  try {
    job = await prisma.jobListing.findUnique({
      where: { id: parseInt(id) },
    });
  } catch {
    job = null;
  }

  if (!job || !job.isActive) notFound();

  const url = `https://blogghar.com/jobs/${job.id}`;
  const breadcrumbs = [
    { name: 'Home', url: 'https://blogghar.com' },
    { name: 'Jobs', url: 'https://blogghar.com/jobs' },
    { name: job.title, url },
  ];

  return (
    <>
      <PageSeo
        title={job.title}
        description={`${job.title} at ${job.company}${job.location ? ` - ${job.location}` : ''}`}
        canonical={url}
        breadcrumbs={breadcrumbs}
      />
      <JsonLd type="BreadcrumbList" data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((b, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: b.name,
          item: b.url,
        })),
      }} />
      {job.description && (
        <JsonLd type="JobPosting" data={generateJobPostingSchema({
          title: job.title,
          company: job.company,
          location: job.location || 'Remote',
          description: job.description,
          description: job.description,
          url,
          postedAt: (job as any).postedAt || new Date().toISOString(),
        })} />
      )}

      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/jobs" className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Jobs
        </Link>

        {!job ? (
          <div className="card p-12 text-center">
            <p className="text-6xl mb-4">💼</p>
            <h1 className="text-2xl font-display font-bold mb-2">Job Not Found</h1>
            <p className="text-gray-500 mb-4">This job listing may have been removed or is no longer active.</p>
            <Link href="/jobs" className="btn-primary">Browse All Jobs</Link>
          </div>
        ) : (
        <div className="card p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-extrabold mb-2">{job.title}</h1>
              <p className="text-lg text-primary-600 font-medium">{job.company}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {job.salary && (
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium rounded-full">
                  {job.salary}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200 dark:border-dark-border">
            {job.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> {job.location}
              </span>
            )}
            {job.salary && (
              <span className="flex items-center gap-1.5">
                <span className="font-medium text-green-600">{job.salary}</span>
              </span>
            )}
            {(job as any).postedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> {formatDate(new Date((job as any).postedAt))}
              </span>
            )}
          </div>

          {job.description && (
            <div className="prose dark:prose-invert max-w-none mb-8">
              <p>{job.description}</p>
            </div>
          )}

          {job.applyUrl && (
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 btn-primary py-3 px-6"
            >
              Apply Now <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </>
  );
}
