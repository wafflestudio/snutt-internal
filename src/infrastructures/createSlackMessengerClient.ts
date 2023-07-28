import { MessengerClient } from '../clients/messengerClient';
import { WebClient, LogLevel } from '@slack/web-api';

export const createSlackMessengerClient = ({ slackToken }: { slackToken: string }): MessengerClient => {
  const client = new WebClient(slackToken, {
    // LogLevel can be imported and used to make debugging simpler
    logLevel: LogLevel.DEBUG,
  });

  return { send: (text) => client.chat.postMessage({ channel: '#test', text }) };
};
