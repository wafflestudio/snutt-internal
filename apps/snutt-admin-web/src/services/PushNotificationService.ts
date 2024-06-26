import type { PushNotificationType } from '../entities/PushNotification';
import type { AuthRepository } from '../repositories/AuthRepository';
import type { PushNotificationRepository } from '../repositories/PushNotificationRepository';

export type PushNotificationService = {
  sendNotification: (req: {
    token: string;
    notification: {
      title: string;
      body: string;
      sendPush: boolean;
      sendToMeOnly: boolean;
      type: PushNotificationType;
      urlScheme?: string;
    };
  }) => Promise<unknown>;
};

export const createPushNotificationService = ({
  pushNotificationRepository,
  authRepository,
}: {
  authRepository: AuthRepository;
  pushNotificationRepository: PushNotificationRepository;
}): PushNotificationService => {
  return {
    sendNotification: async ({ token, notification }) => {
      const userId = await (() => {
        if (!notification.sendToMeOnly) return undefined;
        return authRepository.getMe({ token }).then((me) => me.userId);
      })();

      return pushNotificationRepository.sendPushNotification({
        token: token,
        title: notification.title,
        body: notification.body,
        insertFcm: notification.sendPush,
        type: { NORMAL: 0, COURSEBOOK: 1, LECTURE_UPDATE: 2, LECTURE_REMOVE: 3, FRIEND: 4 }[notification.type],
        dataPayload: notification.urlScheme ? { url_scheme: notification.urlScheme } : {},
        userId,
      });
    },
  };
};
