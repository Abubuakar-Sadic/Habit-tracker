'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@/src/types/auth';
import { getSession, saveSession, clearSession, getUsers, saveUsers } from '@/src/lib/storage';

interface AuthContextType {
  session: Session | null;
  loading: boolean;
  signup: (email: string, password: string) => { success: boolean; error: string | null };
  login: (email: string, password: string) => { success: boolean; error: string | null };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = getSession();
    setSession(s);
    setLoading(false);
  }, []);

  function signup(email: string, password: string) {
    const users = getUsers();
    if (users.find((u) => u.email === email)) {
      return { success: false, error: 'User already exists' };
    }
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      password,
      createdAt: new Date().toISOString(),
    };
    saveUsers([...users, newUser]);
    const sess: Session = { userId: newUser.id, email: newUser.email };
    saveSession(sess);
    setSession(sess);
    return { success: true, error: null };
  }

  function login(email: string, password: string) {
    const users = getUsers();
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }
    const sess: Session = { userId: user.id, email: user.email };
    saveSession(sess);
    setSession(sess);
    return { success: true, error: null };
  }

  function logout() {
    clearSession();
    setSession(null);
  }

  return (
    <AuthContext.Provider value={{ session, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
