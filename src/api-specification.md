# API 规范文档

## 数据类型定义

### HotItem 接口
```typescript
interface HotItem {
  index: number;      // 排名序号
  title: string;      // 热搜标题
  url?: string;       // 相关链接（可选）
  hotValue?: number;  // 热度值（可选）
  desc?: string;      // 描述（可选）
}
```

### HotData 接口
```typescript
interface HotData {
  code: number;       // 状态码
  icon: string;       // 平台图标URL
  message: string;    // 返回消息
  obj: HotItem[];     // 热搜数据数组
  timestamp: number;  // 时间戳
}
```

### PlatformConfig 接口
```typescript
interface PlatformConfig {
  name: string;       // 平台标识符
  displayName: string; // 显示名称
  icon: string;       // 图标URL
  url: string;        // API地址
}
```

## API 端点详情

### 1. 获取平台列表
- **路径**: `/list`
- **方法**: GET
- **描述**: 获取所有支持的平台信息
- **参数**: 无
- **返回示例**:
```json
[
  {
    "name": "zhihu",
    "displayName": "知乎",
    "icon": "https://static.zhihu.com/static/favicon.ico",
    "url": "https://www.zhihu.com/api/v4/search/recommend_query/v2"
  },
  {
    "name": "weibo",
    "displayName": "微博",
    "icon": "https://weibo.com/favicon.ico",
    "url": "https://s.weibo.com/top/summary"
  }
]
```

### 2. 获取特定平台热搜
- **路径**: `/:platform`
- **方法**: GET
- **描述**: 获取指定平台的热搜数据
- **路径参数**:
  - `platform`: 平台名称（如zhihu, weibo, baidu等）
- **返回示例**:
```json
{
  "code": 200,
  "icon": "https://static.zhihu.com/static/favicon.ico",
  "message": "知乎",
  "obj": [
    {
      "index": 1,
      "title": "热搜标题1",
      "url": "https://example.com/link1",
      "hotValue": 12345
    },
    {
      "index": 2,
      "title": "热搜标题2",
      "url": "https://example.com/link2",
      "hotValue": 10000
    }
  ],
  "timestamp": 1689876543210
}
```

### 3. 获取所有平台热搜
- **路径**: `/all`
- **方法**: GET
- **描述**: 获取所有平台的热搜数据聚合
- **参数**: 无
- **返回示例**:
```json
{
  "code": 200,
  "icon": "",
  "message": "All platforms",
  "obj": [
    {
      "index": 1,
      "title": "zhihu: 知乎热搜标题1",
      "url": "https://example.com/zhihu-link1",
      "hotValue": 12345,
      "desc": "zhihu: 知乎热搜标题1"
    },
    {
      "index": 1,
      "title": "weibo: 微博热搜标题1",
      "url": "https://example.com/weibo-link1",
      "hotValue": 54321,
      "desc": "weibo: 微博热搜标题1"
    }
  ],
  "timestamp": 1689876543210
}
```

### 4. 获取MCP工具列表
- **路径**: `/mcp/tools`
- **方法**: GET
- **描述**: 获取可用的MCP工具列表
- **参数**: 无
- **返回示例**:
```json
{
  "tools": [
    {
      "name": "get_hot_search",
      "description": "获取指定平台的热搜数据",
      "inputSchema": {
        "type": "object",
        "properties": {
          "platform": {
            "type": "string",
            "description": "平台名称，如zhihu, weibo, baidu等"
          }
        },
        "required": ["platform"]
      }
    }
  ],
  "pagination": {
    "nextCursor": null
  }
}
```

### 5. 执行MCP工具
- **路径**: `/mcp/tool/execute`
- **方法**: POST
- **描述**: 执行指定的MCP工具
- **请求体**:
```json
{
  "name": "get_hot_search",
  "arguments": {
    "platform": "zhihu"
  }
}
```
- **返回示例**:
```json
{
  "result": {
    "code": 200,
    "icon": "https://static.zhihu.com/static/favicon.ico",
    "message": "知乎",
    "obj": [...],
    "timestamp": 1689876543210
  }
}
```

## WebSocket API

### 1. 通用WebSocket连接
- **路径**: `/ws`
- **协议**: WebSocket
- **描述**: 连接后可订阅任意平台的实时数据

### 2. 特定平台WebSocket连接
- **路径**: `/ws/:platform`
- **协议**: WebSocket
- **描述**: 直接连接到特定平台的实时数据流

### WebSocket消息格式
```json
{
  "type": "subscribe|request|ping",
  "source": "平台名称，如baidu、zhihu等",
  "data": {}
}
```

- `subscribe`: 订阅特定平台的实时数据
- `request`: 请求一次性数据
- `ping`: 心跳消息

## 错误处理

- **404**: 平台不存在
- **500**: 服务器内部错误
- **超时**: 请求超时（10秒）

## 性能优化

- 使用缓存机制，缓存时间为5分钟
- 实现请求超时控制
- 提供降级方案（返回缓存数据）

## 扩展性考虑

- 新增平台只需继承BaseCrawler类
- 自动注册到CrawlerManager
- 无需修改路由配置