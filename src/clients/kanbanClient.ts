import { Card } from '../entities/kanban';

export type KanbanClient = {
  listCards: () => Promise<Card[]>;
};
