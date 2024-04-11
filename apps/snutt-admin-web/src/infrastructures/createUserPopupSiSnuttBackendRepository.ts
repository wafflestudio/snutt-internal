import type { SnuttBackend } from '@si/snutt-backend';

import type { createPopupService } from '../services/PopupService';

export const createUserPopupSiSnuttBackendRepository = ({
  snuttBackend,
}: {
  snuttBackend: SnuttBackend;
}): Parameters<typeof createPopupService>[0]['userPopupRepository'] => {
  return {
    getPopups: () =>
      snuttBackend.http.get['/v1/popups']().then((res) =>
        res.content.map((popup) => ({
          key: popup.key,
          url: popup.imageUri,
          hiddenDays: popup.hiddenDays,
          id: popup.id,
        })),
      ),
  };
};
