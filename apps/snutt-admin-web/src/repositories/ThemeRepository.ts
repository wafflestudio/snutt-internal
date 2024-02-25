export type ThemeRepository = {
  setTheme: (theme: 'light' | 'dark') => void;
  getTheme: () => 'light' | 'dark' | undefined;
};
