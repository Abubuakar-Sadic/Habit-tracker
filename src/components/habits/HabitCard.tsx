'use client';
import { useState } from 'react';
import type { Habit } from '@/src/types/habit';
import { getHabitSlug } from '@/src/lib/slug';
import { calculateCurrentStreak } from '@/src/lib/streaks';

interface Props {
  habit: Habit;
  today: string;
  onToggle: (id: string, date: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
}

export default function HabitCard({ habit, today, onToggle, onEdit, onDelete }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const slug = getHabitSlug(habit.name);
  const streak = calculateCurrentStreak(habit.completions, today);
  const completed = habit.completions.includes(today);

  return (
    <div
      data-testid={`habit-card-${slug}`}
      className={`rounded-2xl border p-4 shadow-sm transition-colors ${
        completed ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-100'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-sm truncate ${completed ? 'text-indigo-700' : 'text-gray-900'}`}>
            {habit.name}
          </h3>
          {habit.description && (
            <p className="text-xs text-gray-500 mt-0.5 truncate">{habit.description}</p>
          )}
          <p
            data-testid={`habit-streak-${slug}`}
            className="text-xs mt-1 font-medium text-indigo-500"
          >
            🔥 {streak} day streak
          </p>
        </div>
        <button
          data-testid={`habit-complete-${slug}`}
          onClick={() => onToggle(habit.id, today)}
          aria-label={completed ? 'Mark incomplete' : 'Mark complete'}
          className={`shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            completed
              ? 'bg-indigo-600 border-indigo-600 text-white'
              : 'border-gray-300 text-transparent hover:border-indigo-400'
          }`}
        >
          ✓
        </button>
      </div>

      <div className="flex gap-2 mt-3">
        <button
          data-testid={`habit-edit-${slug}`}
          onClick={() => onEdit(habit)}
          className="text-xs text-gray-500 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1 transition-colors"
        >
          Edit
        </button>
        {!confirmDelete ? (
          <button
            data-testid={`habit-delete-${slug}`}
            onClick={() => setConfirmDelete(true)}
            className="text-xs text-gray-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 rounded px-2 py-1 transition-colors"
          >
            Delete
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-red-600 font-medium">Are you sure?</span>
            <button
              data-testid="confirm-delete-button"
              onClick={() => onDelete(habit.id)}
              className="text-xs bg-red-600 text-white px-2 py-1 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
            >
              Yes, delete
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-xs text-gray-500 px-2 py-1 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
