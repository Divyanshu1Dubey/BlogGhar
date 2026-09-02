import prisma from '@/lib/prisma';
import Link from 'next/link';
import { MessageSquare, ThumbsUp, Eye } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Q&A Community',
  description: 'Ask questions, share knowledge, and help others in the Blog-Ghar Q&A community.',
  openGraph: { title: 'Q&A Community', description: 'Ask questions, share knowledge, and help others.', type: 'website' },
};

export default async function QAPage() {
  let questions: any[] = [];
  try {
    questions = await prisma.question.findMany({ orderBy: { createdAt: 'desc' }, take: 30, include: { user: { select: { name: true } }, _count: { select: { answers: true, votes: true } } } });
  } catch {}

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-display font-extrabold mb-3">❓ Q&A</h1>
        <p className="text-gray-600 dark:text-gray-400">Ask questions, share knowledge, help others</p>
      </div>

      {questions.length > 0 ? (
        <div className="card divide-y divide-gray-100 dark:divide-dark-border">
          {questions.map((q) => (
            <Link key={q.id} href={`/qa/${q.slug || q.id}`} className="block p-5 hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
              <h3 className="font-medium text-lg mb-2 hover:text-primary-600">{q.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">{q.content}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {q._count.answers} answers</span>
                <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {q._count.votes} votes</span>
                <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {q.views} views</span>
                <span>{q.user.name}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center"><p className="text-4xl mb-3">❓</p><p className="text-gray-500">No questions yet. Be the first!</p></div>
      )}
    </div>
  );
}
