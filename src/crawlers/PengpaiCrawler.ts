import { BaseCrawler } from "./BaseCrawler";
import { HotItem } from "../types";

interface PengpaiResponse {
  data: {
    hotNews: Array<{
      name: string;
      contId: string;
    }>;
  };
}

export class PengpaiCrawler extends BaseCrawler {
  constructor() {
    super(
      "pengpai",
      "澎湃新闻",
      "https://www.thepaper.cn/favicon.ico", // 根据Go代码中的图标URL
      "https://cache.thepaper.cn/contentapi/wwwIndex/rightSidebar",
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
          Referer: "https://www.thepaper.cn/",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PengpaiResponse = await response.json();

      // 检查数据是否为空
      if (data.data.hotNews.length === 0) {
        console.warn("Pengpai: API返回数据为空");
        return [];
      }

      const hotNews = data.data.hotNews;
      const items: HotItem[] = [];

      for (let index = 0; index < hotNews.length; index++) {
        const item = hotNews[index];

        // 确保 ContId 不为空
        if (item.contId === "") {
          continue; // 跳过没有 ContId 的新闻
        }

        items.push({
          index: index + 1,
          title: item.name,
          url: `https://www.thepaper.cn/newsDetail_forward_${item.contId}`,
        });
      }

      // 如果所有数据都因为没有 ContId 被跳过
      if (items.length === 0) {
        console.warn("Pengpai: API返回数据格式异常，缺少必要字段");
        return [];
      }

      return items;
    } catch (error) {
      console.error("PengpaiCrawler error:", error);
      throw error;
    }
  }
}
