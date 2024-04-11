import type { Brand } from '@si/utils';

import { type AppEnv } from './Environment';

export type Token = Brand<string, 'Token'>;

export const Auth = {
  isAutoLogin: ({ appEnv }: { appEnv: AppEnv }) => appEnv !== 'prod',
};
