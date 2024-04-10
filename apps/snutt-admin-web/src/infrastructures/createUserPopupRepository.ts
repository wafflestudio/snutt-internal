import type { ApiClient } from '../clients/ApiClient';
import type { createPopupService } from './createPopupService';

export const createUserPopupRepository = ({
  apiClient,
}: {
  apiClient: ApiClient;
}): Parameters<typeof createPopupService>[0]['userPopupRepository'] => {
  return {
    getPopups: () =>
      apiClient
        .get<{ content: { key: string; imageUri: string; hiddenDays: number }[] }>(`/v1/popups`)
        .then((res) =>
          res.content.map((popup) => ({ key: popup.key, url: popup.imageUri, hiddenDays: popup.hiddenDays })),
        ),
  };
};
