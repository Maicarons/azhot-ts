import { BaseCrawler } from "./BaseCrawler";
import { HotItem } from "../types";
import { extractMatches } from "../utils/crawlerHelper";

export class RenminCrawler extends BaseCrawler {
  constructor() {
    super(
      "renmin",
      "人民网",
      "http://www.people.com.cn/favicon.ico",
      "http://www.people.com.cn/GB/59476/index.html",
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
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
          Referer: "http://www.people.com.cn/",
        },
      });

      clearTimeout(timeoutId);

      if (response.status !== 200) {
        throw new Error(
          `HTTP request failed with status code: ${response.status}`,
        );
      }

      const html = await response.text();

      // 根据提供的HTML内容，新的正则表达式应该匹配包含href和target="_blank"的<a>标签
      const pattern =
        /<a\s+href\s*=\s*["']([^"']*)["']\s+target\s*=\s*["']_blank["']\s+rel\s*=\s*["']noopener["']>([^<]+)<\/a>/gi;
      const matches = extractMatches(html, pattern);

      // 检查是否匹配到数据
      if (matches.length === 0) {
        console.warn("Renmin: 未匹配到数据，可能页面结构已变更");
        return []; // 返回空数组而不是错误，与Go代码逻辑一致
      }

      // 处理匹配结果
      const items: HotItem[] = [];
      for (let index = 0; index < matches.length; index++) {
        const item = matches[index];
        // 添加边界检查
        if (item.length >= 3) {
          items.push({
            index: index + 1,
            title: item[2].trim(),
            url: item[1],
          });
        }
      }

      return items;
    } catch (error) {
      console.error("RenminCrawler error:", error);
      throw error;
    }
  }
}
