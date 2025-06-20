'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { ThemeName } from '@/types';
import { Palette, Check } from 'lucide-react';

const themeLabels: Record<ThemeName, string> = {
  oneDark: 'One Dark',
  dracula: 'Dracula',
  monokai: 'Monokai',
  light: 'Light',
};

const themeDescriptions: Record<ThemeName, string> = {
  oneDark: 'Tema escuro inspirado no Atom One Dark',
  dracula: 'Tema escuro com cores vibrantes',
  monokai: 'Tema escuro clássico do Sublime Text',
  light: 'Tema claro e minimalista',
};

export default function ThemeSelector() {
  const { currentTheme, themeName, setTheme, availableThemes } = useTheme();

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-6">
        <Palette className="text-theme-primary w-5 h-5" />
        <h3 className="text-theme-text text-lg font-semibold">Tema da Interface</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(Object.keys(availableThemes) as ThemeName[]).map((theme) => {
          const isSelected = themeName === theme;
          const themeColors = availableThemes[theme].colors;
          
          return (
            <button
              key={theme}
              onClick={() => setTheme(theme)}
              className={`
                relative p-4 rounded-lg border-2 transition-all duration-200 text-left
                ${isSelected 
                  ? 'border-theme-primary bg-theme-primary bg-opacity-10' 
                  : 'border-theme-border bg-theme-surface hover:border-theme-border hover:border-opacity-50'
                }
              `}
            >
              {/* Theme Preview */}
              <div className="flex items-center space-x-3 mb-3">
                <div className="flex space-x-1">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: themeColors.primary }}
                  ></div>
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: themeColors.secondary }}
                  ></div>
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: themeColors.accent }}
                  ></div>
                </div>
                
                {isSelected && (
                  <Check className="text-theme-primary w-5 h-5 ml-auto" />
                )}
              </div>

              {/* Theme Info */}
              <div>
                <h4 className="text-theme-text font-medium mb-1">
                  {themeLabels[theme]}
                </h4>
                <p className="text-theme-text-secondary text-sm">
                  {themeDescriptions[theme]}
                </p>
              </div>

              {/* Theme Colors Preview */}
              <div className="mt-3 p-2 rounded bg-theme-surface">
                <div className="flex items-center justify-between">
                  <div className="text-theme-text text-xs font-mono">
                    Texto principal
                  </div>
                  <div className="text-theme-text-secondary text-xs">
                    Secundário
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

