# 抖音爬虫说明

## 实现详情

根据提供的Go代码创建了抖音爬虫，实现了以下功能：

- **平台标识**: douyin
- **显示名称**: douyin
- **图标URL**: https://lf1-cdn-tos.bytegoofy.com/goofy/ies/douyin_web/public/favicon.ico
- **API端点**: https://www.iesdouyin.com/web/api/v2/hotsearch/billboard/word/
- **数据结构**: 包含热搜标题、热度值和搜索链接

## 代码实现

实现了与Go代码逻辑一致的TypeScript版本，包括：

1. 使用fetch API获取数据
2. 设置适当的请求头信息（User-Agent、Referer等）
3. 10秒超时机制
4. JSON响应解析
5. 数据格式转换为HotItem接口
6. URL编码标题以处理特殊字符
7. 热度值计算（将数值转换为万为单位的格式）
8. 构造抖音搜索链接

## 测试结果

- API端点 `/douyin` 返回正确的数据格式
- 成功返回了50条热搜条目
- 图标、名称和URL与Go代码完全一致
- 热度值正确计算和显示
- 搜索链接正确生成

## API响应示例

API成功返回了热门搜索，如：
- "外交部回应美国再退66个群" (热度值: 1210.31万)
- "U23国足0:0伊拉克" (热度值: 1206.75万)
- "2026国补升级" (热度值: 1161.66万)

所有功能正常工作，爬虫已成功集成到系统中。