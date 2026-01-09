import { BaseCrawler } from "./BaseCrawler";
import { HotItem } from "../types";
import { extractMatches } from "../utils/crawlerHelper";

export class Doc360Crawler extends BaseCrawler {
  constructor() {
    super(
      "360doc",
      "360doc",
      "https://www.360doc.cn/favicon.ico", // 根据Go代码中的图标URL更新
      "http://www.360doc.com/",
    );
  }

  async crawl(): Promise<HotItem[]> {
    try {
      // 使用 node-fetch 替代 Go 的 http.Client
      // 创建带超时的请求
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时

      const response = await fetch(this.url, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();

      // 匹配模式：提取链接和标题
      const pattern =
        /<div class=" num\d* yzphlist hei"><a href="(.*?)".*?>(?:<span class="icon_yuan2"><\/span>)?(.*?)<\/a><\/div>/g;
      const matched = extractMatches(html, pattern);

      const items: HotItem[] = [];
      matched.forEach((item, index) => {
        if (item.length >= 3) {
          items.push({
            index: index + 1,
            title: item[2].trim(),
            url: item[1],
            desc: item[2].trim(), // 描述可以是标题本身
            hotValue: 0, // 360doc可能没有热度值，设为0
          });
        }
      });

      return items;
    } catch (error) {
      console.error("Doc360Crawler error:", error);
      throw error;
    }
  }
}
