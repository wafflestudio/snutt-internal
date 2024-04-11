import type { SnuttBackend } from '@si/snutt-backend';

import type { createPopupService } from '../services/PopupService';

export const createAdminPopupSiSnuttBackendRepository = ({
  snuttBackend,
}: {
  snuttBackend: SnuttBackend;
}): Parameters<typeof createPopupService>[0]['adminPopupRepository'] => {
  return {
    getPresignedUri: ({ token }) =>
      snuttBackend.http.post['/v1/admin/images/{source}/upload-uris']({ path: { source: 'popup' }, token }).then(
        (res) => res[0],
      ),
    createPopup: async ({ hiddenDays, imageOriginUri, key, token }) =>
      snuttBackend.http.post['/v1/admin/popups']({ body: { hiddenDays, imageOriginUri, key }, token }),
    deletePopup: ({ id, token }) => snuttBackend.http.delete['/v1/admin/popups/{id}']({ path: { id }, token }),
  };
};
