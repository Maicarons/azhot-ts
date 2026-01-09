# 完整的API前端准备文件

## 项目概述

根据Go代码中的list.go文件信息，本项目是一个聚合各大平台热搜数据的API服务，使用TypeScript + Elysia.js + Bun开发。

## 所有平台列表（来自Go代码）

| RouteName    | Name         | Icon                                                                                      |
| ------------ | ------------ | ----------------------------------------------------------------------------------------- |
| 360doc       | 360doc       | https://www.360doc.cn/favicon.ico                                                         |
| 360search    | 360搜索      | https://ss.360tres.com/static/121a1737750aa53d.ico                                        |
| acfun        | AcFun        | https://cdn.aixifan.com/ico/favicon.ico                                                   |
| baidu        | 百度         | https://www.baidu.com/favicon.ico                                                         |
| bilibili     | 哔哩哔哩     | https://static.hdslb.com/mobile/img/512.png                                               |
| cctv         | 央视网       | https://tv.cctv.com/favicon.ico                                                           |
| csdn         | CSDN         | https://g.csdnimg.cn/static/logo/favicon32.ico                                            |
| dongqiudi    | 懂球帝       | https://page-dongqiudi.com/zb_users/theme/zblog5_blog/image/favicon.ico                   |
| douban       | 豆瓣         | https://img3.doubanio.com/favicon.ico                                                     |
| douyin       | 抖音         | https://lf1-cdn-tos.bytegoofy.com/goofy/ies/douyin_web/public/favicon.ico                 |
| github       | GitHub       | https://github.githubassets.com/favicons/favicon.png                                      |
| guojiadili   | 国家地理     | http://www.dili360.com/favicon.ico                                                        |
| historytoday | 历史上的今天 | https://www.baidu.com/favicon.ico                                                         |
| hupu         | 虎扑         | https://www.hupu.com/favicon.ico                                                          |
| ithome       | IT之家       | https://www.ithome.com/favicon.ico                                                        |
| lishipin     | 梨视频       | https://page.pearvideo.com/webres/img/logo.png                                            |
| nanfang      | 南方周末     | https://icdn.infzm.com/wap/img/infzm-meta-icon.46b02e1.png                                |
| pengpai      | 澎湃新闻     | https://www.thepaper.cn/favicon.ico                                                       |
| qqnews       | 腾讯新闻     | https://mat1.gtimg.com/qqcdn/qqindex2021/favicon.ico                                      |
| quark        | 夸克         | https://gw.alicdn.com/imgextra/i3/O1CN018r2tKf28YP7ev0fPF_!!6000000007944-2-tps-48-48.png |
| renmin       | 人民网       | http://www.people.com.cn/favicon.ico                                                      |
| sougou       | 搜狗         | https://www.sogou.com/favicon.ico                                                         |
| souhu        | 搜狐         | https://m.sohu.com/favicon.ico                                                            |
| toutiao      | 今日头条     | https://sf3-cdn-tos.douyinstatic.com/obj/eden-cn/uhbfnupkbps/toutiao_favicon.ico          |
| v2ex         | V2EX         | https://www.v2ex.com/static/favicon.ico                                                   |
| wangyinews   | 网易新闻     | https://news.163.com/favicon.ico                                                          |
| weibo        | 微博         | https://weibo.com/favicon.ico                                                             |
| xinjingbao   | 新京报       | https://www.bjnews.com.cn/favicon.ico                                                     |
| zhihu        | 知乎         | https://static.zhihu.com/static/favicon.ico                                               |

## 当前已实现的平台

- [x] 360doc
- [x] 360search
- [x] baidu
- [x] bilibili
- [x] cctv
- [x] toutiao
- [x] weibo
- [x] zhihu

## 待实现的平台

- [ ] acfun
- [ ] csdn
- [ ] dongqiudi
- [ ] douban
- [ ] douyin
- [ ] github
- [ ] guojiadili
- [ ] historytoday
- [ ] hupu
- [ ] ithome
- [ ] lishipin
- [ ] nanfang
- [ ] pengpai
- [ ] qqnews
- [ ] quark
- [ ] renmin
- [ ] sougou
- [ ] souhu
- [ ] v2ex
- [ ] wangyinews
- [ ] xinjingbao

以及其他额外平台：

- [ ] tieba (百度贴吧)
- [ ] kuaishou (快手)
- [ ] iqiyi (爱奇艺)
- [ ] tengxunkt (腾讯视频)
- [ ] youku (优酷)
- [ ] ifeng (凤凰新闻)
- [ ] huanqiu (环球网)
- [ ] guancha (观察者网)
- [ ] tianya (天涯论坛)
- [ ] mgtv (芒果TV)
- [ ] smzdm (什么值得买)
- [ ] kuaidi (快递100)
- [ ] jd (京东)
- [ ] tmall (天猫)
- [ ] taobao (淘宝)
- [ ] suning (苏宁易购)
- [ ] pdd (拼多多)
- [ ] meituan (美团)
- [ ] ele (饿了么)
- [ ] xueqiu (雪球)
- [ ] eastmoney (东方财富)
- [ ] hexun (和讯网)
- [ ] cnblogs (博客园)
- [ ] oschina (开源中国)

## API路由结构

### 基础路由

- `GET /` - 返回API信息
- `GET /list` - 获取所有支持的平台列表
- `GET /all` - 获取所有平台的热搜数据聚合
- `GET /:platform` - 获取特定平台的热搜数据

### MCP路由

- `GET /mcp/tools` - 获取可用的MCP工具
- `POST /mcp/tool/execute` - 执行MCP工具

### WebSocket路由

- `WS /ws` - 通用WebSocket连接
- `WS /ws/:platform` - 特定平台WebSocket连接

## 数据类型定义

### HotItem 接口

```typescript
interface HotItem {
  index: number; // 排名序号
  title: string; // 热搜标题
  url?: string; // 相关链接（可选）
  hotValue?: number; // 热度值（可选）
  desc?: string; // 描述（可选）
}
```

### HotData 接口

```typescript
interface HotData {
  code: number; // 状态码
  icon: string; // 平台图标URL
  message: string; // 返回消息
  obj: HotItem[]; // 热搜数据数组
  timestamp: number; // 时间戳
}
```

## 爬虫类结构模板

```typescript
import { BaseCrawler } from './BaseCrawler';
import { HotItem } from '../types';

export class [PlatformName]Crawler extends BaseCrawler {
  constructor() {
    super(
      '[platform_key]',      // 平台标识符
      '[Display Name]',      // 显示名称
      '[icon_url]',          // 图标URL
      '[api_or_page_url]'    // API或页面URL
    );
  }

  async crawl(): Promise<HotItem[]> {
    // 实现具体的爬取逻辑
    // 包含错误处理和超时机制
  }
}
```

## 开发优先级建议

### 第一批（高优先级）

1. douyin (抖音)
2. github
3. v2ex
4. qqnews (腾讯新闻)
5. souhu (搜狐)

### 第二批（中优先级）

6. csdn
7. douban (豆瓣)
8. bilibili (已实现)
9. weibo (微博，已实现)
10. zhihu (知乎，已实现)

### 第三批（其他平台）

其余平台按需实现

## 技术注意事项

1. 所有爬虫必须继承BaseCrawler类
2. 实现crawl()方法返回HotItem[]数组
3. 正确设置平台名称、显示名称、图标URL和API地址
4. 添加适当的错误处理和超时机制
5. 使用缓存机制提高性能
6. 遵循TypeScript类型安全原则
7. 考虑反爬虫策略和请求频率限制
8. 确保合法合规的数据抓取行为
