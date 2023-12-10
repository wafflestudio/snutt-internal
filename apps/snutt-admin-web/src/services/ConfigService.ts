import type { AdminConfig, AdminConfigId, Config } from '../entities/Config';
import type { OS, Version } from '../entities/NativeClient';

export type ConfigService = {
  getConfigs: (req: { os: OS; version: Version }) => Promise<Config>;
  getAdminConfig: (req: { configName: string; token: string }) => Promise<AdminConfig[]>;
  deleteAdminConfig: (req: { configName: string; configId: AdminConfigId; token: string }) => Promise<void>;
};
