import { Auth, type Token } from '../entities/Auth';
import type { AuthRepository } from '../repositories/AuthRepository';
import type { EnvironmentRepository } from '../repositories/EnvironmentRepository';
import type { PersistStorageRepository } from '../repositories/PersistStorageRepository';

export type AuthService = {
  autoLogin: { enabled: true; initialToken: Token | null } | { enabled: false };
  login: (params: { username: string; password: string }) => Promise<{ token: Token }>;
  logout: () => void;
  getMe: (params: { token: string }) => Promise<{ userId: string }>;
};

export const createAuthService = ({
  authRepository,
  environmentRepository,
  persistStorageRepository,
}: {
  authRepository: AuthRepository;
  environmentRepository: EnvironmentRepository;
  persistStorageRepository: PersistStorageRepository;
}): AuthService => {
  const isAutoLogin = Auth.isAutoLogin({ appEnv: environmentRepository.getAppEnv() });
  const key = 'token';

  return {
    autoLogin: isAutoLogin
      ? { enabled: true, initialToken: persistStorageRepository.getItem(key) }
      : { enabled: false },
    login: async (req) => {
      const { token } = await authRepository.login(req);
      if (isAutoLogin) persistStorageRepository.setItem(key, token);
      return { token };
    },
    getMe: authRepository.getMe,
    logout: () => persistStorageRepository.removeItem(key),
  };
};
