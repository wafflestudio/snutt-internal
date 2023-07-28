import { MessengerClient } from '../clients/messengerClient';
import { KanbanRepository } from '../repositories/kanbanRepository';
import { KanbanService } from '../services/kanbanService';

export const createKanbanService = ({
  repositories: [kanbanRepository],
  clients: [messengerClient],
}: {
  repositories: [KanbanRepository];
  clients: [MessengerClient];
}): KanbanService => {
  return {
    sendAbnormalCardStatuses: async () => {
      const cards = await kanbanRepository.listCards();
      console.log(cards);
      await messengerClient.sendThread('hello', ['hi', 'bye']);
    },
  };
};
