export type MessengerClient = {
  sendThread: (message: string, threadMessages: string[]) => Promise<unknown>;
};
