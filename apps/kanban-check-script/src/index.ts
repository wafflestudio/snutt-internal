import { Client } from '@notionhq/client';
import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';

import { createKanbanService } from './infrastructures/createKanbanService';
import { createNotionKanbanRepository } from './infrastructures/createNotionKanbanRepository';
import { createSlackMessengerPresenter } from './infrastructures/createSlackMessengerPresenter';

dotenv.config({ path: './.env.local' }); // for local development

const NOTION_KANBAN_DATABASE_ID = process.env.NOTION_KANBAN_DATABASE_ID;
const NOTION_KANBANBOT_TOKEN = process.env.NOTION_KANBANBOT_TOKEN;
const SLACK_TTUNS_TOKEN = process.env.SLACK_TTUNS_TOKEN;
const SLACK_CHANNEL = process.env.SLACK_CHANNEL;

if (!NOTION_KANBAN_DATABASE_ID) throw new Error();
if (!NOTION_KANBANBOT_TOKEN) throw new Error();
if (!SLACK_TTUNS_TOKEN) throw new Error();
if (!SLACK_CHANNEL) throw new Error();

const kanbanService = createKanbanService({
  kanbanRepository: createNotionKanbanRepository({
    databaseId: NOTION_KANBAN_DATABASE_ID,
    notionClient: new Client({ auth: NOTION_KANBANBOT_TOKEN }),
  }),
  messengerPresenter: createSlackMessengerPresenter({
    slackChannel: SLACK_CHANNEL,
    slackClient: new WebClient(SLACK_TTUNS_TOKEN),
  }),
});

kanbanService.sendAbnormalCardStatuses();
