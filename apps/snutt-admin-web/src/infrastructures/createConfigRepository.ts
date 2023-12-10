import type { ApiClient } from '../clients/ApiClient';
import type { ConfigRepository } from '../repositories/ConfigRepository';

export const createConfigRepository = ({ clients: [apiClient] }: { clients: [ApiClient] }): ConfigRepository => {
  return {
    getConfigs: (req) =>
      apiClient.get('/v1/configs', { headers: { 'x-os-type': req.os, 'x-app-version': req.version } }),
    getAdminConfig: (req) =>
      apiClient.get(`/v1/admin/configs/${req.configName}`, { headers: { 'x-access-token': req.token } }),
    deleteAdminConfig: (req) =>
      apiClient.delete(`/v1/admin/configs/${req.configName}/${req.configId}`, {
        headers: { 'x-access-token': req.token },
      }),
  };
};
