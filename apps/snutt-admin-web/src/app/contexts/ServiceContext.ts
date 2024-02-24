import { getContext } from 'svelte';

import type { AuthService } from '../../services/AuthService';
import type { ConfigService } from '../../services/ConfigService';
import type { PushNotificationService } from '../../services/PushNotificationService';

const key = 'service';
type ServiceContext = {
  authService: AuthService;
  configService: ConfigService;
  pushNotificationService: PushNotificationService;
};
export const serviceContextSetter = (context: ServiceContext) => [key, context] as const;
export const getServiceContext = () => getContext(key) as ServiceContext;
