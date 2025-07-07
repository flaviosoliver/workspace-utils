'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { Theme, ThemeName } from '@/types';
import { themes, getTheme, applyTheme } from '@/styles/themes';
import { useAuth } from './AuthContext';

interface ThemeContextType {
  currentTheme: Theme;
  themeName: ThemeName;
  setTheme: (themeName: ThemeName) => void;
  availableThemes: Record<ThemeName, Theme>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { user } = useAuth();
  // Definir o estado inicial com base no localStorage ou preferências do usuário
  const getInitialTheme = (): ThemeName => {
    if (typeof window === 'undefined') return 'oneDark';

    if (user?.preferences?.theme) {
      return user.preferences.theme;
    }

    const localTheme = localStorage.getItem('theme') as ThemeName;
    return localTheme && themes[localTheme] ? localTheme : 'oneDark';
  };

  const [themeName, setThemeName] = useState<ThemeName>(getInitialTheme());
  const [currentTheme, setCurrentTheme] = useState<Theme>(
    themes[getInitialTheme()]
  );

  // Atualizar tema quando o usuário mudar
  useEffect(() => {
    if (user?.preferences?.theme && user.preferences.theme !== themeName) {
      setThemeName(user.preferences.theme);
      setCurrentTheme(getTheme(user.preferences.theme));
    }
  }, [user]);

  // Apply theme when it changes
  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  const setTheme = async (newThemeName: ThemeName) => {
    setThemeName(newThemeName);
    setCurrentTheme(getTheme(newThemeName));

    // Save to localStorage
    localStorage.setItem('theme', newThemeName);

    // Save to user preferences if logged in
    if (user) {
      try {
        const response = await fetch('/api/user/preferences', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            theme: newThemeName,
          }),
        });

        if (!response.ok) {
          console.error('Erro ao salvar preferências do tema');
        }
      } catch (error) {
        console.error('Erro ao salvar preferências do tema:', error);
      }
    }
  };

  const value = {
    currentTheme,
    themeName,
    setTheme,
    availableThemes: themes,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
