import { redirect } from 'next/navigation';
import { getActiveUser } from '@/app/actions';

export default async function HomePage() {
  const { user } = await getActiveUser();

  if (!user) {
    redirect('/login');
  }

  redirect('/dashboard');
}
