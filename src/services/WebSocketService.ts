import { Server } from "ws";
import { HotService } from "./HotService";

interface WebSocketMessage {
  type: "subscribe" | "request" | "ping";
  source: string;
  data?: any;
}

interface ClientSubscription {
  clientId: string;
  platforms: string[];
}

// 这个类是为了兼容旧实现而保留，但实际未被使用
// 当前项目使用 Elysia 内置的 WebSocket 功能
export class WebSocketService {
  private wss: Server;
  private hotService: HotService;
  private clients: Map<string, { ws: any; subscriptions: string[] }> =
    new Map(); // 使用 any 以避免类型冲突

  constructor(server: any) {
    // Express/HTTP server instance
    this.wss = new Server({ server });
    this.hotService = new HotService();
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.wss.on("connection", (ws: any) => {
      // 使用 any 类型以避免类型冲突
      const clientId = this.generateClientId();
      this.clients.set(clientId, { ws, subscriptions: [] });

      // 修复类型错误 - ws 应该是 WebSocket 实例
      ws.on("message", async (data: Buffer) => {
        try {
          const message: WebSocketMessage = JSON.parse(data.toString());
          await this.handleMessage(clientId, message);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
          this.sendError(ws, "Invalid message format");
        }
      });

      ws.on("close", () => {
        this.clients.delete(clientId);
      });

      ws.on("error", (error: Error) => {
        console.error("WebSocket error:", error);
        this.clients.delete(clientId);
      });

      // Send welcome message
      this.sendMessage(ws, {
        type: "ping",
        source: "server",
        data: { message: "Connected to azhot WebSocket server" },
      });
    });
  }

  private async handleMessage(
    clientId: string,
    message: WebSocketMessage,
  ): Promise<void> {
    const client = this.clients.get(clientId);
    if (!client) return;

    switch (message.type) {
      case "subscribe":
        this.handleSubscribe(clientId, message.source);
        break;
      case "request":
        await this.handleRequest(clientId, message.source);
        break;
      case "ping":
        this.handlePing(clientId);
        break;
      default:
        this.sendError(client.ws, "Unknown message type");
    }
  }

  private handleSubscribe(clientId: string, platform: string): void {
    const client = this.clients.get(clientId);
    if (!client) return;

    if (!client.subscriptions.includes(platform)) {
      client.subscriptions.push(platform);
    }

    this.sendMessage(client.ws, {
      type: "subscribe",
      source: platform,
      data: { message: `Subscribed to ${platform}` },
    });
  }

  private async handleRequest(
    clientId: string,
    platform: string,
  ): Promise<void> {
    const client = this.clients.get(clientId);
    if (!client) return;

    if (platform === "all") {
      const data = await this.hotService.getAllHotData();
      this.sendMessage(client.ws, { type: "request", source: platform, data });
    } else if (platform === "list") {
      const platforms = await this.hotService.getPlatformList();
      this.sendMessage(client.ws, {
        type: "request",
        source: platform,
        data: platforms,
      });
    } else {
      const data = await this.hotService.getHotData(platform);
      this.sendMessage(client.ws, { type: "request", source: platform, data });
    }
  }

  private handlePing(clientId: string): void {
    const client = this.clients.get(clientId);
    if (!client) return;

    this.sendMessage(client.ws, {
      type: "ping",
      source: "server",
      data: { message: "pong" },
    });
  }

  public async broadcastToPlatform(platform: string, data: any): Promise<void> {
    for (const [clientId, client] of this.clients) {
      if (
        client.subscriptions.includes(platform) ||
        client.subscriptions.includes("all")
      ) {
        this.sendMessage(client.ws, {
          type: "request",
          source: platform,
          data,
        });
      }
    }
  }

  private sendMessage(ws: any, message: WebSocketMessage): void {
    // 使用 any 类型以避免类型冲突
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  private sendError(ws: any, errorMessage: string): void {
    // 使用 any 类型以避免类型冲突
    if (ws.readyState === ws.OPEN) {
      ws.send(
        JSON.stringify({
          type: "error",
          source: "server",
          data: { error: errorMessage },
        }),
      );
    }
  }

  private generateClientId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  public close(): void {
    this.wss.close();
  }
}
