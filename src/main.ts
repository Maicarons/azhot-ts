import { Elysia } from "elysia";
import { config } from "./config";
import { hotController } from "./controllers/HotController";
import { mcpController } from "./mcp/MCPService";
import { webSocketController } from "./services/ElysiaWebSocketService";
import { cache } from "./utils/cache";
import { HotService } from "./services/HotService";
import { openapi } from "@elysiajs/openapi";
import { cron } from "@elysiajs/cron";

const app = new Elysia()
  .use(openapi())
  .use(hotController)
  .use(mcpController)
  .use(webSocketController)
  .use(
    cron({
      name: "cacheCleanup",
      pattern: "0 * * * *",
      run() {
        console.log("Running cache cleanup...");
        cache.cleanup();
      },
    }),
  )
  .use(
    cron({
      name: "refreshHotData",
      pattern: "*/30 * * * *",
      async run() {
        console.log("Refreshing hot data cache...");
        try {
          // 创建一个新的 HotService 实例，而不是访问控制器的装饰器
          const hotService = new HotService();
          await hotService.refreshCache();
        } catch (error) {
          console.error("Error refreshing cache:", error);
        }
      },
    }),
  )
  .get("/", () => ({
    message: "Welcome to azhot API Service",
    version: "1.0.0",
    endpoints: [
      {
        method: "GET",
        path: "/list",
        description: "Get all supported platforms",
      },
      {
        method: "GET",
        path: "/:platform",
        description: "Get hot data for specific platform",
      },
      {
        method: "GET",
        path: "/all",
        description: "Get hot data for all platforms",
      },
      {
        method: "GET",
        path: "/mcp/tools",
        description: "Get available MCP tools",
      },
      {
        method: "POST",
        path: "/mcp/tool/execute",
        description: "Execute MCP tool",
      },
      {
        method: "WS",
        path: "/ws",
        description: "WebSocket connection for all platforms",
      },
      {
        method: "WS",
        path: "/ws/:platform",
        description: "WebSocket connection for specific platform",
      },
    ],
  }))
  .listen(config.server.port);

// Start the server
console.log(
  `🦊 Azhot-ts is running at http://${config.server.host}:${config.server.port}`,
);

export default app;
