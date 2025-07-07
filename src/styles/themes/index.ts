import { Theme, ThemeName } from '@/types';

export const themes: Record<ThemeName, Theme> = {
  oneDark: {
    name: 'oneDark',
    colors: {
      accent: '#98C379',
      background: '#282C34',
      border: '#3E4451',
      error: '#E06C75',
      primary: '#61AFEF',
      secondary: '#C678DD',
      success: '#98C379',
      surface: '#21252B',
      text: '#ABB2BF',
      textSecondary: '#5C6370',
      warning: '#E5C07B',
    },
  },
  dracula: {
    name: 'dracula',
    colors: {
      accent: '#50FA7B',
      background: '#282A36',
      border: '#6272A4',
      error: '#FF5555',
      primary: '#FF79C6',
      secondary: '#BD93F9',
      success: '#50FA7B',
      surface: '#383951',
      text: '#F8F8F2',
      textSecondary: '#6272A4',
      warning: '#F1FA8C',
    },
  },
  monokai: {
    name: 'monokai',
    colors: {
      accent: '#A6E22E',
      background: '#272822',
      border: '#75715E',
      error: '#F92672',
      primary: '#FD971F',
      secondary: '#AE81FF',
      success: '#A6E22E',
      surface: '#3E3D32',
      text: '#F8F8F2',
      textSecondary: '#75715E',
      warning: '#E6DB74',
    },
  },
  light: {
    name: 'light',
    colors: {
      accent: '#059669',
      background: '#FFFFFF',
      border: '#E2E8F0',
      error: '#DC2626',
      primary: '#0066CC',
      secondary: '#6B46C1',
      success: '#059669',
      surface: '#F8FAFC',
      text: '#1E293B',
      textSecondary: '#64748B',
      warning: '#D97706',
    },
  },
  cyberpunk: {
    name: 'cyberpunk',
    colors: {
      accent: '#FF007C',
      background: '#0D0D0D',
      border: '#1A1A1A',
      error: '#FF3D00',
      primary: '#00E5FF',
      secondary: '#FFEA00',
      success: '#00C853',
      surface: '#121212',
      text: '#E0E0E0',
      textSecondary: '#B0BEC5',
      warning: '#FFD600',
    },
  },
  solarized: {
    name: 'solarized',
    colors: {
      accent: '#B58900',
      background: '#FDF6E3',
      border: '#EEE8D5',
      error: '#DC322F',
      primary: '#268BD2',
      secondary: '#D33682',
      success: '#859900',
      surface: '#EEE8D5',
      text: '#657B83',
      textSecondary: '#586E75',
      warning: '#B58900',
    },
  },
  synthwave: {
    name: 'synthwave',
    colors: {
      accent: '#ff8ae2',
      background: '#4b0082',
      border: '#1a1a1a',
      error: '#FF3D00',
      primary: '#1a0033',
      secondary: '#330066',
      success: '#19C973',
      surface: '#121212',
      text: '#e0e0e0',
      textSecondary: '#b0bec5',
      warning: '#ffd600',
    },
  },
};

export const getTheme = (themeName: ThemeName): Theme => {
  return themes[themeName] || themes.oneDark;
};

export const applyTheme = (theme: Theme) => {
  const root = document.documentElement;

  // Apply CSS custom properties
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });

  // Update Tailwind CSS variables
  root.style.setProperty('--tw-bg-opacity', '1');
  root.style.setProperty('--tw-text-opacity', '1');
};
