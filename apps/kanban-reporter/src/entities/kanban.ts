import { Member, Part } from './member';

export type Card = {
  id: string;
  part: Part | null;
  url: string;
  assignee: KanbanMember[];
  status: 'Backlog' | 'To Do' | 'In Progress' | 'In Review' | 'Archived' | 'Done' | 'Released';
  title: string;
  schedule: readonly [Date, Date] | null;
  epic: Epic['id'] | null;
};

export type Epic = {
  id: string;
  title: string;
  url: string;
  manager: KanbanMember;
  status: 'Not Started' | 'In Progress' | 'Archived' | 'Done';
};

export const CARD_STATUS_ORDER: Record<Card['status'], number> = {
  Backlog: 0,
  'To Do': 1,
  'In Progress': 2,
  'In Review': 3,
  Done: 4,
  Released: 5,
  Archived: 6,
};

export type KanbanMember = { type: 'member'; member: Member } | { type: 'anonymous'; display: string };

export enum CardAbnormalReason {
  DUE_DATE_PASSED = 'DUE_DATE_PASSED',
  NO_ASSIGNEE = 'NO_ASSIGNEE',
  NO_SCHEDULE = 'NO_SCHEDULE',
  NO_PART = 'NO_PART',
}

export const isCardAbnormal = (card: Card): { abnormal: false } | { abnormal: true; reason: CardAbnormalReason } => {
  if (
    (card.status === 'To Do' || card.status === 'In Progress' || card.status === 'In Review') &&
    card.schedule === null
  ) {
    return { abnormal: true, reason: CardAbnormalReason.NO_SCHEDULE };
  }

  if (card.status !== 'Done' && card.status !== 'Archived' && card.status !== 'Released' && card.schedule !== null) {
    const today = new Date().getTime();
    const dueDate = card.schedule[1].getTime();
    if (today > dueDate) return { abnormal: true, reason: CardAbnormalReason.DUE_DATE_PASSED };
  }

  if (card.status !== 'Done' && card.status !== 'Archived' && card.status !== 'Released' && card.status !== 'Backlog') {
    if (card.assignee.length === 0) return { abnormal: true, reason: CardAbnormalReason.NO_ASSIGNEE };
  }

  if (card.part === null) {
    return { abnormal: true, reason: CardAbnormalReason.NO_PART };
  }

  return { abnormal: false };
};
