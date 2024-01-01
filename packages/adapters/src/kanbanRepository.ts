import { Card } from '@sf/entities';

export type KanbanRepository = {
  listCards: () => Promise<Card[]>;
};
