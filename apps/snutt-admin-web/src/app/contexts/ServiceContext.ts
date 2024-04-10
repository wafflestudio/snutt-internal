import { getContext } from 'svelte';

import type { AuthService } from '../../services/AuthService';
import type { ConfigService } from '../../services/ConfigService';
import type { PopupService } from '../../services/PopupService';
import type { PushNotificationService } from '../../services/PushNotificationService';
import type { ScreenService } from '../../services/ScreenService';

const key = 'service';
type ServiceContext = {
  authService: AuthService;
  configService: ConfigService;
  pushNotificationService: PushNotificationService;
  screenService: ScreenService;
  popupService: PopupService;
};
export const serviceContextSetter = (context: ServiceContext) => [key, context] as const;
export const getServiceContext = () => getContext(key) as ServiceContext;
