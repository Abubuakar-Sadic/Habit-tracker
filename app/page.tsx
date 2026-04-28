'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';
import SplashScreen from '@/src/components/shared/SplashScreen';

export default function HomePage() {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const timer = setTimeout(() => {
      if (session) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [session, loading, router]);

  return <SplashScreen />;
}
