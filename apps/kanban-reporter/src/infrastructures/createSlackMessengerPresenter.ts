import { WebClient } from '@slack/web-api';

import { Member, Part } from '../entities/member';
import { createKanbanService } from '../services/kanbanService';

type MessengerPresenter = Parameters<typeof createKanbanService>[0]['messengerPresenter'];
type GenerateMessage = Parameters<MessengerPresenter['sendThread']>[0];
type MessageHelpers = Parameters<GenerateMessage>[0];

export const createSlackMessengerPresenter = ({
  slackBotToken,
  slackChannel,
}: {
  slackChannel: string;
  slackBotToken: string;
}): MessengerPresenter => {
  const slackClient = new WebClient(slackBotToken);
  return {
    sendThread: async (text, thread = []) => {
      const channel = `#${slackChannel}`;
      const response = await slackClient.chat.postMessage({ channel, text: getMessage(text) });
      for (const message of thread)
        await slackClient.chat.postMessage({ channel, text: getMessage(message), thread_ts: response.ts });
    },
  };
};

const escapeSymbols = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const getMessage = (message: GenerateMessage) => {
  const formatted = message({
    formatMemberMention: (member) => `<@${MEMBER_SLACK_ID_MAP[member]}>`,
    formatPartMention: (part) => `<!subteam^${PART_SLACK_ID_MAP[part]}>`,
    formatLink: (text, { url }) => `<${url}|${escapeSymbols(text)}>`,
    formatEmoji: (emoji) => `:${EMOJI_SLACK_EMOJI_MAP[emoji]}:`,
    formatBold: (text) => `*${text}*`,
    formatInlineCode: (text) => `\`${text}\``,
  });
  // https://api.slack.com/reference/surfaces/formatting#escaping
  return formatted;
};

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
  [Member.PLGAFHD]: 'U06BEHTT2M8',
  [Member.YUJINMIN514]: 'U05R78P0K8X',
  [Member.ASP345]: 'U06BEEJ664T',
};

const PART_SLACK_ID_MAP: Record<Part, string> = {
  [Part.ALL]: 'S032EFLT1FT',
  [Part.FRONTEND]: 'S0435V69VCG',
  [Part.ANDROID]: 'S0496KFE3RP',
  [Part.IOS]: 'S048U19HQTU',
  [Part.SERVER]: 'S048TT15J9H',
  [Part.DESIGN]: 'S04URBVFHJN',
};

const EMOJI_SLACK_EMOJI_MAP: Record<Parameters<MessageHelpers['formatEmoji']>[0], string> = {
  spring: 'spring',
  react: 'react',
  android: 'android',
  ios: 'apple-black',
  design: 'art',
  null: 'sql-null',
  snutt: 'snutt',
  wip: 'wip',
  help: 'blob_help',
  blob0w0: 'blob0w0',
};
