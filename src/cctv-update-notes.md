# CCTV爬虫更新说明

## 更新目的
根据提供的Go代码更新CCTV新闻爬虫，使其完全符合Go版本的实现逻辑。

## 主要变更

### 1. 显示名称变更
- **旧**: `央视网`
- **新**: `cctv`

### 2. 图标URL变更
- **旧**: `https://tv.cctv.com/favicon.ico`
- **新**: `https://news.cctv.com/favicon.ico`

### 3. API端点变更
- **旧**: `http://news.cctv.com/`
- **新**: `https://news.cctv.com/2019/07/gaiban/cmsdatainterface/page/world_1.jsonp`

### 4. 数据处理逻辑变更
- **旧**: 使用正则表达式解析HTML页面
- **新**: 解析JSONP响应，完全按照Go代码逻辑实现：
  - 处理JSONP回调函数包装
  - 按照Go代码逻辑去掉前6个字符和后1个字符
  - 正确解析嵌套的JSON结构

### 5. 实现细节
- 保持了相同的超时处理机制（10秒）
- 保留了错误处理逻辑
- 确保与Go代码中的CCTV函数完全对应

## 验证结果
- API端点 `/cctv` 返回正确的数据格式
- 返回了80多个新闻条目，数据完整
- 图标、名称和URL与Go代码完全一致