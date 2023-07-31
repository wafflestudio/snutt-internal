import { KanbanClient } from '../clients/kanbanClient';
import { KanbanRepository } from '../repositories/kanbanRepository';

export const createKanbanRepository = ({ clients: [kanbanClient] }: { clients: [KanbanClient] }): KanbanRepository => {
  return {
    listCards: async (args) => {
      const cards = await kanbanClient.listCards(args);
      return cards;
    },
  };
};
