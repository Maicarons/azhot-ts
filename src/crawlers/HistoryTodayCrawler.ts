import { BaseCrawler } from './BaseCrawler';
import { HotItem } from '../types';

// 辅助函数：移除HTML标签
function stripHTML(htmlString: string): string {
  // 使用正则表达式移除HTML标签
  return htmlString.replace(/<[^>]*>/g, '');
}

export class HistoryTodayCrawler extends BaseCrawler {
  constructor() {
    super(
      'historytoday',
      'historytoday',
      'https://baike.baidu.com/favicon.ico', // 根据Go代码中的图标URL
      '' // URL将在运行时动态生成
    );
  }

  async crawl(): Promise<HotItem[]> {
    try {
      // 获取当前日期
      const now = new Date();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      
      // 构造API URL
      const url = `https://baike.baidu.com/cms/home/eventsOnHistory/${month}.json`;

      // 创建带超时的请求
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时
      
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
          'Referer': 'https://baike.baidu.com/'
        }
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const resultMap: Record<string, any> = await response.json();

      // 检查数据结构
      const monthData = resultMap[month] as Record<string, any>;
      if (!monthData) {
        throw new Error('API返回数据格式异常: 月份数据不存在');
      }

      const date = month + day;
      const dateListInterface = monthData[date];
      if (!dateListInterface) {
        throw new Error(`今天(${month}月${day}日)没有历史事件数据`);
      }

      const dateList = dateListInterface as any[];
      if (!Array.isArray(dateList)) {
        throw new Error('API返回数据格式异常: 日期列表格式不正确');
      }

      // 检查数据是否为空
      if (dateList.length === 0) {
        console.warn(`今天(${month}月${day}日)没有历史事件数据`);
        return [];
      }

      const items: HotItem[] = [];
      for (let index = 0; index < dateList.length; index++) {
        const item = dateList[index];
        if (typeof item !== 'object' || item === null) {
          continue; // 跳过格式不正确的项
        }

        // 提取标题
        const title = item['title'];
        if (typeof title !== 'string') {
          continue;
        }

        // 提取链接
        let urlStr = '';
        const urlInterface = item['link'];
        if (typeof urlInterface === 'string') {
          urlStr = urlInterface;
        }

        items.push({
          index: index + 1,
          title: stripHTML(title),
          url: urlStr,
        });
      }

      return items;
    } catch (error) {
      console.error('HistoryTodayCrawler error:', error);
      throw error;
    }
  }
}