import type { Theme } from '../entities/Screen';
import type { ThemeRepository } from '../repositories/ThemeRepository';

export const createHtmlDocumentThemeRepository = (): ThemeRepository => {
  return {
    setTheme: (theme) => {
      document.documentElement.setAttribute('data-theme', theme);
    },
    getTheme: () => {
      return document.documentElement.getAttribute('data-theme') as Theme | undefined;
    },
  };
};
