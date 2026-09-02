import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Briefcase, MapPin, DollarSign, ExternalLink } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Job Board',
  description: 'Find your next career opportunity. Browse latest job listings across tech, design, marketing, and more on Blog-Ghar.',
  openGraph: { title: 'Job Board', description: 'Find your next career opportunity. Browse latest job listings.', type: 'website' },
};

export const dynamic = 'force-dynamic';

export default async function JobsPage() {
  let jobs: any[] = [];
  try {
    jobs = await prisma.jobListing.findMany({
      where: { isActive: true },
      orderBy: { postedAt: 'desc' },
      include: { category: { select: { name: true } } },
    });
  } catch {}

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-display font-extrabold mb-3">💼 Job Board</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Find your next opportunity. Browse latest jobs across categories.
        </p>
      </div>

      {/* Post a Job CTA */}
      <div className="card p-6 mb-8 bg-gradient-to-r from-primary-500 to-primary-700 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl">Hiring? Post a Job</h2>
          <p className="text-primary-100 text-sm mt-1">Reach thousands of job seekers on Blog-Ghar</p>
        </div>
        <Link href="/admin/jobs/new" className="bg-white text-primary-700 px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-50 transition-colors whitespace-nowrap">
          Post a Job
        </Link>
      </div>

      {/* Job Listings */}
      {jobs.length > 0 ? (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="card p-5 hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-display font-bold text-lg">{job.title}</h3>
                    {job.isRemote && (
                      <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                        Remote
                      </span>
                    )}
                  </div>
                  <p className="text-primary-600 font-medium text-sm mb-2">{job.company}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">{job.description}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    {job.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {job.location}
                      </span>
                    )}
                    {job.salary && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5" /> {job.salary}
                      </span>
                    )}
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-dark-bg rounded-full">{job.category.name}</span>
                    <span>{formatDate(new Date(job.postedAt))}</span>
                  </div>
                </div>
                {job.applyUrl && (
                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-sm whitespace-nowrap flex items-center gap-1"
                  >
                    Apply Now <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <p className="text-6xl mb-4">💼</p>
          <h3 className="text-xl font-display font-bold mb-2">No jobs posted yet</h3>
          <p className="text-gray-500">Check back soon for new opportunities!</p>
        </div>
      )}
    </div>
  );
}
