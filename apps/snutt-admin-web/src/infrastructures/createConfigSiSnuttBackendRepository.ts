import type { SnuttBackend } from '@si/snutt-backend';

import type { AdminConfig } from '../entities/Config';
import type { ConfigRepository } from '../repositories/ConfigRepository';

export const createConfigSiSnuttBackendRepository = ({
  snuttBackend,
}: {
  snuttBackend: SnuttBackend;
}): ConfigRepository => {
  return {
    getConfigs: (req) =>
      snuttBackend.http.get['/v1/configs']({ headers: { 'x-os-type': req.os, 'x-app-version': req.version } }),

    getAdminConfig: (req) =>
      snuttBackend.http.get['/v1/admin/configs/{name}']({
        path: { name: req.configName },
        token: req.token,
      }) as Promise<AdminConfig[]>,

    deleteAdminConfig: (req) =>
      snuttBackend.http.delete['/v1/admin/configs/{name}/{id}']({
        path: { name: req.configName, id: req.configId },
        token: req.token,
      }),
  };
};
