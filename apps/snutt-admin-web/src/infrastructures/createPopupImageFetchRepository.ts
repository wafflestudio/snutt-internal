import type { createPopupService } from '../services/PopupService';

export const createPopupImageFetchRepository = (): Parameters<typeof createPopupService>[0]['popupImageRepository'] => {
  return {
    upload: async ({ file, uploadUri }) => {
      await fetch(uploadUri, { method: 'PUT', body: file });
    },
  };
};
