import { describe, it, expect } from 'vitest';
import { getHabitSlug } from '@/src/lib/slug';

describe('getHabitSlug', () => {
  it('returns lowercase hyphenated slug for a basic habit name', () => {
    expect(getHabitSlug('Drink Water')).toBe('drink-water');
    expect(getHabitSlug('Read Books')).toBe('read-books');
  });

  it('trims outer spaces and collapses repeated internal spaces', () => {
    expect(getHabitSlug('  Drink  Water  ')).toBe('drink-water');
    expect(getHabitSlug('  Read   Books  ')).toBe('read-books');
  });

  it('removes non alphanumeric characters except hyphens', () => {
    expect(getHabitSlug('Drink Water!')).toBe('drink-water');
    expect(getHabitSlug('Go to Gym 1')).toBe('go-to-gym-1');
    expect(getHabitSlug('pre-existing-habit')).toBe('pre-existing-habit');
  });
});
