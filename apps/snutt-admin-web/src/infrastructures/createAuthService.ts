import type { AuthRepository } from '../repositories/AuthRepository';
import type { AuthService } from '../services/AuthService';

export const createAuthService = ({ authRepository }: { authRepository: AuthRepository }): AuthService => {
  return {
    login: authRepository.login,
    getMe: authRepository.getMe,
  };
};
