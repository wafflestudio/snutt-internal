import { createSlackMessengerPresenter } from '@sf/infrastructures';
import dotenv from 'dotenv';

import { implementGithubReleaseNoteRepository } from './infrastructures/implementGithubReleaseNoteRepository';
import { implementNotifyService } from './infrastructures/implementNotifyService';

dotenv.config({ path: './.env.local' }); // for local development

const mode = process.argv[2];
const serviceName = process.argv[3];
const owner = 'wafflestudio';
const repository = process.argv[4];
const tag = process.argv[5];

const SLACK_TTUNS_TOKEN = process.env.SLACK_TTUNS_TOKEN;
const SLACK_CHANNEL = process.env.SLACK_CHANNEL;
const GITHUB_AUTH_TOKEN = process.env.GITHUB_AUTH_TOKEN;

if (!SLACK_TTUNS_TOKEN) throw new Error();
if (!SLACK_CHANNEL) throw new Error();
if (!GITHUB_AUTH_TOKEN) throw new Error();
if (!mode) throw new Error();
if (!serviceName) throw new Error();
if (!owner) throw new Error();
if (!repository) throw new Error();
if (!tag) throw new Error();

const notifyService = implementNotifyService({
  serviceName,
  releaseNoteRepository: implementGithubReleaseNoteRepository({
    owner,
    repository,
    tag,
    githubAuthToken: GITHUB_AUTH_TOKEN,
  }),
  messengerPresenter: createSlackMessengerPresenter({ slackBotToken: SLACK_TTUNS_TOKEN, slackChannel: SLACK_CHANNEL }),
});

switch (mode) {
  case 'github-release':
    notifyService.notifyFromReleaseNote();
    break;
  default:
    throw new Error('Invalid mode');
}
