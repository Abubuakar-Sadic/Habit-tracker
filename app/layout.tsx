import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/src/context/AuthContext';
import ServiceWorkerRegistrar from '@/src/components/shared/ServiceWorkerRegistrar';

export const metadata: Metadata = {
  title: 'Habit Tracker',
  description: 'Track your daily habits',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4f46e5" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-gray-50 text-gray-900 antialiased">
        <AuthProvider>
          <ServiceWorkerRegistrar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
