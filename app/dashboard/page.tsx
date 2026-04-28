'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';
import { HabitProvider } from '@/src/context/HabitContext';
import DashboardPage from '@/src/components/habits/DashboardPage';

export default function Dashboard() {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      router.replace('/login');
    }
  }, [session, loading, router]);

  if (loading || !session) return null;

  return (
    <HabitProvider>
      <DashboardPage />
    </HabitProvider>
  );
}
