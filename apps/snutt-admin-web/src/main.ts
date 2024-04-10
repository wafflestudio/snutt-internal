import App from './app/App.svelte';
import { environmentContextSetter } from './app/contexts/EnvironmentContext';
import { serviceContextSetter } from './app/contexts/ServiceContext';
import { createAdminPopupRepository } from './infrastructures/createAdminPopupRepository';
import { createAuthRepository } from './infrastructures/createAuthRepository';
import { createAuthService } from './infrastructures/createAuthService';
import { createConfigRepository } from './infrastructures/createConfigRepository';
import { createConfigService } from './infrastructures/createConfigService';
import { createFetchClient } from './infrastructures/createFetchClient';
import { createHtmlDocumentThemeRepository } from './infrastructures/createHtmlDocumentThemeRepository';
import { createImportMetaEnvironmentRepository } from './infrastructures/createImportMetaEnvironmentRepository';
import { createLocalStorageRepository } from './infrastructures/createLocalStorageRepository';
import { createPopupImageFetchRepository } from './infrastructures/createPopupImageFetchRepository';
import { createPopupService } from './infrastructures/createPopupService';
import { createPushNotificationRepository } from './infrastructures/createPushNotificationRepository';
import { createPushNotificationService } from './infrastructures/createPushNotificationService';
import { createScreenService } from './infrastructures/createThemeService';
import { createUserPopupRepository } from './infrastructures/createUserPopupRepository';

const apiKey = import.meta.env.VITE_API_KEY;
const environmentRepository = createImportMetaEnvironmentRepository();
const mode = environmentRepository.getAppEnv();

if (!apiKey || typeof apiKey !== 'string') throw new Error('VITE_API_KEY is not set');

const baseUrl = {
  localDev: '/api',
  dev: 'https://snutt-api-dev.wafflestudio.com',
  prod: 'https://snutt-api.wafflestudio.com',
}[mode];

const apiClient = createFetchClient(baseUrl, apiKey);

const authRepository = createAuthRepository({ apiClient });
const configService = createConfigService({
  repositories: [createConfigRepository({ clients: [apiClient] })],
});

const pushNotificationService = createPushNotificationService({
  pushNotificationRepository: createPushNotificationRepository({ apiClient }),
  authRepository,
});

const persistStorageRepository = createLocalStorageRepository();

const authService = createAuthService({ authRepository, persistStorageRepository, environmentRepository });
const screenService = createScreenService({
  themeRepository: createHtmlDocumentThemeRepository(),
  persistStorageRepository,
});

const popupService = createPopupService({
  userPopupRepository: createUserPopupRepository({ apiClient }),
  adminPopupRepository: createAdminPopupRepository({ apiClient }),
  popupImageRepository: createPopupImageFetchRepository(),
});

document.documentElement.style.setProperty('transition', 'none');
screenService.setCurrentTheme(screenService.getInitialTheme());
setTimeout(() => {
  document.documentElement.style.setProperty('transition', null);
}, 200);

const app = new App({
  target: document.getElementById('app') as HTMLElement,
  context: new Map()
    .set(...serviceContextSetter({ configService, pushNotificationService, authService, screenService, popupService }))
    .set(...environmentContextSetter({ APP_ENV: mode })),
});

export default app;
