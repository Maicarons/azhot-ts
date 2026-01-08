import { Elysia } from 'elysia';
import { HotService } from '../services/HotService';

interface MCPTool {
  name: string;
  description: string;
  inputSchema: any;
}

interface MCPRequest {
  method: string;
  params: {
    name: string;
    arguments: Record<string, any>;
  };
  id: string;
  jsonrpc: string;
}

interface MCPResponse {
  result?: any;
  error?: {
    code: number;
    message: string;
  };
  id: string;
  jsonrpc: string;
}

export const mcpController = new Elysia({ name: 'controller:mcp' })
  .decorate('hotService', new HotService())
  .get('/mcp/tools', ({ hotService }) => {
    const tools: MCPTool[] = [
      {
        name: 'get_hot_search',
        description: '获取指定平台的热搜数据',
        inputSchema: {
          type: 'object',
          properties: {
            platform: {
              type: 'string',
              description: '平台名称，如zhihu, weibo, baidu等'
            }
          },
          required: ['platform']
        }
      },
      {
        name: 'get_all_hot_search',
        description: '获取所有平台的热搜数据聚合',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      },
      {
        name: 'get_platform_list',
        description: '获取支持的平台列表',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      }
    ];
    
    return {
      tools,
      pagination: {
        nextCursor: null
      }
    };
  })
  .post('/mcp/tool/execute', 
    async ({ hotService, body }) => {
      const request = body as MCPRequest;
      
      try {
        let result;
        
        switch (request.params.name) {
          case 'get_hot_search':
            result = await hotService.getHotData(request.params.arguments.platform);
            break;
          case 'get_all_hot_search':
            result = await hotService.getAllHotData();
            break;
          case 'get_platform_list':
            result = await hotService.getPlatformList();
            break;
          default:
            return {
              error: {
                code: -32601,
                message: `Method ${request.params.name} not found`
              },
              id: request.id,
              jsonrpc: request.jsonrpc
            } as MCPResponse;
        }
        
        return {
          result,
          id: request.id,
          jsonrpc: request.jsonrpc
        } as MCPResponse;
      } catch (error: any) {
        return {
          error: {
            code: -32603,
            message: error.message || 'Internal error'
          },
          id: request.id,
          jsonrpc: request.jsonrpc
        } as MCPResponse;
      }
    }
  )
  .get('/mcp/prompts', () => {
    return {
      prompts: [
        {
          name: 'hot_search_info',
          description: '提供各平台热搜数据访问能力',
          resourceTemplates: []
        }
      ],
      pagination: {
        nextCursor: null
      }
    };
  })
  .get('/mcp/ping', () => {
    return { status: 'ok', timestamp: Date.now() };
  })
  .get('/mcp/.well-known/mcp-info', () => {
    return {
      protocols: [
        {
          name: 'jsonrpc-http',
          version: '1.0.0',
          endpoint: '/mcp'
        }
      ],
      capabilities: {
        tools: {
          list: '/mcp/tools',
          call: '/mcp/tool/execute'
        },
        prompts: {
          list: '/mcp/prompts'
        }
      }
    };
  });