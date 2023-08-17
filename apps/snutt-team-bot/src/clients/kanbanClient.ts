import { Card } from '../entities/kanban';

export type KanbanClient = {
  listCards: (args: { status?: Record<Card['status'], boolean> }) => Promise<Card[]>;
};
