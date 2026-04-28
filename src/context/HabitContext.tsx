'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Habit } from '@/src/types/habit';
import { getHabits, saveHabits } from '@/src/lib/storage';
import { toggleHabitCompletion } from '@/src/lib/habits';
import { useAuth } from './AuthContext';

interface HabitContextType {
  habits: Habit[];
  addHabit: (name: string, description: string) => void;
  updateHabit: (id: string, name: string, description: string) => void;
  deleteHabit: (id: string) => void;
  toggleCompletion: (id: string, date: string) => void;
}

const HabitContext = createContext<HabitContextType | null>(null);

export function HabitProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    if (session) {
      const all = getHabits();
      setHabits(all.filter((h) => h.userId === session.userId));
    } else {
      setHabits([]);
    }
  }, [session]);

  function persist(updated: Habit[]) {
    const all = getHabits();
    const others = all.filter((h) => h.userId !== session?.userId);
    saveHabits([...others, ...updated]);
    setHabits(updated);
  }

  function addHabit(name: string, description: string) {
    if (!session) return;
    const habit: Habit = {
      id: crypto.randomUUID(),
      userId: session.userId,
      name,
      description,
      frequency: 'daily',
      createdAt: new Date().toISOString(),
      completions: [],
    };
    persist([...habits, habit]);
  }

  function updateHabit(id: string, name: string, description: string) {
    const updated = habits.map((h) =>
      h.id === id ? { ...h, name, description } : h
    );
    persist(updated);
  }

  function deleteHabit(id: string) {
    persist(habits.filter((h) => h.id !== id));
  }

  function toggleCompletion(id: string, date: string) {
    const updated = habits.map((h) =>
      h.id === id ? toggleHabitCompletion(h, date) : h
    );
    persist(updated);
  }

  return (
    <HabitContext.Provider value={{ habits, addHabit, updateHabit, deleteHabit, toggleCompletion }}>
      {children}
    </HabitContext.Provider>
  );
}

export function useHabits() {
  const ctx = useContext(HabitContext);
  if (!ctx) throw new Error('useHabits must be used within HabitProvider');
  return ctx;
}
