import express from 'express';
import { createKanbanService } from './infrastructures/createKanbanService';
import { createKanbanRepository } from './infrastructures/createKanbanRepository';
import { createNotioKanbanClient } from './infrastructures/createNotionKanbanClient';
import dotenv from 'dotenv';

dotenv.config({ path: './.env.local' });

const NOTION_KANBAN_DATABASE_ID = process.env.NOTION_KANBAN_DATABASE_ID;
const NOTION_TOKEN = process.env.NOTION_TOKEN;

if (!NOTION_KANBAN_DATABASE_ID) throw new Error();
if (!NOTION_TOKEN) throw new Error();

const app = express();
const port = 3000;

const kanbanService = createKanbanService({
  repositories: [
    createKanbanRepository({
      clients: [createNotioKanbanClient({ databaseId: NOTION_KANBAN_DATABASE_ID, notionToken: NOTION_TOKEN })],
    }),
  ],
});

app.use('/health-check', (req, res) => res.sendStatus(200));

app.use('/check-kanban', async (req, res) => {
  await kanbanService.sendAbnormalCardStatuses();
  res.sendStatus(200);
});

app.listen(port, () => `Server is running on port ${port}`);
