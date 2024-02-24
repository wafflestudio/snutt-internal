import { getContext } from 'svelte';

const key = 'environment';
type EnvironmentContext = { APP_ENV: 'dev' | 'prod' | 'localDev' };
export const environmentContextSetter = (context: EnvironmentContext) => [key, context] as const;
export const getEnvironmentContext = () => getContext(key) as EnvironmentContext;
