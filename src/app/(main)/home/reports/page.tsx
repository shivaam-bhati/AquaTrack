import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ReportsContent } from './ReportsContent';

export default async function ReportsPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/auth/login');
  }

  return <ReportsContent />;
} 