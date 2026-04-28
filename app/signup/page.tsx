import SignupForm from '@/src/components/auth/SignupForm';

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-indigo-600">Habit Tracker</h1>
          <p className="mt-1 text-gray-500 text-sm">Create your account</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <SignupForm />
        </div>
        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <a href="/login" className="text-indigo-600 font-medium hover:underline">Sign in</a>
        </p>
      </div>
    </main>
  );
}
