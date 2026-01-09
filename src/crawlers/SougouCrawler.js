import { BaseCrawler } from "./BaseCrawler";
import { extractMatches } from "../utils/crawlerHelper";
export class SougouCrawler extends BaseCrawler {
  constructor() {
    super(
      "sougou",
      "搜狗",
      "https://www.sogou.com/favicon.ico",
      "https://www.sogou.com/web?query=%E6%90%9C%E7%8B%97%E7%83%AD%E6%90%9C",
    );
  }
  async crawl() {
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
        },
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const html = await response.text();
      // 使用正则表达式匹配搜狗页面中的热搜数据
      // Go代码中的模式: <span [^>]*>[\s\S]*?<p>\s*<a href="([^"]+)"[^>]*>(.*?)</a>\s*</p>[\s\S]*?</span>\s*<span class="hot-rank-right">(.*?)</span>
      const pattern =
        /<span [^>]*>[\s\S]*?<p>\s*<a href="([^"]+)"[^>]*>(.*?)<\/a>\s*<\/p>[\s\S]*?<\/span>\s*<span class="hot-rank-right">(.*?)<\/span>/gi;
      const matches = extractMatches(html, pattern);
      // 检查是否匹配到数据
      if (matches.length === 0) {
        // 尝试另一个常见的链接模式
        const fallbackPattern = /<a[^>]+href="([^"]+)"[^>]*>([^<]+)<\/a>/gi;
        const fallbackMatches = extractMatches(html, fallbackPattern);
        if (fallbackMatches.length === 0) {
          console.warn("Sougou: 未匹配到数据，可能页面结构已变更");
          return [];
        }
        // 使用备用匹配结果
        const maxItems = 20;
        const items = [];
        for (
          let index = 0;
          index < Math.min(fallbackMatches.length, maxItems);
          index++
        ) {
          const item = fallbackMatches[index];
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
      }
      // 处理主要匹配结果
      const maxItems = 20;
      const items = [];
      for (let index = 0; index < Math.min(matches.length, maxItems); index++) {
        const item = matches[index];
        // 添加边界检查
        if (item.length >= 4) {
          // 尝试将热度值转换为数字
          let hotValueNum;
          const hotValueStr = item[3].trim();
          const parsedHotValue = parseFloat(
            hotValueStr.replace(/[^\d.-]/g, ""),
          );
          if (!isNaN(parsedHotValue)) {
            hotValueNum = parsedHotValue;
          }
          items.push({
            index: index + 1,
            title: item[2].trim(),
            url: item[1],
            hotValue: hotValueNum, // 热度值
          });
        }
      }
      // 确保有有效数据
      if (items.length === 0) {
        console.warn("Sougou: 处理后的数据为空");
        return [];
      }
      return items;
    } catch (error) {
      console.error("SougouCrawler error:", error);
      throw error;
    }
  }
}
