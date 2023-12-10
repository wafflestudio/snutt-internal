import { Card } from '@sf/entities';

export type KanbanRepository = {
  listCards: (args: { status?: Record<Card['status'], boolean> }) => Promise<Card[]>;
};
