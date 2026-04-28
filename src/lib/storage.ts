import { User, Session } from '@/src/types/auth';
import { Habit } from '@/src/types/habit';

const KEYS = {
  USERS: 'habit-tracker-users',
  SESSION: 'habit-tracker-session',
  HABITS: 'habit-tracker-habits',
} as const;

// Users
export function getUsers(): User[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
  } catch {
    return [];
  }
}

export function saveUsers(users: User[]): void {
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
}

// Session
export function getSession(): Session | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEYS.SESSION);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && parsed.userId ? parsed : null;
  } catch {
    return null;
  }
}

export function saveSession(session: Session): void {
  localStorage.setItem(KEYS.SESSION, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(KEYS.SESSION);
}

// Habits
export function getHabits(): Habit[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEYS.HABITS) || '[]');
  } catch {
    return [];
  }
}

export function saveHabits(habits: Habit[]): void {
  localStorage.setItem(KEYS.HABITS, JSON.stringify(habits));
}
