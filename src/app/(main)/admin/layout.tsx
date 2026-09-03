import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.id) {
    redirect('/login');
  }
  if ((session as any)?.user?.role !== 'ADMIN') {
    redirect('/');
  }
  return <>{children}</>;
}
