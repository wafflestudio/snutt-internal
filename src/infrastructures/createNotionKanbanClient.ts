import { KanbanClient } from '../clients/kanbanClient';
import { Client } from '@notionhq/client';
import { Card } from '../entities/kanban';
import { Group, Member } from '../entities/member';

export const createNotionKanbanClient = ({
  notionToken,
  databaseId,
}: {
  notionToken: string;
  databaseId: string;
}): KanbanClient => {
  const notion = new Client({ auth: notionToken });

  return {
    listCards: async ({ status }) => {
      const { results } = (await notion.databases.query({
        database_id: databaseId,
        filter: {
          or: Object.entries(status ?? {})
            .filter(([status, selected]) => selected)
            .map(([status]) => ({ property: 'Status', status: { equals: status } })),
        },
      })) as unknown as {
        results: {
          id: string;
          url: string;
          properties: {
            Status: { status: { name: Card['status'] } };
            'Due Date': { date: { start: string; end: string | null } | null };
            Assignee: { people: { id: string; name: string }[] };
            Name: { title: { plain_text: string }[] };
            Group: { select: { name: 'iOS' | 'Android' | 'Server' | 'Frontend' | 'Design' } | null };
          };
        }[];
      };

      return results.map((c) => ({
        id: c.id,
        url: c.url,
        assignee: c.properties.Assignee.people.map((p) => MEMBER_NOTION_ID_MAP[p.id]).filter((m): m is Member => !!m),
        status: c.properties.Status.status.name,
        title: c.properties.Name.title.map((t) => t.plain_text).join(''),
        due: (() => {
          const toEndDate = (date: Date) => {
            if (date.getUTCHours() === 0 && date.getMinutes() === 0)
              return new Date(date.getTime() + 24 * 60 * 60 * 1000 - 1); // 시간을 지정하지 않았다면 당일 23시 59분 59초로 설정
            return date;
          };

          if (c.properties['Due Date'].date === null) return null;

          if (c.properties['Due Date'].date.end === null)
            return toEndDate(new Date(c.properties['Due Date'].date.start));

          return [
            new Date(c.properties['Due Date'].date.start),
            toEndDate(new Date(c.properties['Due Date'].date.end)),
          ];
        })(),
        group: c.properties.Group.select ? GROUP_NOTION_ID_MAP[c.properties.Group.select.name] : null,
      }));
    },
  };
};

const MEMBER_NOTION_ID_MAP: Record<string, Member | undefined> = {
  'a60a2b22-e58c-4cf8-a100-764f60cac65c': Member.WOOHM402,
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
};

const GROUP_NOTION_ID_MAP = {
  iOS: Group.IOS,
  Android: Group.ANDROID,
  Server: Group.SERVER,
  Frontend: Group.FRONTEND,
  Design: Group.DESIGN,
};
