import type { Config } from "../entities/Config";
import type { OS, Version } from "../entities/nativeClient";

export type ConfigService = {
  getConfigs: (req: { os: OS; version: Version }) => Promise<Config>;
};
