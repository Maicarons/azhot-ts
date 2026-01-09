# GitHub爬虫说明

## 实现详情

根据提供的Go代码创建了GitHub爬虫，实现了以下功能：

- **平台标识**: github
- **显示名称**: GitHub
- **图标URL**: https://github.githubassets.com/favicons/favicon.png
- **API端点**: https://github.com/trending
- **数据结构**: 包含仓库名、描述和链接

## 代码实现

实现了与Go代码逻辑一致的TypeScript版本，包括：

1. 使用fetch API获取网页内容
2. 设置适当的请求头信息（User-Agent、Referer等）
3. 10秒超时机制
4. 使用正则表达式匹配GitHub Trending页面的HTML结构
5. 数据格式转换为HotItem接口
6. 清理和格式化仓库名称

## 当前状态

**注意**: API返回空数组，可能原因包括：

1. GitHub的反爬虫机制阻止了请求
2. GitHub页面结构可能已发生变化，导致正则表达式无法匹配
3. 可能需要特定的认证或会话信息
4. 地域限制或IP限制

## 正则表达式说明

使用的正则表达式为：

```
<span\s+data-view-component="true"\s+class="text-normal">\s*([^<]+)\s*<\/span>\s*([^<]+)<\/a>\s*<\/h2>\s*<p\sclass="col-9 color-fg-muted my-1 pr-4">\s*([^<]+)\s*<\/p>
```

用于匹配GitHub Trending页面中仓库名称和描述的HTML结构。

## 建议

如需解决API返回空结果的问题，可以考虑：

1. 添加更多请求头信息以模拟真实浏览器
2. 使用浏览器自动化工具（如Puppeteer）来获取数据
3. 检查GitHub是否有公开的API替代方案
4. 使用代理服务器访问
5. 实现更灵活的HTML解析方案

当前实现遵循了Go代码的逻辑，但可能需要额外的配置才能正常工作。
