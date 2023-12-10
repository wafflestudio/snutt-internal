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
          'To Do': false,
          'In Progress': true,
          'In Review': false,
          Archived: false,
          Backlog: false,
          Released: false,
          Done: false,
        },
      });

      await messengerPresenter.sendThread(
        ({ formatLink }) =>
          ['진행 중인 SNUTT 태스크', '', ...cards.map((c) => `- ${formatLink(c.title, { url: c.url })}`)].join('\n'),
        [],
      );
    },
  };
};
