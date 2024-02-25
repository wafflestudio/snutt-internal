import type { ThemeRepository } from '../repositories/ThemeRepository';

export const createHtmlDocumentThemeRepository = (): ThemeRepository => {
  return {
    setTheme: (theme: 'light' | 'dark') => {
      document.documentElement.setAttribute('data-theme', theme);
    },
    getTheme: () => {
      return document.documentElement.getAttribute('data-theme') as 'light' | 'dark' | undefined;
    },
  };
};
