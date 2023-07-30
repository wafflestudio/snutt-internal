import { MessengerClient } from '../clients/messengerClient';
import { Card } from '../entities/kanban';
import { Member } from '../entities/member';
import { KanbanRepository } from '../repositories/kanbanRepository';
import { KanbanService } from '../services/kanbanService';

enum KanbanAbnormalReason {
  DUE_DATE_PASSED = 'DUE_DATE_PASSED',
}

export const createKanbanService = ({
  repositories: [kanbanRepository],
  clients: [messengerClient],
}: {
  repositories: [KanbanRepository];
  clients: [MessengerClient];
}): KanbanService => {
  const checkKanbanAbnormal = (card: Card): { abnormal: false } | { abnormal: true; reason: KanbanAbnormalReason } => {
    if (card.status !== 'Done' && card.status !== 'Archived' && card.status !== 'Completed' && card.due !== null) {
      const today = new Date().getTime();
      const dueDate = Array.isArray(card.due) ? card.due[1].getTime() : card.due.getTime();
      if (today > dueDate) return { abnormal: true, reason: KanbanAbnormalReason.DUE_DATE_PASSED };
    }

    return { abnormal: false };
  };

  return {
    sendAbnormalCardStatuses: async () => {
      const cards = await kanbanRepository.listCards();
      const abnormalCards = cards.reduce<(Card & { reason: KanbanAbnormalReason })[]>((acc, card) => {
        const result = checkKanbanAbnormal(card);
        if (!result.abnormal) return acc;
        return [...acc, { ...card, reason: result.reason }];
      }, []);

      await messengerClient.sendThread(
        '칸반 이슈',
        abnormalCards.map((card) => {
          const assignees = card.assignee.map((a) => `<@${MEMBER_SLACK_ID_MAP[a]}>`).join(' ');
          const title = `<${card.url}|${card.title}>`;
          const reason = REASON_MESSAGE_MAP[card.reason];
          return `${assignees} ${title}\n\n${reason}`;
        }),
      );
    },
  };
};

const REASON_MESSAGE_MAP: Record<KanbanAbnormalReason, string> = {
  [KanbanAbnormalReason.DUE_DATE_PASSED]: '설정된 due date 가 지났습니다. due를 변경하거나 상태를 업데이트해 주세요.',
};

// TODO: 적절한 곳으로 옮기기. 근데 템플릿이 여깄어서 되려나..
const MEMBER_SLACK_ID_MAP: Record<Member, string> = {
  [Member.WOOHM402]: 'U01JQM3GNBW',
  [Member.SHP7724]: 'U030UCYBZC3',
  [Member.JUTAK97]: 'U030UCYA7U3',
  [Member.DAVIN111]: 'ULHAW7P7Z',
  [Member.HANK_CHOI]: 'URJJGG33J',
  [Member.ARS_KI_00]: 'URW5RHG1L',
  [Member.JHVICTOR4]: 'US9MACQUV',
  [Member.EASTSHINE2741]: 'U04EC1QEP6V',
  [Member.PENG_U_0807]: 'U03171C4MFT',
  [Member.CHAEMIN2001]: 'U030WM38PM2',
  [Member.EUXXNIA]: 'U04F0NCC9L4',
};
