'use client';
import { useState } from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { useHabits } from '@/src/context/HabitContext';
import HabitCard from './HabitCard';
import HabitForm from './HabitForm';
import type { Habit } from '@/src/types/habit';

function getToday() {
  return new Date().toISOString().split('T')[0];
}

type FormMode = { type: 'create' } | { type: 'edit'; habit: Habit } | null;

export default function DashboardPage() {
  const { session, logout } = useAuth();
  const { habits, addHabit, updateHabit, deleteHabit, toggleCompletion } = useHabits();
  const [formMode, setFormMode] = useState<FormMode>(null);
  const today = getToday();

  function handleSave(name: string, description: string) {
    if (formMode?.type === 'edit') {
      updateHabit(formMode.habit.id, name, description);
    } else {
      addHabit(name, description);
    }
    setFormMode(null);
  }

  return (
    <div data-testid="dashboard-page" className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-indigo-600">Habit Tracker</h1>
            <p className="text-xs text-gray-400">{session?.email}</p>
          </div>
          <button
            data-testid="auth-logout-button"
            onClick={logout}
            className="text-sm text-gray-500 hover:text-red-600 font-medium px-3 py-1.5 rounded-xl hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {formMode === null && (
          <button
            data-testid="create-habit-button"
            onClick={() => setFormMode({ type: 'create' })}
            className="w-full bg-indigo-600 text-white py-3 rounded-2xl text-sm font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          >
            + New habit
          </button>
        )}

        {formMode !== null && (
          <HabitForm
            onSave={handleSave}
            onCancel={() => setFormMode(null)}
            initial={formMode.type === 'edit' ? { name: formMode.habit.name, description: formMode.habit.description } : undefined}
          />
        )}

        {habits.length === 0 && formMode === null && (
          <div
            data-testid="empty-state"
            className="text-center py-16 text-gray-400"
          >
            <p className="text-3xl mb-2">🌱</p>
            <p className="text-sm font-medium">No habits yet.</p>
            <p className="text-xs mt-1">Create your first habit to get started.</p>
          </div>
        )}

        <div className="space-y-3">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              today={today}
              onToggle={toggleCompletion}
              onEdit={(h) => setFormMode({ type: 'edit', habit: h })}
              onDelete={deleteHabit}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
