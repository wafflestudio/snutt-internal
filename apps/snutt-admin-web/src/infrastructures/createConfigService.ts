import type { ConfigRepository } from "../repositories/ConfigRepository";
import type { ConfigService } from "../services/ConfigService";

export const createConfigService = ({
  repositories: [configRepository],
}: {
  repositories: [ConfigRepository];
}): ConfigService => {
  return { getConfigs: (req) => configRepository.getConfigs(req) };
};
