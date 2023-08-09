import { MessengerClient } from '../clients/messengerClient';
import { Card } from '../entities/kanban';
import { Group, Member } from '../entities/member';
import { KanbanRepository } from '../repositories/kanbanRepository';
import { KanbanService } from '../services/kanbanService';

enum KanbanAbnormalReason {
  DUE_DATE_PASSED = 'DUE_DATE_PASSED',
  NO_ASSIGNEE = 'NO_ASSIGNEE',
  NO_DUE_DATE = 'NO_DUE_DATE',
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
        '칸반 이슈',
        abnormalCards.map((card) => {
          const mention =
            card.assignee.length === 0
              ? `<!subteam^${card.group !== null ? GROUP_SLACK_ID_MAP[card.group] : GROUP_SLACK_ID_MAP['ALL']}>`
              : card.assignee.map((a) => `<@${MEMBER_SLACK_ID_MAP[a]}>`).join(' ');
          const title = `<${card.url}|${card.title}>`;
          const reason = REASON_MESSAGE_MAP[card.reason];
          return `${mention} ${title}\n\n${reason}`;
        }),
      );
    },
  };
};

const REASON_MESSAGE_MAP: Record<KanbanAbnormalReason, string> = {
  [KanbanAbnormalReason.DUE_DATE_PASSED]: '설정된 due date 가 지났습니다. due를 변경하거나 상태를 업데이트해 주세요.',
  [KanbanAbnormalReason.NO_ASSIGNEE]: '담당자가 없습니다. 담당자를 지정해 주세요.',
  [KanbanAbnormalReason.NO_DUE_DATE]: 'due date 가 없습니다. due를 설정하거나 상태를 Backlog로 변경해 주세요.',
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

const GROUP_SLACK_ID_MAP: Record<Group, string> = {
  [Group.ALL]: 'S032EFLT1FT',
  [Group.FRONTEND]: 'S0435V69VCG',
  [Group.ANDROID]: 'S0496KFE3RP',
  [Group.IOS]: 'S048U19HQTU',
  [Group.SERVER]: 'S048TT15J9H',
  [Group.DESIGN]: 'S04URBVFHJN',
};

const checkKanbanAbnormal = (card: Card): { abnormal: false } | { abnormal: true; reason: KanbanAbnormalReason } => {
  if ((card.status === 'To Do' || card.status === 'In Progress' || card.status === 'In Review') && card.due === null) {
    return { abnormal: true, reason: KanbanAbnormalReason.NO_DUE_DATE };
  }

  if (card.status !== 'Done' && card.status !== 'Archived' && card.status !== 'Released' && card.due !== null) {
    const today = new Date().getTime();
    const dueDate = Array.isArray(card.due) ? card.due[1].getTime() : card.due.getTime();
    if (today > dueDate) return { abnormal: true, reason: KanbanAbnormalReason.DUE_DATE_PASSED };
  }

  if (card.status !== 'Done' && card.status !== 'Archived' && card.status !== 'Released' && card.status !== 'Backlog') {
    if (card.assignee.length === 0) return { abnormal: true, reason: KanbanAbnormalReason.NO_ASSIGNEE };
  }

  return { abnormal: false };
};
