# 国家地理爬虫说明

## 实现详情

根据提供的Go代码创建了国家地理爬虫，实现了以下功能：

- **平台标识**: guojiadili
- **显示名称**: guojiadili
- **图标URL**: https://www.dili360.com/favicon.ico
- **API端点**: https://www.dili360.com/
- **数据结构**: 包含文章标题和链接

## 代码实现

实现了与Go代码逻辑一致的TypeScript版本，包括：

1. 使用fetch API获取网页内容
2. 设置适当的请求头信息（User-Agent、Referer等）
3. 10秒超时机制
4. 使用正则表达式匹配国家地理页面的文章结构
5. 数据格式转换为HotItem接口
6. URL路径正确拼接处理

## 测试结果

- API端点 `/guojiadili` 返回正确的数据格式
- 成功返回了10篇文章条目
- 图标、名称和URL与Go代码完全一致
- 文章标题和链接正确解析

## API响应示例

API成功返回了热门文章，如：

- "一个人的羌塘" (链接: https://www.dili360.com/article/p5350c3d884ac991.html)
- "喀喇昆仑深处的壮美" (链接: https://www.dili360.com/cng/article/p5350c3d6a3cb743.html)
- "西藏为什么如此迷人？" (链接: https://www.dili360.com/article/p542259cbbaa7e68.html)

所有功能正常工作，爬虫已成功集成到系统中。
