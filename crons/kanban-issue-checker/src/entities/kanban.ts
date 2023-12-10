import { Member, Part } from './member';

export type Card = {
  id: string;
  part: Part | null;
  url: string;
  assignee: Member[];
  status: 'Backlog' | 'To Do' | 'In Progress' | 'In Review' | 'Archived' | 'Done' | 'Released';
  title: string;
  schedule: [Date | null, Date] | null;
};

export enum CardAbnormalReason {
  DUE_DATE_PASSED = 'DUE_DATE_PASSED',
  NO_ASSIGNEE = 'NO_ASSIGNEE',
  NO_SCHEDULE = 'NO_SCHEDULE',
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

  return { abnormal: false };
};
