export type SnuttBackend = ReturnType<typeof implSnuttBackend>;

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export const implSnuttBackend = ({ baseUrl, apiKey }: { baseUrl: string; apiKey: string }) => {
  const getHeaders = ({ token, method }: { token?: string; method: Method }): Record<string, string> => {
    const apiKeyHeader = { 'x-access-apikey': apiKey };
    const tokenHeader = token ? { 'x-access-token': token } : null;
    const contentTypeHeader =
      method === 'POST' || method === 'PUT' || method === 'PATCH' ? { 'Content-Type': 'application/json' } : null;
    return { ...apiKeyHeader, ...tokenHeader, ...contentTypeHeader };
  };

  const httpCall = async <R>({
    method,
    path,
    token,
    body,
    headers,
  }: {
    method: Method;
    path: string;
    token?: string;
    body?: Record<string, unknown>;
    headers?: Record<string, string>;
  }) => {
    const response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: { ...getHeaders({ token, method }), ...headers },
      body: body && JSON.stringify(body),
    });

    return response.json() as R;
  };

  return {
    http: {
      get: {
        // https://snu4t-api-dev.wafflestudio.com/webjars/swagger-ui/index.html#/default/getPopups
        '/v1/popups': () =>
          httpCall<{
            content: {
              id: string;
              key: string;
              imageUri: string;
              image_uri: string;
              hiddenDays: number;
              hidden_days: number;
            }[];
            totalCount: number;
            nextPageToken: string;
          }>({ method: 'GET', path: '/v1/popups' }),

        // https://snu4t-api-dev.wafflestudio.com/webjars/swagger-ui/index.html#/default/getUserMe
        '/v1/users/me': ({ token }: { token: string }) =>
          httpCall<{
            id: string;
            isAdmin: boolean;
            regDate: string;
            notificationCheckedAt: string;
            email: string;
            localId: string;
            fbName: string;
            nickname: { nickname: string; tag: string };
          }>({ method: 'GET', path: '/v1/users/me', token }),

        // https://snu4t-api-dev.wafflestudio.com/webjars/swagger-ui/index.html#/default/getConfigs_1
        '/v1/configs': ({ headers }: { headers: Record<string, string> }) =>
          httpCall<Record<string, Record<string, unknown>>>({ method: 'GET', path: '/v1/configs', headers }),

        // https://snu4t-api-dev.wafflestudio.com/webjars/swagger-ui/index.html#/default/getConfigs
        '/v1/admin/configs/{name}': ({ path: { name }, token }: { path: { name: string }; token: string }) =>
          httpCall<
            {
              id: string;
              data: Record<string, unknown>;
              minVersion: { ios: string; android: string } | null;
              maxVersion: { ios: string; android: string } | null;
            }[]
          >({ method: 'GET', path: `/v1/admin/configs/${name}`, token }),
      },

      post: {
        // https://snu4t-api-dev.wafflestudio.com/webjars/swagger-ui/index.html#/default/loginLocal
        '/v1/login_local': ({ body }: { body: { id: string; password: string } }) =>
          httpCall<{ user_id: String; token: String; message: string }>({
            method: 'POST',
            path: '/v1/login_local',
            body,
          }),

        // https://snu4t-api-dev.wafflestudio.com/webjars/swagger-ui/index.html#/default/getUploadSignedUris
        '/v1/admin/images/{source}/upload-uris': ({ path, token }: { path: { source: string }; token: string }) =>
          httpCall<{ uploadUri: string; fileOriginUri: string; fileUri: string }[]>({
            method: 'POST',
            path: `/v1/admin/images/${path.source}/upload-uris`,
            token,
          }),

        // https://snu4t-api-dev.wafflestudio.com/webjars/swagger-ui/index.html#/default/insertNotification
        '/v1/admin/insert_noti': ({
          body,
          token,
        }: {
          body: {
            userId?: string;
            title: string;
            body: string;
            insertFcm: boolean;
            type: number;
            dataPayload: Record<string, string>;
          };
          token: string;
        }) => httpCall<{ message: string }>({ method: 'POST', path: '/v1/admin/insert_noti', token, body }),

        // https://snu4t-api-dev.wafflestudio.com/webjars/swagger-ui/index.html#/default/postPopup
        '/v1/admin/popups': ({
          body,
          token,
        }: {
          body: { hiddenDays: number; imageOriginUri: string; key: string };
          token: string;
        }) =>
          httpCall<{
            id: string;
            key: string;
            imageUri: string;
            image_uri: string;
            hiddenDays: string;
            hidden_days: string;
          }>({ method: 'POST', path: '/v1/admin/popups', token, body }),
      },

      delete: {
        // https://snu4t-api-dev.wafflestudio.com/webjars/swagger-ui/index.html#/default/deleteConfig
        '/v1/admin/configs/{name}/{id}': ({
          path: { name, id },
          token,
        }: {
          path: { name: string; id: string };
          token: string;
        }) => httpCall<void>({ method: 'DELETE', path: `/v1/admin/configs/${name}/${id}`, token }),

        // https://snu4t-api-dev.wafflestudio.com/webjars/swagger-ui/index.html#/default/deletePopup
        '/v1/admin/popups/{id}': ({ path: { id }, token }: { path: { id: string }; token: string }) =>
          httpCall<void>({ method: 'DELETE', path: `/v1/admin/popups/${id}`, token }),
      },
    },
  };
};
