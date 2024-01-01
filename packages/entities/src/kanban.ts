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
