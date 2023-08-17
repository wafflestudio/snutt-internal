import { LogLevel, WebClient } from '@slack/web-api';

import { MessengerClient } from '../clients/messengerClient';

export const createSlackMessengerClient = ({
  slackToken,
  slackChannel,
}: {
  slackToken: string;
  slackChannel: string;
}): MessengerClient => {
  const client = new WebClient(slackToken, { logLevel: LogLevel.DEBUG });

  return {
    sendThread: async (text, thread) => {
      const channel = `#${slackChannel}`;
      const response = await client.chat.postMessage({ channel, text });
      await Promise.all(
        thread.map((message) => client.chat.postMessage({ channel, text: message, thread_ts: response.ts })),
      );
    },
  };
};
