import { Client } from '@notionhq/client';
import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';

import { Card, Epic } from '../entities/kanban';
import { Member, Part } from '../entities/member';
import { createKanbanService } from './../services/kanbanService';

export const createNotionKanbanRepository = ({
  epicDatabaseId,
  kanbanDatabaseId,
  notionBotToken,
}: {
  epicDatabaseId: string;
  kanbanDatabaseId: string;
  notionBotToken: string;
}): Parameters<typeof createKanbanService>[0]['kanbanRepository'] => {
  const notionClient = new Client({ auth: notionBotToken });

  const listEpics = async ({ cursor }: { cursor?: string }): Promise<QueryDatabaseResponse['results']> => {
    const { results, has_more, next_cursor } = await notionClient.databases.query({
      database_id: epicDatabaseId,
      start_cursor: cursor,
    });

    const allResults = await (async () => {
      if (!has_more) return results;
      if (!next_cursor) throw new Error();
      return [...results, ...(await listEpics({ cursor: next_cursor }))];
    })();

    return allResults;
  };

  const listCards = async ({ cursor }: { cursor?: string }): Promise<QueryDatabaseResponse['results']> => {
    const { results, has_more, next_cursor } = await notionClient.databases.query({
      database_id: kanbanDatabaseId,
      start_cursor: cursor,
    });

    const allResults = await (async () => {
      if (!has_more) return results;
      if (!next_cursor) throw new Error();
      return [...results, ...(await listCards({ cursor: next_cursor }))];
    })();

    return allResults;
  };

  const getDisplay = ({ id, name }: { id: string; name: string }): string => `${name} (${id})`;

  return {
    listEpics: async () => {
      const notionEpics = (await listEpics({})) as unknown as NotionEpic[];

      return notionEpics.map((e) => {
        const managerItem = e.properties.PM.people[0];
        if (!managerItem) throw new Error('PM이 없는 에픽 ' + e.url);
        const manager = MEMBER_NOTION_ID_MAP[managerItem.id];
        const title = e.properties.Title.title.map((t) => t.plain_text).join('');

        return {
          id: e.id,
          title,
          manager: manager
            ? { type: 'member', member: manager }
            : { type: 'anonymous', display: getDisplay(managerItem) },
          status: e.properties.Status.status.name,
          url: e.url,
        };
      });
    },

    listCards: async () => {
      const notionCards = (await listCards({})) as unknown as NotionCard[];

      return notionCards.map((c) => ({
        id: c.id,
        url: c.url,
        assignee: c.properties.Assignee.people.map((p) => {
          const member = MEMBER_NOTION_ID_MAP[p.id];
          return member ? { type: 'member', member } : { type: 'anonymous', display: getDisplay(p) };
        }),
        status: c.properties.Status.status.name,
        title: c.properties.Name.title.map((t) => t.plain_text).join(''),
        schedule: (() => {
          const toEndDate = (date: Date) => {
            if (date.getUTCHours() === 0 && date.getMinutes() === 0)
              return new Date(date.getTime() + 24 * 60 * 60 * 1000 - 1); // 시간을 지정하지 않았다면 당일 23시 59분 59초로 설정
            return date;
          };

          if (c.properties.Schedule.date === null) return null;

          return [
            new Date(c.properties.Schedule.date.start),
            toEndDate(new Date(c.properties.Schedule.date.end ?? c.properties.Schedule.date.start)),
          ] as const;
        })(),
        part: c.properties.Group.select ? PART_NOTION_ID_MAP[c.properties.Group.select.name] : null,
        epic: c.properties.Epic.relation[0]?.id ?? null,
      }));
    },
  };
};

type NotionCard = {
  id: string;
  url: string;
  properties: {
    Status: { status: { name: Card['status'] } };
    Schedule: { date: { start: string; end: string | null } | null };
    Assignee: { people: { id: string; name: string }[] };
    Name: { title: { plain_text: string }[] };
    Group: { select: { name: 'iOS' | 'Android' | 'Server' | 'Frontend' | 'Design' | 'All' } | null };
    Epic: { id: string; type: 'relation'; relation: { id: string }[] };
  };
};

type NotionEpic = {
  id: string;
  url: string;
  properties: {
    Title: { title: { plain_text: string }[] };
    PM: { people: { id: string; name: string }[] };
    Status: { status: { name: Epic['status'] } };
  };
};

const MEMBER_NOTION_ID_MAP: Record<string, Member | undefined> = {
  '12233745-30b8-49ac-84aa-d324f7041c23': Member.SHP7724,
  '2a3b479e-13cb-40a7-9aaf-4be38111e97a': Member.JUTAK97,
  '5d1120a3-0a70-4a30-8845-ec17f697f34f': Member.DAVIN111,
  'e11c16b0-537b-4c61-a53a-e707aa481896': Member.HANK_CHOI,
  '4b9f3337-bf6e-4385-bcf2-633b6c0a12b4': Member.ARS_KI_00,
  '8d57adea-038f-436a-a098-cd53ba5781ae': Member.JHVICTOR4,
  '84254454-3dc7-44e1-808f-7fe2b363a217': Member.EASTSHINE2741,
  'a8186318-c9d9-42d7-9b2b-303f15ab8367': Member.PENG_U_0807,
  '5f018d07-d2d8-4845-b4f1-e7dbdb49015e': Member.CHAEMIN2001,
  'e3c4232e-41ce-4189-90f4-121c7cda69f8': Member.EUXXNIA,
  '9c79e047-4de9-4089-8787-8349e049f960': Member.SUBEENPARK_IO,
  'e014290e-7acf-43e2-a45f-aebdde53d116': Member.ASP345,
  'c33db05a-a8b4-4dff-905e-37e96ae9b2a1': Member.YUJINMIN514,
  'b5d64ee2-1da8-4eb5-a359-e96da5c99a32': Member.PLGAFHD,
  '55b2d2f9-6cb0-4cba-a9db-4417fadc095a': Member.SEONGHAEJO,
};

const PART_NOTION_ID_MAP = {
  iOS: Part.IOS,
  Android: Part.ANDROID,
  Server: Part.SERVER,
  Frontend: Part.FRONTEND,
  Design: Part.DESIGN,
  All: Part.ALL,
};
