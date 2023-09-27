import { MessengerClient } from '../clients/messengerClient';
import { Card } from '../entities/kanban';
import { Part } from '../entities/member';
import { KanbanRepository } from '../repositories/kanbanRepository';
import { KanbanService } from '../services/kanbanService';

enum KanbanAbnormalReason {
  DUE_DATE_PASSED = 'DUE_DATE_PASSED',
  NO_ASSIGNEE = 'NO_ASSIGNEE',
  NO_SCHEDULE = 'NO_SCHEDULE',
}

export const createKanbanService = ({
  repositories: [kanbanRepository],
  clients: [messengerClient],
}: {
  repositories: [KanbanRepository];
  clients: [MessengerClient];
}): KanbanService => {
  return {
    sendAbnormalCardStatuses: async () => {
      const cards = await kanbanRepository.listCards({
        status: {
          'To Do': true,
          'In Progress': true,
          'In Review': true,
          Archived: false,
          Backlog: true,
          Released: false,
          Done: false,
        },
      });
      const abnormalCards = cards.reduce<(Card & { reason: KanbanAbnormalReason })[]>((acc, card) => {
        const result = checkKanbanAbnormal(card);

        if (result.abnormal) return [...acc, { ...card, reason: result.reason }];

        return acc;
      }, []);

      await messengerClient.sendThread(
        () => '칸반 이슈',
        abnormalCards.map((card) => ({ formatMemberMention, formatPartMention, formatLink }) => {
          const mention =
            card.assignee.length === 0
              ? formatPartMention(card.part ?? Part.ALL)
              : card.assignee.map(formatMemberMention).join(' ');
          const title = formatLink(card.title, { url: card.url });
          const reason = REASON_MESSAGE_MAP[card.reason];
          return `${mention} ${title}\n\n${reason}`;
        }),
      );
    },
  };
};

const REASON_MESSAGE_MAP: Record<KanbanAbnormalReason, string> = {
  [KanbanAbnormalReason.DUE_DATE_PASSED]: '설정된 schedule이 지났습니다. 일정을 변경하거나 상태를 업데이트해 주세요.',
  [KanbanAbnormalReason.NO_ASSIGNEE]: '담당자가 없습니다. 담당자를 지정해 주세요.',
  [KanbanAbnormalReason.NO_SCHEDULE]: 'schedule이 없습니다. 일정을 설정하거나 상태를 Backlog로 변경해 주세요.',
};

const checkKanbanAbnormal = (card: Card): { abnormal: false } | { abnormal: true; reason: KanbanAbnormalReason } => {
  if (
    (card.status === 'To Do' || card.status === 'In Progress' || card.status === 'In Review') &&
    card.schedule === null
  ) {
    return { abnormal: true, reason: KanbanAbnormalReason.NO_SCHEDULE };
  }

  if (card.status !== 'Done' && card.status !== 'Archived' && card.status !== 'Released' && card.schedule !== null) {
    const today = new Date().getTime();
    const dueDate = card.schedule[1].getTime();
    if (today > dueDate) return { abnormal: true, reason: KanbanAbnormalReason.DUE_DATE_PASSED };
  }

  if (card.status !== 'Done' && card.status !== 'Archived' && card.status !== 'Released' && card.status !== 'Backlog') {
    if (card.assignee.length === 0) return { abnormal: true, reason: KanbanAbnormalReason.NO_ASSIGNEE };
  }

  return { abnormal: false };
};
