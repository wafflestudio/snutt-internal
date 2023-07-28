import { Card } from '../entities/kanban';

export type KanbanRepository = {
  listCards: () => Promise<Card[]>;
};
