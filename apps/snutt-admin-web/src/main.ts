import App from "./app/App.svelte";
import { authContextSetter } from "./app/contexts/AuthContext";
import { serviceContextSetter } from "./app/contexts/ServiceContext";
import { createConfigRepository } from "./infrastructures/createConfigRepository";
import { createConfigService } from "./infrastructures/createConfigService";
import { createFetchClient } from "./infrastructures/createFetchClient";

const mode = import.meta.env.MODE;
const apiKey = import.meta.env.VITE_API_KEY;
const token = import.meta.env.VITE_TOKEN;

if (!apiKey || typeof apiKey !== "string")
  throw new Error("VITE_API_KEY is not set");
if (mode !== "localDev" && mode !== "dev" && mode !== "prod")
  throw new Error("Invalid mode");
if (token !== undefined && typeof token !== "string")
  throw new Error("Invalid token");

const baseUrl = {
  localDev: "/api",
  dev: "https://snutt-api-dev.wafflestudio.com",
  prod: "https://snutt-api.wafflestudio.com",
}[mode];

const configService = createConfigService({
  repositories: [
    createConfigRepository({ clients: [createFetchClient(baseUrl, apiKey)] }),
  ],
});

const app = new App({
  target: document.getElementById("app") as HTMLElement,
  context: new Map()
    .set(...serviceContextSetter({ configService }))
    .set(...authContextSetter({ token })),
});

export default app;
