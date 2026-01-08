import { Elysia } from 'elysia';
import { config } from './config';
import { hotController } from './controllers/HotController';
import { mcpController } from './mcp/MCPService';
import { webSocketController } from './services/ElysiaWebSocketService';
import { cache } from './utils/cache';
import cron from 'node-cron';
import { HotService } from './services/HotService';

const app = new Elysia()
  .use(hotController)
  .use(mcpController)
  .use(webSocketController)
  .get('/', () => ({ 
    message: 'Welcome to azhot API Service', 
    version: '1.0.0',
    endpoints: [
      { method: 'GET', path: '/list', description: 'Get all supported platforms' },
      { method: 'GET', path: '/:platform', description: 'Get hot data for specific platform' },
      { method: 'GET', path: '/all', description: 'Get hot data for all platforms' },
      { method: 'GET', path: '/mcp/tools', description: 'Get available MCP tools' },
      { method: 'POST', path: '/mcp/tool/execute', description: 'Execute MCP tool' },
      { method: 'WS', path: '/ws', description: 'WebSocket connection for all platforms' },
      { method: 'WS', path: '/ws/:platform', description: 'WebSocket connection for specific platform' }
    ]
  }));

// Start the server
app.listen(config.server.port);
console.log(`🦊 Elysia is running at http://${config.server.host}:${config.server.port}`);

// Schedule cache cleanup every 10 minutes
cron.schedule('*/10 * * * *', () => {
  console.log('Running cache cleanup...');
  cache.cleanup();
});

// Refresh hot data cache every 5 minutes for all platforms
cron.schedule('*/5 * * * *', async () => {
  console.log('Refreshing hot data cache...');
  try {
    // 创建一个新的 HotService 实例，而不是访问控制器的装饰器
    const hotService = new HotService();
    await hotService.refreshCache();
  } catch (error) {
    console.error('Error refreshing cache:', error);
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down gracefully...');
  process.exit(0);
});