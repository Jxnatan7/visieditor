import React, { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import { draculaTheme, draculaLightTheme } from './themes';
import type { Theme } from './themes';

type ThemeContextValue = Theme & {
  themeId: string;
  setTheme: (id: 'dracula' | 'dracula-light') => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}

type Props = PropsWithChildren<{
  overrideTheme?: 'dracula' | 'dracula-light' | 'system';
}>;

export function ThemeProvider({ children, overrideTheme = 'system' }: Props) {
  const systemScheme = useColorScheme();

  const resolveTheme = (override: string): Theme => {
    if (override === 'system') {
      return systemScheme === 'light' ? draculaLightTheme : draculaTheme;
    }
    return override === 'dracula-light' ? draculaLightTheme : draculaTheme;
  };

  const [currentTheme, setCurrentTheme] = useState<Theme>(() => resolveTheme(overrideTheme));
  const [themeId, setThemeId] = useState(overrideTheme === 'system'
    ? (systemScheme === 'light' ? 'dracula-light' : 'dracula')
    : overrideTheme,
  );

  useEffect(() => {
    if (overrideTheme === 'system') {
      setCurrentTheme(resolveTheme('system'));
      setThemeId(systemScheme === 'light' ? 'dracula-light' : 'dracula');
    }
  }, [systemScheme, overrideTheme]);

  const setTheme = (id: 'dracula' | 'dracula-light') => {
    setCurrentTheme(resolveTheme(id));
    setThemeId(id);
  };

  return (
    <ThemeContext.Provider value={{ ...currentTheme, themeId, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
