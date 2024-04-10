import type { Token } from '../entities/Auth';

export type PopupService = {
  getCurrentPopups: () => Promise<{ key: string; url: string; hiddenDays: number | null; id: string }[]>;
  createPopup: (_: { key: string; hiddenDays: string; file: File | null; token: Token }) => Promise<void>;
  deletePopup: (_: { id: string; token: Token }) => Promise<void>;
};
