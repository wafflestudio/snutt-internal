import type { AdminConfig, AdminConfigId, Config } from '../entities/Config';
import type { OS, Version } from '../entities/NativeClient';
import type { ConfigRepository } from '../repositories/ConfigRepository';

export type ConfigService = {
  getConfigs: (req: { os: OS; version: Version }) => Promise<Config>;
  getAdminConfig: (req: { configName: string; token: string }) => Promise<AdminConfig[]>;
  deleteAdminConfig: (req: { configName: string; configId: AdminConfigId; token: string }) => Promise<void>;
};

export const createConfigService = ({ configRepository }: { configRepository: ConfigRepository }): ConfigService => {
  return {
    getConfigs: (req) => configRepository.getConfigs(req),
    getAdminConfig: (req) => configRepository.getAdminConfig(req),
    deleteAdminConfig: (req) => configRepository.deleteAdminConfig(req),
  };
};
