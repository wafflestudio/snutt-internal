import { implSnuttBackend } from '@si/snutt-backend';

import App from './app/App.svelte';
import { environmentContextSetter } from './app/contexts/EnvironmentContext';
import { serviceContextSetter } from './app/contexts/ServiceContext';
import { createAdminPopupSiSnuttBackendRepository } from './infrastructures/createAdminPopupSiSnuttBackendRepository';
import { createAuthSiSnuttBackendRepository } from './infrastructures/createAuthSiSnuttBackendRepository';
import { createConfigSiSnuttBackendRepository } from './infrastructures/createConfigSiSnuttBackendRepository';
import { createHtmlDocumentThemeRepository } from './infrastructures/createHtmlDocumentThemeRepository';
import { createImportMetaEnvironmentRepository } from './infrastructures/createImportMetaEnvironmentRepository';
import { createLocalStorageRepository } from './infrastructures/createLocalStorageRepository';
import { createPopupImageFetchRepository } from './infrastructures/createPopupImageFetchRepository';
import { createPushNotificationSiSnuttBackendRepository } from './infrastructures/createPushNotificationSiSnuttBackendRepository';
import { createUserPopupSiSnuttBackendRepository } from './infrastructures/createUserPopupSiSnuttBackendRepository';
import { createAuthService } from './services/AuthService';
import { createConfigService } from './services/ConfigService';
import { createPopupService } from './services/PopupService';
import { createPushNotificationService } from './services/PushNotificationService';
import { createScreenService } from './services/ScreenService';
import { createDiaryService } from './services/DiaryService';
import { createDiaryRepository } from './infrastructures/createDiaryRepository';

const apiKey = import.meta.env.VITE_API_KEY;
const environmentRepository = createImportMetaEnvironmentRepository();
const mode = environmentRepository.getAppEnv();

if (!apiKey || typeof apiKey !== 'string') throw new Error('VITE_API_KEY is not set');

const baseUrl = {
  localDev: '/api',
  dev: 'https://snutt-api-dev.wafflestudio.com',
  prod: 'https://snutt-api.wafflestudio.com',
}[mode];

const snuttBackend = implSnuttBackend({ baseUrl, apiKey });

const authRepository = createAuthSiSnuttBackendRepository({ snuttBackend });
const configService = createConfigService({
  configRepository: createConfigSiSnuttBackendRepository({ snuttBackend }),
});

const pushNotificationService = createPushNotificationService({
  pushNotificationRepository: createPushNotificationSiSnuttBackendRepository({ snuttBackend }),
  authRepository,
});

const persistStorageRepository = createLocalStorageRepository();

const authService = createAuthService({ authRepository, persistStorageRepository, environmentRepository });
const screenService = createScreenService({
  themeRepository: createHtmlDocumentThemeRepository(),
  persistStorageRepository,
});

const popupService = createPopupService({
  userPopupRepository: createUserPopupSiSnuttBackendRepository({ snuttBackend }),
  adminPopupRepository: createAdminPopupSiSnuttBackendRepository({ snuttBackend }),
  popupImageRepository: createPopupImageFetchRepository(),
});

const diaryService = createDiaryService({
  diaryRepository: createDiaryRepository({ snuttBackend }),
});

document.documentElement.style.setProperty('transition', 'none');
screenService.setCurrentTheme(screenService.getInitialTheme());
setTimeout(() => {
  document.documentElement.style.setProperty('transition', null);
}, 200);

const app = new App({
  target: document.getElementById('app') as HTMLElement,
  context: new Map()
    .set(
      ...serviceContextSetter({
        configService,
        pushNotificationService,
        authService,
        screenService,
        popupService,
        diaryService,
      }),
    )
    .set(...environmentContextSetter({ APP_ENV: mode })),
});

export default app;
