import type { PushNotificationType } from "../entities/PushNotification";

export type PushNotificationService = {
  sendPushNotification: (req: {
    token: string;
    title: string;
    body: string;
    insertFcm: boolean;
    type: PushNotificationType;
    urlScheme: string | undefined;
  }) => Promise<unknown>;
};
