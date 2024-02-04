import { Card } from '@sf/entities';

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
