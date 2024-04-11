import type { SnuttBackend } from '@si/snutt-backend';

import type { Token } from '../entities/Auth';
import type { AuthRepository } from '../repositories/AuthRepository';

export const createAuthSiSnuttBackendRepository = ({
  snuttBackend,
}: {
  snuttBackend: SnuttBackend;
}): AuthRepository => {
  return {
    login: async ({ username, password }) =>
      snuttBackend.http.post['/v1/login_local']({ body: { id: username, password } }).then(({ token }) => ({
        token: token as Token,
      })),

    getMe: async ({ token }) => snuttBackend.http.get['/v1/users/me']({ token }).then(({ id }) => ({ userId: id })),
  };
};
