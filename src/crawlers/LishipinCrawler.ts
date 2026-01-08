import { BaseCrawler } from './BaseCrawler';
import { HotItem } from '../types';
import { extractMatches } from '../utils/crawlerHelper';

export class LishipinCrawler extends BaseCrawler {
  constructor() {
    super(
      'lishipin',
      '梨视频',
      'https://page.pearvideo.com/webres/img/logo.png', // 根据Go代码中的图标URL
      'https://www.pearvideo.com/popular'
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
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
          'Referer': 'https://www.pearvideo.com/'
        }
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();

      // 使用正则表达式匹配梨视频的热搜数据
      const pattern = /<a\shref="(.*?)".*?>\s*<h2\sclass="popularem-title">(.*?)<\/h2>\s*<p\sclass="popularem-abs padshow">(.*?)<\/p>/g;
      const matches = extractMatches(html, pattern);

      // 检查是否匹配到数据
      if (matches.length === 0) {
        console.warn('Lishipin: 未匹配到数据，可能页面结构已变更');
        return [];
      }

      const items: HotItem[] = [];
      for (let index = 0; index < matches.length; index++) {
        const item = matches[index];
        // 添加边界检查
        if (item.length >= 4) {
          items.push({
            index: index + 1,
            title: item[2],
            url: 'https://www.pearvideo.com/' + item[1],
            desc: item[3],
          });
        }
      }

      // 确保有有效数据
      if (items.length === 0) {
        console.warn('Lishipin: 处理后的数据为空');
        return [];
      }

      return items;
    } catch (error) {
      console.error('LishipinCrawler error:', error);
      throw error;
    }
  }
}