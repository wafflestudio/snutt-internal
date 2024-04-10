import type { ApiClient } from '../clients/ApiClient';
import type { createPopupService } from './createPopupService';

export const createAdminPopupRepository = ({
  apiClient,
}: {
  apiClient: ApiClient;
}): Parameters<typeof createPopupService>[0]['adminPopupRepository'] => {
  return {
    getPresignedUri: ({ token }) =>
      apiClient
        .post<
          { uploadUri: string; fileOriginUri: string; fileUri: string }[]
        >(`/v1/admin/images/popup/upload-uris`, {}, { headers: { 'x-access-token': token } })
        .then((res) => res[0]),
    createPopup: async ({ hiddenDays, imageOriginUri, key, token }) =>
      apiClient.post(`/v1/admin/popups`, { hiddenDays, imageOriginUri, key }, { headers: { 'x-access-token': token } }),
    deletePopup: ({ id, token }) =>
      apiClient.delete(`/v1/admin/popups/${id}`, { headers: { 'x-access-token': token } }),
  };
};
