import { Card, Epic } from '@sf/entities';

export type KanbanRepository = {
  listCards: () => Promise<Card[]>;
  listEpics: () => Promise<Epic[]>;
};
