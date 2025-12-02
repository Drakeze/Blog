declare module 'next-themes' {
  import type { ReactNode } from 'react';

  export type Theme = 'light' | 'dark' | string;

  export interface ThemeProviderProps {
    attribute?: string;
    defaultTheme?: Theme;
    enableSystem?: boolean;
    storageKey?: string;
    children: ReactNode;
  }

  export function useTheme(): { resolvedTheme?: Theme; setTheme: (theme: Theme) => void };
  export function ThemeProvider(props: ThemeProviderProps): JSX.Element;
}

declare module 'next-themes/dist/types' {
  export * from 'next-themes';
}
