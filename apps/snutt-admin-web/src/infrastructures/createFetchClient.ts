import type { ApiClient } from "../clients/ApiClient";

export const createFetchClient = (
  baseUrl: string,
  apiKey: string
): ApiClient => {
  return {
    get: async <T>(
      path: string,
      options?: { headers?: Record<string, string> }
    ) => {
      const response = await fetch(`${baseUrl}${path}`, {
        headers: { "x-access-apikey": apiKey, ...(options?.headers ?? {}) },
      });
      const data = await response.json();
      if (!response.ok) throw data;
      return data as T;
    },

    post: async <T>(
      path: string,
      body: Record<string, unknown>,
      options?: { headers?: Record<string, string> }
    ) => {
      const response = await fetch(`${baseUrl}${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-apikey": apiKey,
          ...(options?.headers ?? {}),
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw data;
      return data as T;
    },

    delete: async <T>(
      path: string,
      options?: { headers?: Record<string, string> }
    ) => {
      const response = await fetch(`${baseUrl}${path}`, {
        method: "DELETE",
        headers: { "x-access-apikey": apiKey, ...(options?.headers ?? {}) },
      });
      const data = await response.json();
      if (!response.ok) throw data;
      return data as T;
    },
  };
};
