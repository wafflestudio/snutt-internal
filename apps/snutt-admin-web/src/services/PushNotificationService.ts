import type { PushNotificationType } from '../entities/PushNotification';

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
