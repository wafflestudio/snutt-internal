export type PushNotificationRepository = {
  sendPushNotification: (req: {
    token: string;
    title: string;
    body: string;
    insertFcm: boolean;
    type: number;
    dataPayload: Record<string, string>;
    userId?: string;
  }) => Promise<unknown>;
};
