import type { EnvironmentRepository } from '../repositories/EnvironmentRepository';

export const createImportMetaEnvironmentRepository = (): EnvironmentRepository => {
  return {
    getAppEnv: () => {
      const mode = import.meta.env.MODE;
      if (mode !== 'localDev' && mode !== 'dev' && mode !== 'prod') throw new Error('Invalid mode');
      return mode;
    },
  };
};
