import type { PushNotificationRepository } from '../repositories/PushNotificationRepository';
import type { PushNotificationService } from '../services/PushNotificationService';

export const createPushNotificationService = ({
  pushNotificationRepository,
}: {
  pushNotificationRepository: PushNotificationRepository;
}): PushNotificationService => {
  return {
    sendPushNotification: (req) => {
      return pushNotificationRepository.sendPushNotification({
        token: req.token,
        title: req.title,
        body: req.body,
        insertFcm: req.insertFcm,
        type: req.type,
        dataPayload: req.urlScheme ? { urlScheme: req.urlScheme } : {},
      });
    },
  };
};
