import { Habit } from '@/src/types/habit';

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  const completions = habit.completions.includes(date)
    ? habit.completions.filter((d) => d !== date)
    : [...habit.completions, date];

  // Deduplicate just in case
  const unique = Array.from(new Set(completions));

  return { ...habit, completions: unique };
}
