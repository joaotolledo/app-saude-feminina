/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const AppTheme = {
  colors: {
    primary: '#B55A7D',
    primaryDark: '#8F3D5E',
    primaryLight: '#FCE8EE',
    primarySoft: '#FADEE5',
    background: '#FFF5F8',
    card: '#FFFFFF',
    text: '#4A3E44',
    textSecondary: '#8E7E86',
    textMuted: '#B0A4A8',
    border: '#F3E5EA',
    borderSubtle: '#ECDCE2',
    success: '#2E7D32',
    successBg: '#E8F5E9',
    warning: '#D97706',
    warningBg: '#FFF3E0',
    error: '#D32F2F',
    errorBg: '#FEEBEE',
    lavender: '#8A72C1',
    lavenderLight: '#F3EFFF',
    peach: '#E07A5F',
    peachLight: '#FFF5EE',
  },
  radius: {
    sm: 10,
    md: 16,
    lg: 22,
    pill: 999,
  },
  shadows: {
    card: {
      shadowColor: '#B55A7D',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
      elevation: 3,
    },
    button: {
      shadowColor: '#B55A7D',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.28,
      shadowRadius: 8,
      elevation: 4,
    },
    dock: {
      shadowColor: '#B55A7D',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.16,
      shadowRadius: 18,
      elevation: 10,
    },
  },
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

