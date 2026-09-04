import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import AdminSidebar from '../components/admin-sidebar';

type JobWithRelations = Awaited<ReturnType<typeof prisma.jobListing.findMany>>[number] & {
  category: { name: string };
  _count: { applications: number };
};

export const metadata: Metadata = { title: 'Admin Jobs', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminJobsPage() {
  let jobs: JobWithRelations[] = [];
  let error = '';
  try {
    jobs = await prisma.jobListing.findMany({ orderBy: { postedAt: 'desc' }, take: 100, include: { category: { select: { name: true } }, _count: { select: { applications: true } } } });
  } catch (err) {
    console.error('Admin jobs load failed', err);
    error = 'Unable to load jobs.';
  }
  return <><AdminSidebar /><main className="min-h-screen bg-gray-50 p-8 dark:bg-dark-bg md:ml-64">
    <h1 className="mb-6 text-3xl font-extrabold">Jobs</h1>
    {error && <div className="mb-4 rounded-lg bg-red-100 p-4 text-sm text-red-700">{error}</div>}
    <div className="card overflow-hidden"><table className="w-full text-sm"><thead><tr className="bg-gray-50 dark:bg-dark-bg"><th className="p-3 text-left">Title</th><th className="p-3 text-left">Company</th><th className="p-3 text-left">Category</th><th className="p-3 text-left">Applications</th><th className="p-3 text-left">Status</th></tr></thead>
      <tbody>{jobs.map((job) => <tr key={job.id} className="border-t border-gray-100 dark:border-dark-border"><td className="p-3">{job.title}</td><td className="p-3">{job.company}</td><td className="p-3">{job.category.name}</td><td className="p-3">{job._count.applications}</td><td className="p-3">{job.isActive ? 'Active' : 'Inactive'}</td></tr>)}</tbody>
    </table>{!jobs.length && !error && <p className="p-8 text-center text-gray-500">No jobs yet</p>}</div>
  </main></>;
}
