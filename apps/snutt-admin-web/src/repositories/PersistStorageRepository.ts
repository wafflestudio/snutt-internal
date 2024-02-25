import type { PersistStorageData } from '../entities/PersistStorage';

export type PersistStorageRepository = {
  setItem: <T extends keyof PersistStorageData>(key: T, value: PersistStorageData[T]) => void;
  getItem: <T extends keyof PersistStorageData>(key: T) => PersistStorageData[T] | null;
};
