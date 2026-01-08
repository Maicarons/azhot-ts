import { BaseCrawler } from './BaseCrawler';
import { HotItem } from '../types';

interface DouBanItem {
  score: number;
  name: string;
  uri: string;
}

export class DouBanCrawler extends BaseCrawler {
  constructor() {
    super(
      'douban',
      'douban',
      'https://www.douban.com/favicon.ico', // 根据Go代码中的图标URL
      'https://m.douban.com/rexxar/api/v2/chart/hot_search_board?count=10&start=0'
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
          'Referer': 'https://www.douban.com/gallery/',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
        }
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const items: DouBanItem[] = await response.json();

      // 检查数据是否为空
      if (!items || items.length === 0) {
        console.warn('DouBan API返回数据为空');
        return [];
      }

      const hotItems: HotItem[] = [];
      for (let index = 0; index < items.length; index++) {
        const item = items[index];
        
        // 计算热度值
        let hotValue = '';
        if (item.score > 0) {
          hotValue = `${(item.score / 10000).toFixed(2)}万`;
        }

        // 转换链接格式：将 douban://douban.com/search/result?q=... 格式转换为 https://www.douban.com/search?q=... 格式
        let convertedURL = item.uri;
        if (item.uri.startsWith('douban://douban.com/search/result')) {
          // 提取查询参数部分
          const queryStart = item.uri.indexOf('?');
          if (queryStart !== -1) {
            convertedURL = 'https://www.douban.com/search' + item.uri.substring(queryStart);
          } else {
            convertedURL = 'https://www.douban.com/search';
          }
        }

        hotItems.push({
          index: index + 1,
          title: item.name,
          url: convertedURL,
          hotValue: hotValue ? parseFloat(hotValue) || 0 : 0,
        });
      }

      return hotItems;
    } catch (error) {
      console.error('DouBanCrawler error:', error);
      throw error;
    }
  }
}