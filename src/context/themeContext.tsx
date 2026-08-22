import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import {
  COLORS,
  DARK_COLORS,
  LIGHT_COLORS,
  type ThemeColors,
  type ThemeMode,
} from '../ui/Constants/theme';

const THEME_KEY = 'mono_expenses_theme';

type CustomTheme = Pick<ThemeColors, 'brandStrong' | 'surface' | 'surfaceMuted' | 'textPrimary'>;
type StoredTheme = { mode: ThemeMode; custom: CustomTheme };

const DEFAULT_CUSTOM: CustomTheme = {
  brandStrong: COLORS.brandStrong,
  surface: COLORS.surface,
  surfaceMuted: COLORS.surfaceMuted,
  textPrimary: COLORS.textPrimary,
};

type ThemeContextValue = {
  mode: ThemeMode;
  colors: ThemeColors;
  customColors: CustomTheme;
  setMode: (mode: ThemeMode) => void;
  updateCustomColors: (colors: Partial<CustomTheme>) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>('light');
  const [customColors, setCustomColors] = useState<CustomTheme>(DEFAULT_CUSTOM);

  useEffect(() => {
    void EncryptedStorage.getItem(THEME_KEY).then(value => {
      if (!value) return;
      try {
        const stored = JSON.parse(value) as StoredTheme;
        setModeState(stored.mode ?? 'light');
        setCustomColors({ ...DEFAULT_CUSTOM, ...stored.custom });
      } catch {
        // Ignore malformed theme data and keep the safe light defaults.
      }
    });
  }, []);

  const persist = (nextMode: ThemeMode, nextCustom: CustomTheme) => {
    void EncryptedStorage.setItem(
      THEME_KEY,
      JSON.stringify({ mode: nextMode, custom: nextCustom }),
    );
  };

  const setMode = (nextMode: ThemeMode) => {
    setModeState(nextMode);
    persist(nextMode, customColors);
  };

  const updateCustomColors = (updates: Partial<CustomTheme>) => {
    const nextCustom = { ...customColors, ...updates };
    setCustomColors(nextCustom);
    setModeState('custom');
    persist('custom', nextCustom);
  };

  const colors = useMemo(() => {
    if (mode === 'dark') return DARK_COLORS;
    if (mode === 'custom') return { ...LIGHT_COLORS, ...customColors };
    return LIGHT_COLORS;
  }, [customColors, mode]);

  return (
    <ThemeContext.Provider value={{ mode, colors, customColors, setMode, updateCustomColors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside ThemeProvider');
  return context;
};
