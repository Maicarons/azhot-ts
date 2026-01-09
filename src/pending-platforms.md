# 待实现平台列表

根据Go代码中的list.go概念和项目需求，以下是待实现的平台爬虫列表：

## 社交媒体类

- [ ] tieba (百度贴吧)
- [ ] douyin (抖音)
- [ ] kuaishou (快手)

## 视频平台类

- [ ] iqiyi (爱奇艺)
- [ ] tengxunkt (腾讯视频)
- [ ] youku (优酷)
- [ ] mgtv (芒果TV)
- [ ] acfun (AcFun)

## 新闻资讯类

- [ ] sohu (搜狐)
- [ ] ifeng (凤凰新闻)
- [ ] huanqiu (环球网)
- [ ] guancha (观察者网)

## 生活服务类

- [ ] meituan (美团)
- [ ] ele (饿了么)

## 电商购物类

- [ ] jd (京东)
- [ ] tmall (天猫)
- [ ] taobao (淘宝)
- [ ] suning (苏宁易购)
- [ ] pdd (拼多多)

## 金融财经类

- [ ] xueqiu (雪球)
- [ ] eastmoney (东方财富)
- [ ] hexun (和讯网)

## 技术社区类

- [ ] cnblogs (博客园)
- [ ] csdn (CSDN)
- [ ] oschina (开源中国)
- [ ] v2ex (V2EX)

## 娱乐休闲类

- [ ] douban (豆瓣)
- [ ] tianya (天涯论坛)

## 物流快递类

- [ ] kuaidi (快递100)

## 每个平台需要实现的要素

### 1. 爬虫类结构

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
  }
}
```

### 2. API端点集成

- 自动集成到现有的`/:platform`路由
- 支持缓存机制
- 支持WebSocket实时推送

### 3. 错误处理

- 网络请求超时处理
- 数据解析错误处理
- 降级方案（返回缓存数据）

### 4. 类型安全

- 遵循HotItem接口定义
- 提供适当的类型注解
- 错误处理的类型安全

## 实现优先级

### 高优先级 (用户常用)

1. tieba (百度贴吧)
2. douyin (抖音)
3. kuaishou (快手)
4. jd (京东)
5. taobao (淘宝)

### 中优先级 (重要平台)

6. iqiyi (爱奇艺)
7. tengxunkt (腾讯视频)
8. youku (优酷)
9. sohu (搜狐)
10. douban (豆瓣)

### 低优先级 (补充平台)

11. 其他剩余平台

## 实现步骤模板

对于每个平台，需要执行以下步骤：

1. 创建爬虫类文件: `src/crawlers/[PlatformName]Crawler.ts`
2. 在CrawlerManager中注册爬虫
3. 测试API端点: `curl http://localhost:8080/[platform_key]`
4. 验证数据格式是否符合HotItem接口
5. 确认图标和显示名称正确
6. 实现错误处理和超时机制
7. 验证缓存机制正常工作
