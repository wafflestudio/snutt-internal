import { KanbanRepository, MessengerPresenter } from '@sf/adapters';
import { Part } from '@sf/entities';

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
        ({ formatLink, formatEmoji, formatBold }) =>
          [
            `${formatBold('SNUTT 무슨 일이 일어나고 있나요?')} ${formatEmoji('wip')}`,
            '',
            ...cards.map(
              (c) =>
                `${formatEmoji(
                  c.part
                    ? (
                        {
                          [Part.ALL]: 'snutt',
                          [Part.ANDROID]: 'android',
                          [Part.DESIGN]: 'design',
                          [Part.FRONTEND]: 'react',
                          [Part.IOS]: 'ios',
                          [Part.SERVER]: 'spring',
                        } as const
                      )[c.part]
                    : ('null' as const),
                )} ${formatLink(c.title, { url: c.url })}`,
            ),
          ].join('\n'),
        [],
      );
    },
  };
};
