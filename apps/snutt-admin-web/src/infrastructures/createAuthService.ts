import { Auth } from '../entities/Auth';
import type { AuthRepository } from '../repositories/AuthRepository';
import type { EnvironmentRepository } from '../repositories/EnvironmentRepository';
import type { PersistStorageRepository } from '../repositories/PersistStorageRepository';
import type { AuthService } from '../services/AuthService';

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
