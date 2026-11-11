import type { AdminMailLog, MailLogQuery } from '../entities/MailLog';
import type { AdminUserSearchResult } from '../entities/User';

export type UserRepository = {
  searchUsersByEmail: (req: { email: string; token: string }) => Promise<AdminUserSearchResult[]>;
  searchMailLogs: (req: { query: MailLogQuery; token: string }) => Promise<AdminMailLog[]>;
};
