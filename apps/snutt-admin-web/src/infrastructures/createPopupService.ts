import type { PopupService } from '../services/PopupService';

export const createPopupService = ({
  userPopupRepository,
}: {
  userPopupRepository: { getPopups: () => Promise<{ key: string; url: string; hiddenDays: number }[]> };
}): PopupService => {
  return {
    getCurrentPopups: () => userPopupRepository.getPopups(),
  };
};
