import App from "./app/App.svelte";
import { createConfigRepository } from "./infrastructures/createConfigRepository";
import { createConfigService } from "./infrastructures/createConfigService";
import { createFetchClient } from "./infrastructures/createFetchClient";

const mode = import.meta.env.MODE;
const apiKey = import.meta.env.VITE_API_KEY;

if (!apiKey || typeof apiKey !== "string")
  throw new Error("VITE_API_KEY is not set");
if (!["localDev", "dev", "prod"].includes(mode))
  throw new Error("Invalid mode");

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
  target: document.getElementById("app"),
  context: new Map().set("services", { configService }),
});

export default app;
