import { Theme, ThemeName } from '@/types';

export const themes: Record<ThemeName, Theme> = {
  oneDark: {
    name: 'oneDark',
    colors: {
      accent: '#7EC699',
      background: '#21252B',
      border: '#3A404C',
      error: '#D8616B',
      primary: '#5CADF0',
      secondary: '#C774E6',
      success: '#7EC699',
      surface: '#282C34',
      text: '#ABB2BF',
      textSecondary: '#5C6370',
      warning: '#E5B87B',
    },
  },
  dracula: {
    name: 'dracula',
    colors: {
      accent: '#5AFF88',
      background: '#21222C',
      border: '#717BA4',
      error: '#FF6E6E',
      primary: '#FF92D0',
      secondary: '#CA9EFF',
      success: '#5AFF88',
      surface: '#343746',
      text: '#F8F8F2',
      textSecondary: '#717BA4',
      warning: '#FFFFA5',
    },
  },
  monokai: {
    name: 'monokai',
    colors: {
      accent: '#A1E533',
      background: '#2D2A23',
      border: '#696556',
      error: '#FF2965',
      primary: '#FF8C1A',
      secondary: '#B58CFF',
      success: '#A1E533',
      surface: '#3C3A30',
      text: '#F8F8F0',
      textSecondary: '#696556',
      warning: '#FFE16E',
    },
  },
  light: {
    name: 'light',
    colors: {
      accent: '#0E9F6E',
      background: '#F9FAFB',
      border: '#E5E7EB',
      error: '#EF4444',
      primary: '#1A56DB',
      secondary: '#7E3AF2',
      success: '#0E9F6E',
      surface: '#FFFFFF',
      text: '#111827',
      textSecondary: '#6B7280',
      warning: '#F59E0B',
    },
  },
  cyberpunk: {
    name: 'cyberpunk',
    colors: {
      accent: '#FF1B8D',
      background: '#000000',
      border: '#2A2A2A',
      error: '#FF2E00',
      primary: '#00F0FF',
      secondary: '#FFEE00',
      success: '#00D45A',
      surface: '#1A1A1A',
      text: '#E5E5E5',
      textSecondary: '#A5A5A5',
      warning: '#FFDD00',
    },
  },
  solarized: {
    name: 'solarized',
    colors: {
      accent: '#B57F00',
      background: '#F5EFDC',
      border: '#E5DBC3',
      error: '#D12B2B',
      primary: '#2079B2',
      secondary: '#D02B7A',
      success: '#7B8F00',
      surface: '#E5DBC3',
      text: '#5F6B75',
      textSecondary: '#53616B',
      warning: '#B57F00',
    },
  },
  synthwave: {
    name: 'synthwave',
    colors: {
      accent: '#FF7EDB',
      background: '#3A006B',
      border: '#2A2A2A',
      error: '#FF2E00',
      primary: '#26004D',
      secondary: '#4D0099',
      success: '#00D47E',
      surface: '#2A0055',
      text: '#F0E0FF',
      textSecondary: '#C5A5E5',
      warning: '#FFCC00',
    },
  },
  red: {
    name: 'red',
    colors: {
      accent: '#FF6B6B',
      background: '#1A1A1A',
      border: '#4D1A1A',
      error: '#FF3D3D',
      primary: '#FF4D4D',
      secondary: '#FF9999',
      success: '#4CAF50',
      surface: '#2A1A1A',
      text: '#FFE5E5',
      textSecondary: '#B38A8A',
      warning: '#FFC107',
    },
  },
  yellow: {
    name: 'yellow',
    colors: {
      accent: '#FFD166',
      background: '#1A1A12',
      border: '#4D4A1A',
      error: '#FF6B6B',
      primary: '#FFD700',
      secondary: '#FFEE93',
      success: '#06D6A0',
      surface: '#2A2A1A',
      text: '#FFFFE5',
      textSecondary: '#B3B38A',
      warning: '#FFAA00',
    },
  },
  green: {
    name: 'green',
    colors: {
      accent: '#83E8BA',
      background: '#121A1A',
      border: '#1A4D3A',
      error: '#FF5252',
      primary: '#4CAF50',
      secondary: '#A5D6A7',
      success: '#00E676',
      surface: '#1A2A22',
      text: '#E5FFEE',
      textSecondary: '#8AB38A',
      warning: '#FFD740',
    },
  },
  purple: {
    name: 'purple',
    colors: {
      accent: '#C77DFF',
      background: '#1A1A2A',
      border: '#4D1A4D',
      error: '#FF4081',
      primary: '#9C27B0',
      secondary: '#CE93D8',
      success: '#64FFDA',
      surface: '#2A1A3A',
      text: '#F5E5FF',
      textSecondary: '#B38AB3',
      warning: '#FFAB00',
    },
  },
  blue: {
    name: 'blue',
    colors: {
      accent: '#6EC6FF',
      background: '#121A2A',
      border: '#1A3A4D',
      error: '#FF1744',
      primary: '#2196F3',
      secondary: '#90CAF9',
      success: '#00E5FF',
      surface: '#1A223A',
      text: '#E5F5FF',
      textSecondary: '#8AA5B3',
      warning: '#FF9100',
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
