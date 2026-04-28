import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

import { AuthProvider } from '@/src/context/AuthContext';
import { HabitProvider } from '@/src/context/HabitContext';
import DashboardPage from '@/src/components/habits/DashboardPage';

const TODAY = new Date().toISOString().split('T')[0];

function seedSession(userId = 'u1', email = 'test@example.com') {
  localStorage.setItem('habit-tracker-session', JSON.stringify({ userId, email }));
  localStorage.setItem(
    'habit-tracker-users',
    JSON.stringify([{ id: userId, email, password: 'pw', createdAt: new Date().toISOString() }])
  );
}

function renderDashboard() {
  return render(
    <AuthProvider>
      <HabitProvider>
        <DashboardPage />
      </HabitProvider>
    </AuthProvider>
  );
}

describe('habit form', () => {
  beforeEach(() => {
    localStorage.clear();
    seedSession();
  });

  it('shows a validation error when habit name is empty', async () => {
    const user = userEvent.setup();
    renderDashboard();

    await user.click(screen.getByTestId('create-habit-button'));
    await user.click(screen.getByTestId('habit-save-button'));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Habit name is required');
    });
  });

  it('creates a new habit and renders it in the list', async () => {
    const user = userEvent.setup();
    renderDashboard();

    await user.click(screen.getByTestId('create-habit-button'));
    await user.type(screen.getByTestId('habit-name-input'), 'Drink Water');
    await user.click(screen.getByTestId('habit-save-button'));

    await waitFor(() => {
      expect(screen.getByTestId('habit-card-drink-water')).toBeInTheDocument();
    });

    const habits = JSON.parse(localStorage.getItem('habit-tracker-habits') || '[]');
    expect(habits).toHaveLength(1);
    expect(habits[0].name).toBe('Drink Water');
    expect(habits[0].frequency).toBe('daily');
    expect(habits[0].userId).toBe('u1');
  });

  it('edits an existing habit and preserves immutable fields', async () => {
    const user = userEvent.setup();

    // Seed a habit
    const habit = {
      id: 'h1',
      userId: 'u1',
      name: 'Read Books',
      description: '',
      frequency: 'daily',
      createdAt: '2024-01-01T00:00:00.000Z',
      completions: ['2024-01-01'],
    };
    localStorage.setItem('habit-tracker-habits', JSON.stringify([habit]));

    renderDashboard();

    await waitFor(() => screen.getByTestId('habit-card-read-books'));
    await user.click(screen.getByTestId('habit-edit-read-books'));

    const nameInput = screen.getByTestId('habit-name-input');
    await user.clear(nameInput);
    await user.type(nameInput, 'Read More Books');
    await user.click(screen.getByTestId('habit-save-button'));

    await waitFor(() => {
      expect(screen.getByTestId('habit-card-read-more-books')).toBeInTheDocument();
    });

    const saved = JSON.parse(localStorage.getItem('habit-tracker-habits') || '[]');
    const updated = saved[0];
    expect(updated.id).toBe('h1');
    expect(updated.userId).toBe('u1');
    expect(updated.createdAt).toBe('2024-01-01T00:00:00.000Z');
    expect(updated.completions).toEqual(['2024-01-01']);
    expect(updated.name).toBe('Read More Books');
  });

  it('deletes a habit only after explicit confirmation', async () => {
    const user = userEvent.setup();

    const habit = {
      id: 'h2',
      userId: 'u1',
      name: 'Exercise',
      description: '',
      frequency: 'daily',
      createdAt: new Date().toISOString(),
      completions: [],
    };
    localStorage.setItem('habit-tracker-habits', JSON.stringify([habit]));

    renderDashboard();
    await waitFor(() => screen.getByTestId('habit-card-exercise'));

    // Click delete — should ask for confirmation, not delete yet
    await user.click(screen.getByTestId('habit-delete-exercise'));
    expect(screen.getByTestId('habit-card-exercise')).toBeInTheDocument();

    // Confirm deletion
    await user.click(screen.getByTestId('confirm-delete-button'));
    await waitFor(() => {
      expect(screen.queryByTestId('habit-card-exercise')).not.toBeInTheDocument();
    });

    const saved = JSON.parse(localStorage.getItem('habit-tracker-habits') || '[]');
    expect(saved.filter((h: { userId: string }) => h.userId === 'u1')).toHaveLength(0);
  });

  it('toggles completion and updates the streak display', async () => {
    const user = userEvent.setup();

    const habit = {
      id: 'h3',
      userId: 'u1',
      name: 'Meditate',
      description: '',
      frequency: 'daily',
      createdAt: new Date().toISOString(),
      completions: [],
    };
    localStorage.setItem('habit-tracker-habits', JSON.stringify([habit]));

    renderDashboard();
    await waitFor(() => screen.getByTestId('habit-card-meditate'));

    // Initial streak should be 0
    expect(screen.getByTestId('habit-streak-meditate')).toHaveTextContent('0');

    // Toggle complete
    await user.click(screen.getByTestId('habit-complete-meditate'));

    await waitFor(() => {
      expect(screen.getByTestId('habit-streak-meditate')).toHaveTextContent('1');
    });

    const saved = JSON.parse(localStorage.getItem('habit-tracker-habits') || '[]');
    const updated = saved.find((h: { id: string }) => h.id === 'h3');
    expect(updated.completions).toContain(TODAY);

    // Toggle off
    await user.click(screen.getByTestId('habit-complete-meditate'));
    await waitFor(() => {
      expect(screen.getByTestId('habit-streak-meditate')).toHaveTextContent('0');
    });
  });
});
