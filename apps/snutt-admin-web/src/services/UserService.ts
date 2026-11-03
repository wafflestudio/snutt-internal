import type { AdminMailLog, MailLogQuery } from '../entities/MailLog';
import type { AdminUserSearchResult } from '../entities/User';
import type { UserRepository } from '../repositories/UserRepository';

export type UserService = {
  searchUsersByEmail: (req: { email: string; token: string }) => Promise<AdminUserSearchResult[]>;
  searchMailLogs: (req: { query: MailLogQuery; token: string }) => Promise<AdminMailLog[]>;
};

export const createUserService = ({ userRepository }: { userRepository: UserRepository }): UserService => {
  return {
    searchUsersByEmail: ({ email, token }) => userRepository.searchUsersByEmail({ email: email.trim(), token }),
    searchMailLogs: ({ query, token }) =>
      userRepository.searchMailLogs({
        query: 'email' in query ? { email: query.email.trim() } : { localId: query.localId.trim() },
        token,
      }),
  };
};
