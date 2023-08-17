import dotenv from 'dotenv';

import { createKanbanRepository } from './infrastructures/createKanbanRepository';
import { createKanbanService } from './infrastructures/createKanbanService';
import { createNotionKanbanClient } from './infrastructures/createNotionKanbanClient';
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

const kanbanService = createKanbanService({
  repositories: [
    createKanbanRepository({
      clients: [createNotionKanbanClient({ databaseId: NOTION_KANBAN_DATABASE_ID, notionToken: NOTION_TOKEN })],
    }),
  ],
  clients: [createSlackMessengerClient({ slackToken: SLACK_TOKEN, slackChannel: SLACK_CHANNEL })],
});

kanbanService.sendAbnormalCardStatuses();
