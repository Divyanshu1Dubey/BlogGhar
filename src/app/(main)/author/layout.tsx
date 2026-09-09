import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function AuthorLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.id) {
    redirect('/login');
  }
  const role = (session as any)?.user?.role;
  if (!['ADMIN', 'AUTHOR'].includes(role)) {
    redirect('/');
  }
  return <>{children}</>;
}
