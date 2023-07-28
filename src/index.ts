import express from 'express';
import { createKanbanService } from './infrastructures/createKanbanService';
import { createKanbanRepository } from './infrastructures/createKanbanRepository';
import { createNotioKanbanClient } from './infrastructures/createNotionKanbanClient';
import dotenv from 'dotenv';
import { createSlackMessengerClient } from './infrastructures/createSlackMessengerClient';

dotenv.config({ path: './.env.local' });

const NOTION_KANBAN_DATABASE_ID = process.env.NOTION_KANBAN_DATABASE_ID;
const NOTION_TOKEN = process.env.NOTION_TOKEN;
const SLACK_TOKEN = process.env.SLACK_TOKEN;
const SLACK_CHANNEL = process.env.SLACK_CHANNEL;

if (!NOTION_KANBAN_DATABASE_ID) throw new Error();
if (!NOTION_TOKEN) throw new Error();
if (!SLACK_TOKEN) throw new Error();
if (!SLACK_CHANNEL) throw new Error();

const app = express();
const port = 3000;

const kanbanService = createKanbanService({
  repositories: [
    createKanbanRepository({
      clients: [createNotioKanbanClient({ databaseId: NOTION_KANBAN_DATABASE_ID, notionToken: NOTION_TOKEN })],
    }),
  ],
  clients: [createSlackMessengerClient({ slackToken: SLACK_TOKEN, slackChannel: SLACK_CHANNEL })],
});

app.use('/health-check', (req, res) => res.sendStatus(200));

app.use('/check-kanban', async (req, res) => {
  await kanbanService.sendAbnormalCardStatuses();
  res.sendStatus(200);
});

app.listen(port, () => `Server is running on port ${port}`);
