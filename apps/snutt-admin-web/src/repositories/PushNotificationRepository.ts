import type { PushNotificationType } from '../entities/PushNotification';

export type PushNotificationRepository = {
  sendPushNotification: (req: {
    token: string;
    title: string;
    body: string;
    insertFcm: boolean;
    type: PushNotificationType;
    dataPayload: Record<string, string>;
  }) => Promise<unknown>;
};
