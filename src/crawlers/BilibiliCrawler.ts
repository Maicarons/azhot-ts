import { BaseCrawler } from "./BaseCrawler";
import { HotItem } from "../types";

interface BilibiliResponse {
  data: BilibiliList;
}

interface BilibiliList {
  list: BilibiliData[];
}

interface BilibiliData {
  title: string;
  bvid: string;
}

export class BilibiliCrawler extends BaseCrawler {
  constructor() {
    super(
      "bilibili",
      "哔哩哔哩",
      "https://static.hdslb.com/mobile/img/512.png", // 根据Go代码中的图标URL更新
      "https://api.bilibili.com/x/web-interface/ranking/v2?tid=0&type=all",
    );
  }

  async crawl(): Promise<HotItem[]> {
    try {
      // 创建带超时和用户代理的 HTTP 请求
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时

      const response = await fetch(this.url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const resultMap: BilibiliResponse = await response.json();

      // 检查数据是否为空
      if (
        !resultMap.data ||
        !resultMap.data.list ||
        resultMap.data.list.length === 0
      ) {
        console.error("Bilibili API返回数据为空或格式不正确");
        return [];
      }

      const hotItems: HotItem[] = [];
      for (let i = 0; i < resultMap.data.list.length; i++) {
        const item = resultMap.data.list[i];
        hotItems.push({
          index: i + 1,
          title: item.title,
          url: `https://www.bilibili.com/video/${item.bvid}`,
        });
      }

      return hotItems;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.error("Bilibili API请求超时");
      } else {
        console.error(`Error crawling Bilibili: ${error}`);
      }
      return [];
    }
  }
}
