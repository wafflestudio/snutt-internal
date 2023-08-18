import { getContext } from "svelte";

const key = "auth";
type AuthContext = { token: string | undefined };
export const authContextSetter = (context: AuthContext) =>
  [key, context] as const;
export const getAuthContext = () => getContext(key) as AuthContext;
