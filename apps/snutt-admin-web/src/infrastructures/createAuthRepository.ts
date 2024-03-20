import type { ApiClient } from '../clients/ApiClient';
import type { Token } from '../entities/Auth';
import type { AuthRepository } from '../repositories/AuthRepository';

export const createAuthRepository = ({ apiClient }: { apiClient: ApiClient }): AuthRepository => {
  return {
    login: async ({ username, password }) => {
      const response = await apiClient.post<{ token: string }>('/v1/auth/login_local', { id: username, password });
      return { token: response.token as Token };
    },
    getMe: async ({ token }) => {
      const response = await apiClient.get<{ id: string }>('/v1/users/me', {
        headers: { 'x-access-token': token },
      });
      return { userId: response.id };
    },
  };
};
