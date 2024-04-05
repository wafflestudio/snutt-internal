import { Member, Part } from '@sf/entities';

export type MessageHelpers = {
  formatMemberMention: (member: Member) => string;
  formatPartMention: (part: Part) => string;
  formatLink: (text: string, args: { url: string }) => string;
  formatEmoji: (
    emoji: 'blob0w0' | 'snutt' | 'spring' | 'react' | 'android' | 'ios' | 'design' | 'null' | 'wip' | 'help',
  ) => string;
  formatBold: (text: string) => string;
  formatInlineCode: (text: string) => string;
};

export type GenerateMessage = (helpers: MessageHelpers) => string;

export type MessengerPresenter = {
  sendThread: (message: GenerateMessage, threadMessages?: GenerateMessage[]) => Promise<unknown>;
};
