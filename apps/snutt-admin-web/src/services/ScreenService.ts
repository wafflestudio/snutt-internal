import type { Theme } from '../entities/Screen';

export type ScreenService = {
  setCurrentTheme: (theme: Theme) => void;
  getCurrentTheme: () => Theme | undefined;
  getInitialTheme: () => Theme;
};
