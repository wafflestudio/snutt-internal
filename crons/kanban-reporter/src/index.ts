import { createNotionKanbanRepository, createSlackMessengerPresenter } from '@sf/infrastructures';
import dotenv from 'dotenv';

import { createKanbanService } from './infrastructures/createKanbanService';

dotenv.config({ path: './.env.local' }); // for local development

const mode = process.argv[2];

if (!mode || (mode !== 'issue' && mode !== 'dashboard' && mode !== 'weekly-summary')) throw new Error();

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
    notionKanbanBotToken: NOTION_KANBANBOT_TOKEN,
  }),
  messengerPresenter: createSlackMessengerPresenter({
    slackChannel: SLACK_CHANNEL,
    slackBotToken: SLACK_TTUNS_TOKEN,
  }),
});

switch (mode) {
  case 'issue':
    kanbanService.sendAbnormalCardStatuses();
    break;
  case 'dashboard':
    kanbanService.sendDashboard();
    break;
  case 'weekly-summary':
    kanbanService.sendWeeklySummary();
    break;
}
