import type { Config } from "../entities/Config";
import type { OS, Version } from "../entities/nativeClient";

export type ConfigRepository = {
  getConfigs: (req: { os: OS; version: Version }) => Promise<Config>;
};
