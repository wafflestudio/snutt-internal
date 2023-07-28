import { KanbanClient } from '../clients/kanbanClient';
import { Client } from '@notionhq/client';
import { Card } from '../entities/kanban';

export const createNotioKanbanClient = ({
  notionToken,
  databaseId,
}: {
  notionToken: string;
  databaseId: string;
}): KanbanClient => {
  const notion = new Client({ auth: notionToken });

  return {
    listCards: async () => {
      const cards = await notion.databases.query({ database_id: databaseId });
      return cards.results as unknown as Card[];
    },
  };
};
