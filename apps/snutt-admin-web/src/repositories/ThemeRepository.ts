import type { Theme } from '../entities/Screen';

export type ThemeRepository = {
  setTheme: (theme: Theme) => void;
  getTheme: () => Theme | undefined;
};
