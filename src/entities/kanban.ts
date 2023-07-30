import { Member } from './member';

export type Card = {
  id: string;
  url: string;
  assignee: Member[];
  status: 'Backlog' | 'To Do' | 'In Progress' | 'In Review' | 'Archived' | 'Done' | 'Completed';
  title: string;
  due: Date | [Date, Date] | null;
};
