'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext';

export default function SignupForm() {
  const { signup } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = signup(email, password);
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {error && (
        <p role="alert" className="text-red-600 text-sm font-medium bg-red-50 p-2 rounded-lg">{error}</p>
      )}
      <div>
        <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
          Email address
        </label>
        <input
          id="signup-email"
          type="email"
          data-testid="auth-signup-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          id="signup-password"
          type="password"
          data-testid="auth-signup-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Choose a password"
        />
      </div>
      <button
        type="submit"
        data-testid="auth-signup-submit"
        className="w-full bg-indigo-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
      >
        Create account
      </button>
    </form>
  );
}
