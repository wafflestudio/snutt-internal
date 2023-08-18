import type { ApiClient } from "../clients/ApiClient";
import type { ConfigRepository } from "../repositories/ConfigRepository";

export const createConfigRepository = ({
  clients: [apiClient],
}: {
  clients: [ApiClient];
}): ConfigRepository => {
  return {
    getConfigs: (req) =>
      apiClient.get("/v1/configs", {
        headers: { "x-os-type": req.os, "x-app-version": req.version },
      }),
  };
};
