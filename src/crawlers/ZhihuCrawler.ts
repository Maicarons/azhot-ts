import { BaseCrawler } from "./BaseCrawler";
import { HotItem } from "../types";

interface ZhResponse {
  recommend_queries: {
    queries: ZhData[];
  };
}

interface ZhData {
  query: string;
}

export class ZhihuCrawler extends BaseCrawler {
  constructor() {
    super(
      "zhihu",
      "知乎",
      "https://static.zhihu.com/static/favicon.ico", // 根据Go代码中的图标URL更新
      "https://www.zhihu.com/api/v4/search/recommend_query/v2",
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
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
          Accept: "application/json, text/plain, */*",
          "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
          Referer: "https://www.zhihu.com/",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ZhResponse = await response.json();

      // 检查数据是否为空
      if (
        !data.recommend_queries ||
        !data.recommend_queries.queries ||
        data.recommend_queries.queries.length === 0
      ) {
        console.warn("Zhihu API returned empty data");
        return [];
      }

      const queries = data.recommend_queries.queries;
      const items: HotItem[] = [];

      for (let index = 0; index < queries.length; index++) {
        const item = queries[index];
        items.push({
          index: index + 1,
          title: item.query,
          url: `https://www.zhihu.com/search?q=${encodeURIComponent(item.query)}`,
        });
      }

      return items;
    } catch (error) {
      console.error("ZhihuCrawler error:", error);
      throw error;
    }
  }
}
