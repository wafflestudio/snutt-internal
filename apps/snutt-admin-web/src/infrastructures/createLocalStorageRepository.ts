import type { PersistStorageRepository } from '../repositories/PersistStorageRepository';

export const createLocalStorageRepository = (): PersistStorageRepository => {
  return {
    getItem: (key) => {
      const value = localStorage.getItem(key);
      if (value === null) return null;

      try {
        return JSON.parse(value);
      } catch (e) {
        return null;
      }
    },

    setItem: (key, value) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
  };
};
