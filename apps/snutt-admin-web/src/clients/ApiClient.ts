export type ApiClient = {
  get: <T>(
    path: string,
    options?: { headers?: Record<string, string> }
  ) => Promise<T>;
};