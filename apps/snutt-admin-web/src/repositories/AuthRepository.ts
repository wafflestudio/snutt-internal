import type { Token } from '../entities/Auth';

export type AuthRepository = {
  login: (params: { username: string; password: string }) => Promise<{ token: Token }>;
  getMe: (params: { token: string }) => Promise<{ userId: string }>;
};
