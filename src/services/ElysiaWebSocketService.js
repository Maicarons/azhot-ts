import { Elysia } from "elysia";
import { HotService } from "./HotService";
const hotService = new HotService();
export const webSocketController = new Elysia({ name: "controller:websocket" })
  .ws("/ws", {
    open(ws) {
      console.log("Client connected to WebSocket");
      ws.send(
        JSON.stringify({
          type: "ping",
          source: "server",
          data: { message: "Connected to azhot WebSocket server" },
        }),
      );
    },
    message: async (ws, message) => {
      try {
        const parsedMessage = JSON.parse(message.toString());
        await handleMessage(ws, parsedMessage, hotService);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
        ws.send(
          JSON.stringify({
            type: "error",
            source: "server",
            data: { message: "Invalid message format" },
          }),
        );
      }
    },
    close(ws) {
      console.log("Client disconnected from WebSocket");
    },
  })
  .ws("/ws/:platform", {
    open(ws) {
      // For this implementation, we'll rely on the URL to determine the platform
      console.log(`Client connected to platform WebSocket`);
      ws.send(
        JSON.stringify({
          type: "ping",
          source: "server",
          data: { message: `Connected to platform WebSocket` },
        }),
      );
    },
    message: async (ws, message) => {
      try {
        const parsedMessage = JSON.parse(message.toString());
        // We need to determine the platform from the WebSocket connection
        // For this, we'll need to track connections and their platforms separately
        await handleMessage(ws, parsedMessage, hotService);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
        ws.send(
          JSON.stringify({
            type: "error",
            source: "server",
            data: { message: "Invalid message format" },
          }),
        );
      }
    },
    close(ws) {
      console.log("Client disconnected from platform WebSocket");
    },
  });
async function handleMessage(ws, message, service) {
  switch (message.type) {
    case "subscribe":
      // In a real implementation, we would track subscriptions
      ws.send(
        JSON.stringify({
          type: "subscribe",
          source: message.source,
          data: { message: `Subscribed to ${message.source}` },
        }),
      );
      break;
    case "request":
      await handleRequest(ws, message.source, service);
      break;
    case "ping":
      ws.send(
        JSON.stringify({
          type: "ping",
          source: "server",
          data: { message: "pong" },
        }),
      );
      break;
    default:
      ws.send(
        JSON.stringify({
          type: "error",
          source: "server",
          data: { message: "Unknown message type" },
        }),
      );
  }
}
async function handleRequest(ws, platform, service) {
  let data;
  if (platform === "all") {
    data = await service.getAllHotData();
  } else if (platform === "list") {
    data = await service.getPlatformList();
  } else {
    data = await service.getHotData(platform);
  }
  ws.send(
    JSON.stringify({
      type: "request",
      source: platform,
      data,
    }),
  );
}
