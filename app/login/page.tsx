import LoginForm from '@/src/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-indigo-600">Habit Tracker</h1>
          <p className="mt-1 text-gray-500 text-sm">Sign in to your account</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <LoginForm />
        </div>
        <p className="mt-4 text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <a href="/signup" className="text-indigo-600 font-medium hover:underline">Sign up</a>
        </p>
      </div>
    </main>
  );
}
