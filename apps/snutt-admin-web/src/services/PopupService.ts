export type PopupService = {
  getCurrentPopups: () => Promise<{ key: string; url: string; hiddenDays: number | null }[]>;
};
