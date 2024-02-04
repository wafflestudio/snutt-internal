import { createSlackMessengerPresenter } from '@sf/infrastructures';
import dotenv from 'dotenv';

import { implementGithubReleaseNoteRepository } from './infrastructures/implementGithubReleaseNoteRepository';
import { implementNotifyService } from './infrastructures/implementNotifyService';

dotenv.config({ path: './.env.local' }); // for local development

const title = process.argv[2];
const repository = process.argv[3];
const tag = process.argv[4];

const SLACK_TTUNS_TOKEN = process.env.SLACK_TTUNS_TOKEN;
const SLACK_CHANNEL = process.env.SLACK_CHANNEL;
const GHP_AUTH_TOKEN = process.env.GHP_AUTH_TOKEN;

if (!SLACK_TTUNS_TOKEN) throw new Error();
if (!SLACK_CHANNEL) throw new Error();
if (!GHP_AUTH_TOKEN) throw new Error();
if (!title) throw new Error();
if (!repository) throw new Error();
if (!tag) throw new Error();

const notifyService = implementNotifyService({
  title,
  releaseNoteRepository: implementGithubReleaseNoteRepository({
    repository,
    tag,
    githubAuthToken: GHP_AUTH_TOKEN,
  }),
  messengerPresenter: createSlackMessengerPresenter({ slackBotToken: SLACK_TTUNS_TOKEN, slackChannel: SLACK_CHANNEL }),
});

notifyService.notifyFromReleaseNote();
