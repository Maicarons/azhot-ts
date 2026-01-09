import { BaseCrawler } from "./BaseCrawler";
export class DouYinCrawler extends BaseCrawler {
  constructor() {
    super(
      "douyin",
      "douyin",
      "https://lf1-cdn-tos.bytegoofy.com/goofy/ies/douyin_web/public/favicon.ico", // 根据Go代码中的图标URL
      "https://www.iesdouyin.com/web/api/v2/hotsearch/billboard/word/",
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
          Accept: "application/json, text/plain, */*",
          "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
          Referer: "https://www.douyin.com/",
        },
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // 检查数据是否为空
      if (!data.word_list || data.word_list.length === 0) {
        console.warn("DouYin API返回数据为空");
        return [];
      }
      const items = [];
      for (let index = 0; index < data.word_list.length; index++) {
        const item = data.word_list[index];
        // URL 编码标题，确保特殊字符正确处理
        const encodedTitle = encodeURIComponent(item.word);
        const hotValue =
          item.hot_value > 0 ? `${(item.hot_value / 10000).toFixed(2)}万` : "";
        items.push({
          index: index + 1,
          title: item.word,
          url: `https://www.douyin.com/search/${encodedTitle}`,
          hotValue: hotValue ? parseFloat(hotValue) || 0 : 0,
        });
      }
      return items;
    } catch (error) {
      console.error("DouYinCrawler error:", error);
      throw error;
    }
  }
}
