import { Member, Part } from '../entities/member';

export type MessageHelpers = {
  formatMemberMention: (member: Member) => string;
  formatPartMention: (part: Part) => string;
  formatLink: (text: string, args: { url: string }) => string;
};

export type GenerateMessage = (helpers: MessageHelpers) => string;

export type MessengerPresenter = {
  sendThread: (message: GenerateMessage, threadMessages: GenerateMessage[]) => Promise<unknown>;
};
