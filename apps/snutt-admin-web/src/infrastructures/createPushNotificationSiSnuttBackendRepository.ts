import type { SnuttBackend } from '@si/snutt-backend';

import type { PushNotificationRepository } from '../repositories/PushNotificationRepository';

export const createPushNotificationSiSnuttBackendRepository = ({
  snuttBackend,
}: {
  snuttBackend: SnuttBackend;
}): PushNotificationRepository => {
  return {
    sendPushNotification: ({ token, body, dataPayload, insertFcm, title, type, userId }) =>
      snuttBackend.http.post['/v1/admin/insert_noti']({
        token,
        body: { body, dataPayload, insertFcm, title, type, userId },
      }),
  };
};
