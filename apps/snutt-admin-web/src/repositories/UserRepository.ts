import type { AdminUserSearchResult } from '../entities/User';

export type UserRepository = {
  searchUsersByEmail: (req: { email: string; token: string }) => Promise<AdminUserSearchResult[]>;
};
