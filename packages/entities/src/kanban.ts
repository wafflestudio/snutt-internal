import { Member, Part } from './member';

export type Card = {
  id: string;
  part: Part | null;
  url: string;
  assignee: Member[];
  status: 'Backlog' | 'To Do' | 'In Progress' | 'In Review' | 'Archived' | 'Done' | 'Released';
  title: string;
  schedule: [Date, Date] | null;
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
