type Theme = 'light' | 'dark';

export type ScreenService = {
  setCurrentTheme: (theme: 'light' | 'dark') => void;
  getCurrentTheme: () => Theme | undefined;
  getInitialTheme: () => Theme;
};
