'use client';
import { useState, useEffect } from 'react';
import { validateHabitName } from '@/src/lib/validators';
import type { Habit } from '@/src/types/habit';

interface Props {
  onSave: (name: string, description: string) => void;
  onCancel: () => void;
  initial?: Pick<Habit, 'name' | 'description'>;
}

export default function HabitForm({ onSave, onCancel, initial }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial) {
      setName(initial.name);
      setDescription(initial.description);
    }
  }, [initial]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validation = validateHabitName(name);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }
    setError(null);
    onSave(validation.value, description.trim());
  }

  return (
    <form data-testid="habit-form" onSubmit={handleSubmit} className="space-y-4 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
      {error && (
        <p role="alert" className="text-red-600 text-sm bg-red-50 p-2 rounded-lg">{error}</p>
      )}
      <div>
        <label htmlFor="habit-name" className="block text-sm font-medium text-gray-700 mb-1">
          Habit name <span className="text-red-500">*</span>
        </label>
        <input
          id="habit-name"
          type="text"
          data-testid="habit-name-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="e.g. Drink Water"
        />
      </div>
      <div>
        <label htmlFor="habit-description" className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <input
          id="habit-description"
          type="text"
          data-testid="habit-description-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="e.g. 8 glasses a day"
        />
      </div>
      <div>
        <label htmlFor="habit-frequency" className="block text-sm font-medium text-gray-700 mb-1">
          Frequency
        </label>
        <select
          id="habit-frequency"
          data-testid="habit-frequency-select"
          defaultValue="daily"
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          <option value="daily">Daily</option>
        </select>
      </div>
      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          data-testid="habit-save-button"
          className="flex-1 bg-indigo-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
        >
          Save habit
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl text-sm font-semibold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
