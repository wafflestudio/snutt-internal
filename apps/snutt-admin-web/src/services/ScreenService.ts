import type { Theme } from '../entities/Screen';
import type { PersistStorageRepository } from '../repositories/PersistStorageRepository';
import type { ThemeRepository } from '../repositories/ThemeRepository';

export type ScreenService = {
  setCurrentTheme: (theme: Theme) => void;
  getCurrentTheme: () => Theme | undefined;
  getInitialTheme: () => Theme;
};

export const createScreenService = ({
  themeRepository,
  persistStorageRepository,
}: {
  themeRepository: ThemeRepository;
  persistStorageRepository: PersistStorageRepository;
}): ScreenService => {
  return {
    getCurrentTheme: () => {
      return themeRepository.getTheme();
    },
    setCurrentTheme: (theme) => {
      themeRepository.setTheme(theme);
      persistStorageRepository.setItem('theme', theme);
    },
    getInitialTheme: () => {
      return persistStorageRepository.getItem('theme') ?? 'dark';
    },
  };
};
