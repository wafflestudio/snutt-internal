import type { ApiClient } from '../clients/ApiClient';
import type { PushNotificationRepository } from '../repositories/PushNotificationRepository';

export const createPushNotificationRepository = ({
  apiClient,
}: {
  apiClient: ApiClient;
}): PushNotificationRepository => {
  return {
    sendPushNotification: ({ token, body, dataPayload, insertFcm, title, type, userId }) =>
      apiClient.post(
        '/v1/admin/insert_noti',
        {
          body,
          dataPayload,
          insertFcm,
          title,
          type: { NORMAL: 0, COURSEBOOK: 1, LECTURE_UPDATE: 2, LECTURE_REMOVE: 3, FRIEND: 4 }[type],
          userId,
        },
        { headers: { 'x-access-token': token } },
      ),
  };
};
