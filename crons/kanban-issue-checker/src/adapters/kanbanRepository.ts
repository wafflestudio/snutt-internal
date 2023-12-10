import { Card } from '../entities/kanban';

export type KanbanRepository = {
  listCards: (args: { status?: Record<Card['status'], boolean> }) => Promise<Card[]>;
};
