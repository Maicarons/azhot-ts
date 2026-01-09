import { Server } from "ws";
import { HotService } from "./HotService";
// 这个类是为了兼容旧实现而保留，但实际未被使用
// 当前项目使用 Elysia 内置的 WebSocket 功能
export class WebSocketService {
  constructor(server) {
    this.clients = new Map(); // 使用 any 以避免类型冲突
    this.wss = new Server({ server });
    this.hotService = new HotService();
    this.setupEventHandlers();
  }
  setupEventHandlers() {
    this.wss.on("connection", (ws) => {
      const clientId = this.generateClientId();
      this.clients.set(clientId, { ws, subscriptions: [] });
      // 修复类型错误 - ws 应该是 WebSocket 实例
      ws.on("message", async (data) => {
        try {
          const message = JSON.parse(data.toString());
          await this.handleMessage(clientId, message);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
          this.sendError(ws, "Invalid message format");
        }
      });
      ws.on("close", () => {
        this.clients.delete(clientId);
      });
      ws.on("error", (error) => {
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
  async handleMessage(clientId, message) {
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
  handleSubscribe(clientId, platform) {
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
  async handleRequest(clientId, platform) {
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
  handlePing(clientId) {
    const client = this.clients.get(clientId);
    if (!client) return;
    this.sendMessage(client.ws, {
      type: "ping",
      source: "server",
      data: { message: "pong" },
    });
  }
  async broadcastToPlatform(platform, data) {
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
  sendMessage(ws, message) {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }
  sendError(ws, errorMessage) {
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
  generateClientId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
  close() {
    this.wss.close();
  }
}
