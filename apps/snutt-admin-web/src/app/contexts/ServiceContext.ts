import { getContext } from "svelte";
import type { ConfigService } from "../../services/ConfigService";

const key = "service";
type ServiceContext = { configService: ConfigService };
export const serviceContextSetter = (context: ServiceContext) =>
  [key, context] as const;
export const getServiceContext = () => getContext(key) as ServiceContext;
