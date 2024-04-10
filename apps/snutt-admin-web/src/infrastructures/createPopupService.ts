import type { Token } from '../entities/Auth';
import type { PopupService } from '../services/PopupService';

export const createPopupService = ({
  userPopupRepository,
  adminPopupRepository,
  popupImageRepository,
}: {
  userPopupRepository: { getPopups: () => Promise<{ key: string; url: string; hiddenDays: number; id: string }[]> };
  adminPopupRepository: {
    getPresignedUri: (_: { token: Token }) => Promise<{ uploadUri: string; fileOriginUri: string; fileUri: string }>;
    createPopup: (_: { key: string; hiddenDays: number; imageOriginUri: string; token: Token }) => Promise<void>;
    deletePopup: (_: { id: string; token: Token }) => Promise<void>;
  };
  popupImageRepository: {
    upload: (_: { file: File; uploadUri: string }) => Promise<void>;
  };
}): PopupService => {
  return {
    getCurrentPopups: () => userPopupRepository.getPopups(),
    createPopup: async ({ key, hiddenDays, file, token }) => {
      if (!key) throw new Error('key is required');
      if (!file) throw new Error('file is required');
      if (hiddenDays === null) throw new Error('hiddenDays is required');
      const hiddenDaysNum = parseInt(hiddenDays, 10);
      if (isNaN(hiddenDaysNum)) throw new Error('hiddenDays must be a number');

      const { uploadUri, fileOriginUri } = await adminPopupRepository.getPresignedUri({ token });
      await popupImageRepository.upload({ file, uploadUri });
      await adminPopupRepository.createPopup({ key, hiddenDays: hiddenDaysNum, imageOriginUri: fileOriginUri, token });
    },
    deletePopup: async ({ id, token }) => adminPopupRepository.deletePopup({ id, token }),
  };
};
