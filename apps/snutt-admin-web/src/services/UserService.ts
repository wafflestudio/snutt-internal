import type { AdminUserSearchResult } from '../entities/User';
import type { UserRepository } from '../repositories/UserRepository';

export type UserService = {
  searchUsersByEmail: (req: { email: string; token: string }) => Promise<AdminUserSearchResult[]>;
};

export const createUserService = ({ userRepository }: { userRepository: UserRepository }): UserService => {
  return {
    searchUsersByEmail: ({ email, token }) => userRepository.searchUsersByEmail({ email: email.trim(), token }),
  };
};
