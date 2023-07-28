import { KanbanRepository } from '../repositories/kanbanRepository';
import { KanbanService } from '../services/kanbanService';

export const createKanbanService = ({
  repositories: [kanbanRepository],
}: {
  repositories: [KanbanRepository];
}): KanbanService => {
  return {
    sendAbnormalCardStatuses: async () => {
      const cards = await kanbanRepository.listCards();
      console.log(cards);
    },
  };
};
