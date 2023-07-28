export type MessengerClient = {
  send: (message: string) => Promise<unknown>;
};
