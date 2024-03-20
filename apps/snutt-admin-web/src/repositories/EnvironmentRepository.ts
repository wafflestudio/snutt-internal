import type { AppEnv } from '../entities/Environment';

export type EnvironmentRepository = {
  getAppEnv: () => AppEnv;
};
