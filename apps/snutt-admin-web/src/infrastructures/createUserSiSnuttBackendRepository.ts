import type { SnuttBackend } from '@si/snutt-backend';

import type { UserRepository } from '../repositories/UserRepository';

export const createUserSiSnuttBackendRepository = ({
  snuttBackend,
}: {
  snuttBackend: SnuttBackend;
}): UserRepository => {
  return {
    searchUsersByEmail: ({ email, token }) =>
      snuttBackend.http.get['/v1/admin/users/search']({ query: { email }, token }),
  };
};
