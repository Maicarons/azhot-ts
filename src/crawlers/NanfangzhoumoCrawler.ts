import { BaseCrawler } from './BaseCrawler';
import { HotItem } from '../types';

interface NanfangzhoumoResponse {
  data: {
    hot_contents: Array<{
      subject: string;
      id: number;
    }>
  }
}

export class NanfangzhoumoCrawler extends BaseCrawler {
  constructor() {
    super(
      'nanfangzhoumo',
      '南方周末',
      'https://www.infzm.com/favicon.ico', // 根据Go代码中的图标URL
      'https://www.infzm.com/hot_contents?format=json'
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
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
          'Referer': 'https://www.infzm.com/'
        }
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: NanfangzhoumoResponse = await response.json();

      const wordList = data.data.hot_contents;

      // 检查数据是否为空
      if (wordList.length === 0) {
        console.warn('Nanfangzhoumo: API返回数据为空');
        return [];
      }

      const items: HotItem[] = [];
      for (let index = 0; index < wordList.length; index++) {
        const item = wordList[index];
        items.push({
          index: index + 1,
          title: item.subject,
          url: `https://www.infzm.com/contents/${item.id}`,
        });
      }

      return items;
    } catch (error) {
      console.error('NanfangzhoumoCrawler error:', error);
      throw error;
    }
  }
}