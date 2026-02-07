"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { api } from '@/lib/api-client';

// Theme types
export type Theme = 'dark' | 'light' | 'system';
export type AccentColor = 'teal' | 'blue' | 'purple' | 'pink' | 'orange';

// App state interface
interface AppState {
  // User state
  userId: string | null;
  userEmail: string | null;
  displayName: string;
  isAuthenticated: boolean;

  // Theme state
  theme: Theme;
  accentColor: AccentColor;

  // Data state
  tasks: any[];
  tasksLoading: boolean;
  unreadMessages: number;
  unreadNotifications: number;

  // Actions
  setTheme: (theme: Theme) => void;
  setAccentColor: (color: AccentColor) => void;
  setDisplayName: (name: string) => void;
  refreshTasks: () => Promise<void>;
  incrementUnreadMessages: () => void;
  decrementUnreadMessages: () => void;
  setUnreadNotifications: (count: number) => void;
  logout: () => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [displayName, setDisplayNameState] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [theme, setThemeState] = useState<Theme>('dark');
  const [accentColor, setAccentColorState] = useState<AccentColor>('teal');

  const [tasks, setTasks] = useState<any[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Initialize user state from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('user_id');
      const storedEmail = localStorage.getItem('user_email');
      const storedDisplayName = localStorage.getItem('display_name');
      const token = localStorage.getItem('auth_token');

      if (token && storedUserId) {
        setUserId(storedUserId);
        setUserEmail(storedEmail);
        setDisplayNameState(storedDisplayName || (storedEmail ? storedEmail.split('@')[0] : ''));
        setIsAuthenticated(true);
      }

      // Load theme preferences
      const storedTheme = localStorage.getItem('theme') as Theme;
      const storedAccentColor = localStorage.getItem('accentColor') as AccentColor;

      if (storedTheme) setThemeState(storedTheme);
      if (storedAccentColor) setAccentColorState(storedAccentColor);
    }
  }, []);

  // Fetch tasks when user is authenticated
  useEffect(() => {
    if (isAuthenticated && userId) {
      refreshTasks().catch(error => {
        console.error('Failed to load tasks initially:', error);
        // Don't throw the error, just log it to prevent the white screen
      });
    }
  }, [isAuthenticated, userId]);

  // Auto-refresh tasks every 30 seconds
  useEffect(() => {
    if (!isAuthenticated || !userId) return;

    const interval = setInterval(() => {
      refreshTasks().catch(error => {
        console.error('Failed to refresh tasks:', error);
        // Don't throw the error, just log it to prevent the white screen
      });
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated, userId]);

  // Apply theme to document
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;

      // Apply theme
      if (theme === 'light') {
        root.classList.remove('dark');
      } else {
        root.classList.add('dark');
      }

      // Apply accent color CSS variables
      const accentColors = {
        teal: { primary: '6, 182, 212', secondary: '20, 184, 166' },
        blue: { primary: '59, 130, 246', secondary: '37, 99, 235' },
        purple: { primary: '168, 85, 247', secondary: '147, 51, 234' },
        pink: { primary: '236, 72, 153', secondary: '219, 39, 119' },
        orange: { primary: '251, 146, 60', secondary: '249, 115, 22' }
      };

      const colors = accentColors[accentColor];
      root.style.setProperty('--color-accent-primary', colors.primary);
      root.style.setProperty('--color-accent-secondary', colors.secondary);
    }
  }, [theme, accentColor]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }
  };

  const setAccentColor = (color: AccentColor) => {
    setAccentColorState(color);
    if (typeof window !== 'undefined') {
      localStorage.setItem('accentColor', color);
    }
  };

  const setDisplayName = (name: string) => {
    setDisplayNameState(name);
    if (typeof window !== 'undefined') {
      localStorage.setItem('display_name', name);
    }
  };

  const refreshTasks = useCallback(async () => {
    if (!userId) return;

    try {
      setTasksLoading(true);
      const tasksData = await api.getTasks(userId);
      setTasks(tasksData);
    } catch (error) {
      console.error('Failed to refresh tasks:', error);
    } finally {
      setTasksLoading(false);
    }
  }, [userId]);

  const incrementUnreadMessages = () => {
    setUnreadMessages(prev => prev + 1);
  };

  const decrementUnreadMessages = () => {
    setUnreadMessages(prev => Math.max(0, prev - 1));
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_email');
      localStorage.removeItem('display_name');
      document.cookie = 'auth_token=; path=/; max-age=0';
    }
    setUserId(null);
    setUserEmail(null);
    setDisplayNameState('');
    setIsAuthenticated(false);
    setTasks([]);
    setUnreadMessages(0);
    setUnreadNotifications(0);
  };

  const value: AppState = {
    userId,
    userEmail,
    displayName,
    isAuthenticated,
    theme,
    accentColor,
    tasks,
    tasksLoading,
    unreadMessages,
    unreadNotifications,
    setTheme,
    setAccentColor,
    setDisplayName,
    refreshTasks,
    incrementUnreadMessages,
    decrementUnreadMessages,
    setUnreadNotifications,
    logout
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
