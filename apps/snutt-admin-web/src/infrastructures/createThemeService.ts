import type { PersistStorageRepository } from '../repositories/PersistStorageRepository';
import type { ThemeRepository } from '../repositories/ThemeRepository';
import type { ScreenService } from '../services/ScreenService';

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
