import { getContext } from 'svelte';

import type { ConfigService } from '../../services/ConfigService';
import type { PushNotificationService } from '../../services/PushNotificationService';

const key = 'service';
type ServiceContext = {
  configService: ConfigService;
  pushNotificationService: PushNotificationService;
};
export const serviceContextSetter = (context: ServiceContext) => [key, context] as const;
export const getServiceContext = () => getContext(key) as ServiceContext;
