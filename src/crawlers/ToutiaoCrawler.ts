import { BaseCrawler } from './BaseCrawler';
import { HotItem } from '../types';

interface TTResponse {
  data: TTData[];
}

interface TTData {
  Title: string;
  Url: string;
  HotValue: string;
}

export class ToutiaoCrawler extends BaseCrawler {
  constructor() {
    super(
      'toutiao',
      '今日头条',
      'https://sf3-cdn-tos.douyinstatic.com/obj/eden-cn/uhbfnupkbps/toutiao_favicon.ico', // 根据Go代码中的图标URL更新
      'https://www.toutiao.com/hot-event/hot-board/?origin=toutiao_pc'
    );
  }

  async crawl(): Promise<HotItem[]> {
    try {
      // 创建带超时的请求
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时
      
      const response = await fetch(this.url, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TTResponse = await response.json();

      // 检查数据是否为空
      if (!data.data || data.data.length === 0) {
        console.warn('Toutiao API returned empty data');
        return [];
      }

      const items: HotItem[] = [];
      for (let index = 0; index < data.data.length; index++) {
        const item = data.data[index];
        let hotValue = 0;
        try {
          const parsedHot = parseFloat(item.HotValue);
          hotValue = isNaN(parsedHot) ? 0 : parsedHot;
        } catch (error) {
          // 解析失败时使用默认值
          hotValue = 0;
        }

        items.push({
          index: index + 1,
          title: item.Title,
          url: item.Url,
          hotValue: hotValue
        });
      }

      return items;
    } catch (error) {
      console.error('ToutiaoCrawler error:', error);
      throw error;
    }
  }
}