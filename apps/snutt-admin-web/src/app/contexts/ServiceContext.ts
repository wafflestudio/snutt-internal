import { getContext, setContext } from "svelte";
import type { ConfigService } from "../../services/ConfigService";

const key = "services";
type ServiceContext = { configService: ConfigService };
export const setServiceContext = (context: ServiceContext) =>
  setContext(key, context);
export const getServiceContext = () => getContext(key) as ServiceContext;
