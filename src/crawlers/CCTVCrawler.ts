import { BaseCrawler } from './BaseCrawler';
import { HotItem } from '../types';

interface CCTVResponse {
  data: {
    list: {
      title: string;
      url: string;
    }[];
  };
}

export class CCTVCrawler extends BaseCrawler {
  constructor() {
    super(
      'cctv',
      'cctv', // 根据Go代码中的名称
      'https://news.cctv.com/favicon.ico', // 根据Go代码中的图标URL
      'https://news.cctv.com/2019/07/gaiban/cmsdatainterface/page/world_1.jsonp'
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
          'Referer': 'https://news.cctv.com/'
        }
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();

      // 检查响应长度是否足够
      if (responseText.length <= 7) { // 至少需要回调函数名+括号+内容
        console.error('API返回数据长度不足');
        return [];
      }

      // 解析JSONP响应，移除回调函数包裹，获取JSON数据
      // 假设JSONP格式为 callback({...}) 或类似结构
      // 根据Go代码，需要去掉前6个字符和后1个字符
      let jsonData = responseText;
      if (responseText.startsWith('callback(') && responseText.endsWith(')')) {
        // 如果是标准JSONP格式
        jsonData = responseText.substring(9, responseText.length - 1);
      } else if (responseText.length > 7) {
        // 根据Go代码的逻辑，截取中间部分
        // Go代码中是 pageBytes[6:len(pageBytes)-1]，即去掉前6个和最后1个字节
        const bytes = new TextEncoder().encode(responseText);
        const trimmedBytes = bytes.subarray(6, bytes.length - 1);
        jsonData = new TextDecoder().decode(trimmedBytes);
      }

      let parsedData: CCTVResponse;
      try {
        parsedData = JSON.parse(jsonData);
      } catch (parseError) {
        console.error('JSON解析错误:', parseError);
        console.error('尝试解析的数据:', jsonData.substring(0, 200) + '...');
        return [];
      }

      // 检查数据是否为空
      if (!parsedData.data || !parsedData.data.list || parsedData.data.list.length === 0) {
        console.warn('CCTV API返回数据为空');
        return [];
      }

      const items: HotItem[] = [];
      for (let index = 0; index < parsedData.data.list.length; index++) {
        const item = parsedData.data.list[index];
        items.push({
          index: index + 1,
          title: item.title,
          url: item.url,
        });
      }

      return items;
    } catch (error) {
      console.error('CCTVCrawler error:', error);
      throw error;
    }
  }
}