# API 前置文件

根据现有项目结构和之前对话中提到的Go代码，以下是所有需要的API端点和相关信息：

## 当前已有API端点

1. `/list` - 获取所有支持的平台列表
2. `/:platform` - 获取特定平台的热搜数据
3. `/all` - 获取所有平台的热搜数据聚合
4. `/mcp/tools` - 获取可用的MCP工具
5. `/mcp/tool/execute` - 执行MCP工具
6. `/ws` - WebSocket连接
7. `/ws/:platform` - 特定平台的WebSocket连接

## 当前已实现的平台爬虫

1. [x] zhihu (知乎) - 知乎热搜
2. [x] weibo (微博) - 微博热搜
3. [x] baidu (百度) - 百度热搜
4. [x] toutiao (今日头条) - 今日头条热搜
5. [x] bilibili (哔哩哔哩) - B站热搜
6. [x] cctv (央视网) - 央视网热搜
7. [x] 360doc (360doc) - 360doc热搜
8. [x] 360search (360搜索) - 360搜索热搜

## 根据Go代码信息更新的平台详情

- zhihu (知乎):
  - 显示名称: 知乎
  - 图标: https://static.zhihu.com/static/favicon.ico
  - API: https://www.zhihu.com/api/v4/search/recommend_query/v2

- weibo (微博):
  - 显示名称: 微博
  - 图标: https://weibo.com/favicon.ico
  - API: https://s.weibo.com/top/summary

- baidu (百度):
  - 显示名称: 百度
  - 图标: https://www.baidu.com/favicon.ico
  - API: https://top.baidu.com/board?tab=realtime

- toutiao (今日头条):
  - 显示名称: 今日头条
  - 图标: https://sf3-cdn-tos.douyinstatic.com/obj/eden-cn/uhbfnupkbps/toutiao_favicon.ico
  - API: https://www.toutiao.com/hot-event/hot-board/?origin=toutiao_pc

- bilibili (哔哩哔哩):
  - 显示名称: 哔哩哔哩
  - 图标: https://static.hdslb.com/mobile/img/512.png
  - API: https://api.bilibili.com/x/web-interface/ranking/region?rid=0

- cctv (央视网):
  - 显示名称: 央视网
  - 图标: https://tv.cctv.com/favicon.ico
  - API: http://news.cctv.com/

- 360doc (360doc):
  - 显示名称: 360doc
  - 图标: https://www.360doc.cn/favicon.ico
  - API: http://www.360doc.com/

- 360search (360搜索):
  - 显示名称: 360搜索
  - 图标: https://ss.360tres.com/static/121a1737750aa53d.ico
  - API: https://ranks.hao.360.com/mbsug-api/hotnewsquery?type=news&realhot_limit=50

## 待实现的平台（基于Go代码中的list.go概念）

根据Go代码中的平台信息，还有更多平台需要实现：

- tieba (百度贴吧)
- douyin (抖音)
- kuaishou (快手)
- iqiyi (爱奇艺)
- tengxunkt (腾讯视频)
- youku (优酷)
- sohu (搜狐)
- ifeng (凤凰新闻)
- huanqiu (环球网)
- guancha (观察者网)
- douban (豆瓣)
- tianya (天涯论坛)
- mgtv (芒果TV)
- acfun (AcFun)
- smzdm (什么值得买)
- kuaidi (快递100)
- jd (京东)
- tmall (天猫)
- taobao (淘宝)
- suning (苏宁易购)
- pdd (拼多多)
- meituan (美团)
- ele (饿了么)
- xueqiu (雪球)
- eastmoney (东方财富)
- hexun (和讯网)
- cnblogs (博客园)
- csdn (CSDN)
- oschina (开源中国)
- v2ex (V2EX)

## API架构设计原则

1. 所有爬虫必须继承BaseCrawler类
2. 实现crawl()方法返回HotItem[]数组
3. 正确设置平台名称、显示名称、图标URL和API地址
4. 添加适当的错误处理和超时机制
5. 使用缓存机制提高性能
6. 遵循TypeScript类型安全原则

## 当前系统架构

- 使用Elysia.js框架构建API
- 使用Bun作为运行时环境
- 通过CrawlerManager统一管理所有爬虫
- 提供HTTP和WebSocket两种访问方式
- 支持MCP (Model Context Protocol) 服务
