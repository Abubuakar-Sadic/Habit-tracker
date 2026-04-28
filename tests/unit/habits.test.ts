import { describe, it, expect } from 'vitest';
import { toggleHabitCompletion } from '@/src/lib/habits';
import type { Habit } from '@/src/types/habit';

const makeHabit = (completions: string[]): Habit => ({
  id: 'h1',
  userId: 'u1',
  name: 'Test Habit',
  description: '',
  frequency: 'daily',
  createdAt: '2024-01-01T00:00:00.000Z',
  completions,
});

describe('toggleHabitCompletion', () => {
  it('adds a completion date when the date is not present', () => {
    const habit = makeHabit([]);
    const result = toggleHabitCompletion(habit, '2024-06-15');
    expect(result.completions).toContain('2024-06-15');
  });

  it('removes a completion date when the date already exists', () => {
    const habit = makeHabit(['2024-06-15']);
    const result = toggleHabitCompletion(habit, '2024-06-15');
    expect(result.completions).not.toContain('2024-06-15');
  });

  it('does not mutate the original habit object', () => {
    const habit = makeHabit(['2024-06-14']);
    toggleHabitCompletion(habit, '2024-06-15');
    expect(habit.completions).toEqual(['2024-06-14']);
    expect(habit.completions).not.toContain('2024-06-15');
  });

  it('does not return duplicate completion dates', () => {
    const habit = makeHabit(['2024-06-15', '2024-06-15']);
    const result = toggleHabitCompletion(habit, '2024-06-14');
    const count = result.completions.filter((d) => d === '2024-06-15').length;
    expect(count).toBe(1);
  });
});
