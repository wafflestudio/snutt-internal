import { Group, Member } from '../entities/member';

export type MessageHelpers = {
  formatMemberMention: (member: Member) => string;
  formatGroupMention: (group: Group) => string;
  formatLink: (text: string, args: { url: string }) => string;
};

export type GenerateMessage = (helpers: MessageHelpers) => string;

export type MessengerClient = {
  sendThread: (message: GenerateMessage, threadMessages: GenerateMessage[]) => Promise<unknown>;
};
