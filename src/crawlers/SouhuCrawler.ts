import { BaseCrawler } from './BaseCrawler';
import { HotItem } from '../types';

interface SouhuResponse {
  newsArticles: NewsArticle[];
}

interface NewsArticle {
  title: string;
  h5Link: string;
  score: string;
}

async function fetchSouhuPage(page: number): Promise<NewsArticle[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时

  const url = `https://3g.k.sohu.com/api/channel/hotchart/hotnews.go?p1=NjY2NjY2&page=${page}`;
  
  const response = await fetch(url, {
    signal: controller.signal,
    headers: {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
      'Accept': 'application/json',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'Referer': 'https://3g.k.sohu.com/',
      'X-Requested-With': 'XMLHttpRequest'
    }
  });

  clearTimeout(timeoutId);

  if (!response.ok) {
    throw new Error(`fetch page ${page}: HTTP error! status: ${response.status}`);
  }

  const jsonData: SouhuResponse = await response.json();
  return jsonData.newsArticles || [];
}

export class SouhuCrawler extends BaseCrawler {
  constructor() {
    super(
      'souhu',
      '搜狐',
      'https://3g.k.sohu.com/favicon.ico',
      'https://3g.k.sohu.com/api/channel/hotchart/hotnews.go?p1=NjY2NjY2&page=1'
    );
  }

  async crawl(): Promise<HotItem[]> {
    try {
      // 并发获取两个页面的数据
      const pagePromises = [1, 2].map(page => fetchSouhuPage(page));
      const results = await Promise.allSettled(pagePromises);
      
      let wordList: NewsArticle[] = [];
      const fetchErrors: Error[] = [];

      // 处理结果
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.status === 'fulfilled') {
          wordList = wordList.concat(result.value);
        } else {
          fetchErrors.push(result.reason);
        }
      }

      // 如果有错误发生，检查是否至少获取到一些数据
      if (fetchErrors.length > 0) {
        // 如果完全没有获取到数据，抛出错误
        if (wordList.length === 0) {
          console.error('获取搜狐数据失败:', fetchErrors);
          throw new Error(`获取数据失败: ${fetchErrors.map(e => e.message).join(', ')}`);
        }
        // 如果获取到部分数据，继续处理但记录错误
        console.warn('部分页面获取失败，但继续处理已获取的数据:', fetchErrors);
      }

      // 检查数据是否为空
      if (wordList.length === 0) {
        console.warn('Souhu: API返回数据为空');
        return [];
      }

      // 处理数据
      const maxItems = 20; // 限制返回数量
      const items: HotItem[] = [];
      
      for (let index = 0; index < Math.min(wordList.length, maxItems); index++) {
        const item = wordList[index];
        
        // 尝试将热度值转换为数字
        let hotValueNum: number | undefined;
        let hotValueStr: string | undefined;
        
        try {
          const hotValue = parseFloat(item.score);
          if (!isNaN(hotValue)) {
            hotValueNum = hotValue;
            hotValueStr = `${hotValue.toFixed(2)}万`; // 根据Go代码格式化为"X.XX万"
          }
        } catch (e) {
          console.warn(`解析热度值失败: ${item.score}`, e);
        }
        
        items.push({
          index: index + 1,
          title: item.title,
          url: item.h5Link,
          hotValue: hotValueNum, // 使用数字类型的热度值
        });
      }

      return items;
    } catch (error) {
      console.error('SouhuCrawler error:', error);
      throw error;
    }
  }
}