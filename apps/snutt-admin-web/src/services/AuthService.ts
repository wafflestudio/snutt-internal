import type { Token } from '../entities/Auth';

export type AuthService = {
  login: (params: { username: string; password: string }) => Promise<{ token: Token }>;
  getMe: (params: { token: string }) => Promise<{ userId: string }>;
};
