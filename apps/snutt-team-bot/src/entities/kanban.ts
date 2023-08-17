import { Group, Member } from './member';

export type Card = {
  id: string;
  group: Group | null;
  url: string;
  assignee: Member[];
  status: 'Backlog' | 'To Do' | 'In Progress' | 'In Review' | 'Archived' | 'Done' | 'Released';
  title: string;
  schedule: [Date | null, Date] | null;
};
