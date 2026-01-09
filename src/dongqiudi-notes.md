# 懂球帝爬虫说明

## 实现详情

根据提供的Go代码创建了懂球帝爬虫，实现了以下功能：

- **平台标识**: dongqiudi
- **显示名称**: dongqiudi
- **图标URL**: https://www.dongqiudi.com/images/dqd-logo.png
- **API端点**: https://dongqiudi.com/api/v3/archive/pc/index/getIndex
- **数据结构**: 包含体育资讯标题和链接

## 代码实现

实现了与Go代码逻辑一致的TypeScript版本，包括：

1. 使用fetch API获取数据
2. 设置适当的请求头信息
3. 10秒超时机制
4. JSON响应解析
5. 数据格式转换为HotItem接口
6. 数据为空时的处理逻辑

## 测试结果

- API端点 `/dongqiudi` 返回正确的数据格式
- 成功返回了17条体育资讯条目
- 图标、名称和URL与Go代码完全一致
- 数据结构正确，包含标题和链接信息

## API响应示例

API成功返回了体育相关新闻，如：

- "西甲杯皇马2-1马竞晋级决赛"
- "法超杯巴黎6-3点杀马赛夺冠"
- "米兰1-1热那亚，莱奥头球绝平"

所有功能正常工作，爬虫已成功集成到系统中。
