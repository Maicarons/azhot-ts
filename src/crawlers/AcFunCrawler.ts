import { BaseCrawler } from './BaseCrawler';
import { HotItem } from '../types';

interface AcFunResponse {
  rankList: AcFunData[];
}

interface AcFunData {
  contentTitle: string;
  shareUrl: string;
}

export class AcFunCrawler extends BaseCrawler {
  constructor() {
    super(
      'acfun',
      'AcFun',
      'https://cdn.aixifan.com/ico/favicon.ico', // 根据Go代码中的图标URL
      'https://www.acfun.cn/rest/pc-direct/rank/channel?channelId=&subChannelId=&rankLimit=30&rankPeriod=DAY'
    );
  }

  async crawl(): Promise<HotItem[]> {
    try {
      // 创建带超时的请求
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时
      
      const response = await fetch(this.url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
        }
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AcFunResponse = await response.json();

      const items: HotItem[] = [];
      for (let index = 0; index < data.rankList.length; index++) {
        const item = data.rankList[index];
        items.push({
          index: index + 1,
          title: item.contentTitle,
          url: item.shareUrl,
        });
      }

      return items;
    } catch (error) {
      console.error('AcFunCrawler error:', error);
      throw error;
    }
  }
}