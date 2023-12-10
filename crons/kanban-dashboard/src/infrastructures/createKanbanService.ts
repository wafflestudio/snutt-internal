import { KanbanRepository, MessengerPresenter } from '@sf/adapters';

import { KanbanService } from '../services/kanbanService';

export const createKanbanService = ({
  kanbanRepository,
  messengerPresenter,
}: {
  kanbanRepository: KanbanRepository;
  messengerPresenter: MessengerPresenter;
}): KanbanService => {
  return {
    sendDashboard: async () => {
      const cards = await kanbanRepository.listCards({
        status: {
          'To Do': true,
          'In Progress': true,
          'In Review': true,
          Archived: false,
          Backlog: false,
          Released: false,
          Done: true,
        },
      });

      await messengerPresenter.sendThread(() => `카드 ${cards.length}개`, []);
    },
  };
};
