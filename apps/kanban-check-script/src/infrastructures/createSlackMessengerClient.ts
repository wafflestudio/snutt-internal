import { LogLevel, WebClient } from '@slack/web-api';

import { GenerateMessage, MessengerClient } from '../clients/messengerClient';
import { Member, Part } from '../entities/member';

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
      const response = await client.chat.postMessage({ channel, text: getMessage(text) });
      await Promise.all(
        thread.map((message) =>
          client.chat.postMessage({ channel, text: getMessage(message), thread_ts: response.ts }),
        ),
      );
    },
  };
};

const getMessage = (message: GenerateMessage) =>
  message({
    formatMemberMention: (member) => `<@${MEMBER_SLACK_ID_MAP[member]}>`,
    formatPartMention: (part) => `<!subteam^${PART_SLACK_ID_MAP[part]}>`,
    formatLink: (text, { url }) => `<${url}|${text}>`,
  });

const MEMBER_SLACK_ID_MAP: Record<Member, string> = {
  [Member.WOOHM402]: 'U01JQM3GNBW',
  [Member.SHP7724]: 'U030UCYBZC3',
  [Member.JUTAK97]: 'U030UCYA7U3',
  [Member.DAVIN111]: 'ULHAW7P7Z',
  [Member.HANK_CHOI]: 'URJJGG33J',
  [Member.ARS_KI_00]: 'URW5RHG1L',
  [Member.JHVICTOR4]: 'US9MACQUV',
  [Member.EASTSHINE2741]: 'U04EC1QEP6V',
  [Member.PENG_U_0807]: 'U03171C4MFT',
  [Member.CHAEMIN2001]: 'U030WM38PM2',
  [Member.EUXXNIA]: 'U04F0NCC9L4',
  [Member.SUBEENPARK_IO]: 'U01RWCD0821',
};

const PART_SLACK_ID_MAP: Record<Part, string> = {
  [Part.ALL]: 'S032EFLT1FT',
  [Part.FRONTEND]: 'S0435V69VCG',
  [Part.ANDROID]: 'S0496KFE3RP',
  [Part.IOS]: 'S048U19HQTU',
  [Part.SERVER]: 'S048TT15J9H',
  [Part.DESIGN]: 'S04URBVFHJN',
};
