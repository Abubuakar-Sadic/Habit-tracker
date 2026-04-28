import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

import { AuthProvider } from '@/src/context/AuthContext';
import LoginForm from '@/src/components/auth/LoginForm';
import SignupForm from '@/src/components/auth/SignupForm';

function renderLoginForm() {
  return render(
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );
}

function renderSignupForm() {
  return render(
    <AuthProvider>
      <SignupForm />
    </AuthProvider>
  );
}

describe('auth flow', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('submits the signup form and creates a session', async () => {
    const user = userEvent.setup();
    renderSignupForm();

    await user.type(screen.getByTestId('auth-signup-email'), 'test@example.com');
    await user.type(screen.getByTestId('auth-signup-password'), 'password123');
    await user.click(screen.getByTestId('auth-signup-submit'));

    const session = JSON.parse(localStorage.getItem('habit-tracker-session') || 'null');
    expect(session).not.toBeNull();
    expect(session.email).toBe('test@example.com');

    const users = JSON.parse(localStorage.getItem('habit-tracker-users') || '[]');
    expect(users).toHaveLength(1);
    expect(users[0].email).toBe('test@example.com');
  });

  it('shows an error for duplicate signup email', async () => {
    const user = userEvent.setup();

    localStorage.setItem(
      'habit-tracker-users',
      JSON.stringify([{ id: '1', email: 'dupe@example.com', password: 'pass', createdAt: new Date().toISOString() }])
    );

    renderSignupForm();
    await user.type(screen.getByTestId('auth-signup-email'), 'dupe@example.com');
    await user.type(screen.getByTestId('auth-signup-password'), 'password123');
    await user.click(screen.getByTestId('auth-signup-submit'));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('User already exists');
    });
  });

  it('submits the login form and stores the active session', async () => {
    const user = userEvent.setup();

    localStorage.setItem(
      'habit-tracker-users',
      JSON.stringify([{ id: 'u1', email: 'login@example.com', password: 'secret', createdAt: new Date().toISOString() }])
    );

    renderLoginForm();
    await user.type(screen.getByTestId('auth-login-email'), 'login@example.com');
    await user.type(screen.getByTestId('auth-login-password'), 'secret');
    await user.click(screen.getByTestId('auth-login-submit'));

    const session = JSON.parse(localStorage.getItem('habit-tracker-session') || 'null');
    expect(session).not.toBeNull();
    expect(session.email).toBe('login@example.com');
    expect(session.userId).toBe('u1');
  });

  it('shows an error for invalid login credentials', async () => {
    const user = userEvent.setup();
    renderLoginForm();

    await user.type(screen.getByTestId('auth-login-email'), 'nobody@example.com');
    await user.type(screen.getByTestId('auth-login-password'), 'wrongpass');
    await user.click(screen.getByTestId('auth-login-submit'));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Invalid email or password');
    });
  });
});
