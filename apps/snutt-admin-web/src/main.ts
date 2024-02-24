import App from './app/App.svelte';
import { environmentContextSetter } from './app/contexts/EnvironmentContext';
import { serviceContextSetter } from './app/contexts/ServiceContext';
import { createAuthRepository } from './infrastructures/createAuthRepository';
import { createAuthService } from './infrastructures/createAuthService';
import { createConfigRepository } from './infrastructures/createConfigRepository';
import { createConfigService } from './infrastructures/createConfigService';
import { createFetchClient } from './infrastructures/createFetchClient';
import { createPushNotificationRepository } from './infrastructures/createPushNotificationRepository';
import { createPushNotificationService } from './infrastructures/createPushNotificationService';

const mode = import.meta.env.MODE;
const apiKey = import.meta.env.VITE_API_KEY;

if (!apiKey || typeof apiKey !== 'string') throw new Error('VITE_API_KEY is not set');
if (mode !== 'localDev' && mode !== 'dev' && mode !== 'prod') throw new Error('Invalid mode');

const baseUrl = {
  localDev: '/api',
  dev: 'https://snutt-api-dev.wafflestudio.com',
  prod: 'https://snutt-api.wafflestudio.com',
}[mode];

const apiClient = createFetchClient(baseUrl, apiKey);

const configService = createConfigService({
  repositories: [createConfigRepository({ clients: [apiClient] })],
});

const pushNotificationService = createPushNotificationService({
  pushNotificationRepository: createPushNotificationRepository({ apiClient }),
});

const authService = createAuthService({ authRepository: createAuthRepository({ apiClient }) });

const app = new App({
  target: document.getElementById('app') as HTMLElement,
  context: new Map()
    .set(...serviceContextSetter({ configService, pushNotificationService, authService }))
    .set(...environmentContextSetter({ APP_ENV: mode })),
});

export default app;
