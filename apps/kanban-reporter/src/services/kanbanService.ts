import { Card, CARD_STATUS_ORDER, CardAbnormalReason, Epic, isCardAbnormal } from '../entities/kanban';
import { Member, Part } from '../entities/member';

type KanbanService = {
  sendDashboard: () => Promise<void>;
  sendAbnormalCardStatuses: () => Promise<void>;
  sendWeeklySummary: () => Promise<void>;
};

type MessageHelpers = {
  formatMemberMention: (member: Member) => string;
  formatPartMention: (part: Part) => string;
  formatLink: (text: string, args: { url: string }) => string;
  formatEmoji: (
    emoji: 'blob0w0' | 'snutt' | 'spring' | 'react' | 'android' | 'ios' | 'design' | 'null' | 'wip' | 'help',
  ) => string;
  formatBold: (text: string) => string;
  formatInlineCode: (text: string) => string;
};

type GenerateMessage = (helpers: MessageHelpers) => string;

export const createKanbanService = ({
  kanbanRepository,
  messengerPresenter,
}: {
  kanbanRepository: {
    listCards: () => Promise<Card[]>;
    listEpics: () => Promise<Epic[]>;
  };
  messengerPresenter: {
    sendThread: (message: GenerateMessage, threadMessages?: GenerateMessage[]) => Promise<unknown>;
  };
}): KanbanService => {
  return {
    sendDashboard: async () => {
      const cards = (await kanbanRepository.listCards()).filter((c) => c.status === 'In Progress');

      await messengerPresenter.sendThread(
        ({ formatLink, formatEmoji, formatBold }) =>
          [
            `${formatBold('SNUTT 무슨 일이 일어나고 있나요?')} ${formatEmoji('wip')}`,
            '',
            ...cards.map(
              (c) =>
                `${formatEmoji(c.part ? PART_EMOJI_MAP[c.part] : ('null' as const))} ${formatLink(c.title, {
                  url: c.url,
                })}`,
            ),
          ].join('\n'),
        [],
      );
    },

    sendAbnormalCardStatuses: async () => {
      try {
        const cards = (await kanbanRepository.listCards()).filter(
          (c) =>
            c.status === 'In Progress' || c.status === 'In Review' || c.status === 'Backlog' || c.status === 'To Do',
        );

        const abnormalCards = cards.flatMap((card) => {
          const result = isCardAbnormal(card);
          if (!result.abnormal) return [];
          return [{ ...card, reason: result.reason }];
        });

        if (abnormalCards.length === 0) return;

        await messengerPresenter.sendThread(
          ({ formatEmoji }) => `${formatEmoji('blob0w0')} 칸반 이슈`,
          abnormalCards.map((card) => ({ formatMemberMention, formatPartMention, formatLink }) => {
            const mention =
              card.assignee.length === 0
                ? formatPartMention(card.part ?? Part.ALL)
                : card.assignee.map((a) => (a.type === 'member' ? formatMemberMention(a.member) : a.display)).join(' ');
            const title = formatLink(card.title, { url: card.url });
            const reason = REASON_MESSAGE_MAP[card.reason];
            return `${mention} ${title}\n\n${reason}`;
          }),
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : '알 수 없는 오류';
        await messengerPresenter.sendThread(() => '칸반 이슈 확인 불가: ' + message);
      }
    },

    sendWeeklySummary: async () => {
      try {
        const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const to = new Date();

        const [epics, cards] = await Promise.all([
          kanbanRepository.listEpics(),
          kanbanRepository.listCards().then((cs) =>
            cs
              .filter((c) => {
                if (c.schedule === null) return false;
                const [start, end] = c.schedule;
                if (end.getTime() < from.getTime()) return false;
                if (start.getTime() > to.getTime()) return false;
                return true;
              })
              .sort((c1, c2) => CARD_STATUS_ORDER[c1.status] - CARD_STATUS_ORDER[c2.status]),
          ),
        ]);

        const formatCard =
          ({ formatEmoji, formatInlineCode, formatLink, formatBold }: MessageHelpers) =>
          (c: Card) =>
            `${formatBold(formatInlineCode(` ${c.status.padStart(11, ' ')} `))} ${formatEmoji(
              c.part ? PART_EMOJI_MAP[c.part] : 'null',
            )} ${formatLink(c.title, { url: c.url })}`;

        const messageEpics = epics
          .map((epic) => ({ epic, cards: cards.filter((c) => c.epic === epic.id) }))
          .filter(({ cards }) => cards.length > 0);

        await messengerPresenter.sendThread(
          ({ formatEmoji }) => `${formatEmoji('help')} 스크럼 도우미: 최근 일주일 태스크 요약`,
          [
            ...messageEpics.map(
              ({ epic, cards }) =>
                (helpers: MessageHelpers) =>
                  `${epic.manager.type === 'member' ? helpers.formatMemberMention(epic.manager.member) : epic.manager.display} ${helpers.formatLink(
                    epic.title,
                    { url: epic.url },
                  )}\n\n${cards.map(formatCard(helpers)).join('\n')}`,
            ),
            (helpers) =>
              `기타\n\n${cards
                .filter((c) => epics.every((e) => e.id !== c.epic))
                .map(formatCard(helpers))
                .join('\n')}`,
          ],
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : '알 수 없는 오류';
        await messengerPresenter.sendThread(() => '스크럼 도우미 실패: ' + message);
      }
    },
  };
};

const REASON_MESSAGE_MAP: Record<CardAbnormalReason, string> = {
  [CardAbnormalReason.DUE_DATE_PASSED]: '설정된 schedule이 지났습니다. 일정을 변경하거나 상태를 업데이트해 주세요.',
  [CardAbnormalReason.NO_ASSIGNEE]: '담당자가 없습니다. 담당자를 지정해 주세요.',
  [CardAbnormalReason.NO_SCHEDULE]: 'schedule이 없습니다. 일정을 설정하거나 상태를 Backlog로 변경해 주세요.',
  [CardAbnormalReason.NO_PART]: 'Group이 없습니다. Group을 지정해 주세요.',
};

const PART_EMOJI_MAP = {
  [Part.ALL]: 'snutt',
  [Part.ANDROID]: 'android',
  [Part.DESIGN]: 'design',
  [Part.FRONTEND]: 'react',
  [Part.IOS]: 'ios',
  [Part.SERVER]: 'spring',
} as const;
