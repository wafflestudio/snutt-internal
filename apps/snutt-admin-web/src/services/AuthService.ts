import type { Token } from '../entities/Auth';

export type AuthService = {
  autoLogin: { enabled: true; initialToken: Token | null } | { enabled: false };
  login: (params: { username: string; password: string }) => Promise<{ token: Token }>;
  logout: () => void;
  getMe: (params: { token: string }) => Promise<{ userId: string }>;
};
