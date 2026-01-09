import { BaseCrawler } from "./BaseCrawler";
export class Search360Crawler extends BaseCrawler {
  constructor() {
    super(
      "360search",
      "360搜索", // 根据Go代码中的名称更新
      "https://ss.360tres.com/static/121a1737750aa53d.ico", // 根据Go代码中的图标URL更新
      "https://ranks.hao.360.com/mbsug-api/hotnewsquery?type=news&realhot_limit=50",
    );
  }
  async crawl() {
    try {
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
      const data = await response.json();
      const items = [];
      for (const item of data) {
        let title = item.title;
        if (item.long_title && item.long_title.trim() !== "") {
          title = item.long_title;
        }
        let hotValue = 0;
        try {
          const hot = parseFloat(item.score);
          // 将热度值转换为"万"单位的字符串
          const hotValueStr = (hot / 10000).toFixed(1) + "万";
          hotValue = hot; // 保存原始数值用于hotValue字段
        } catch (error) {
          // 如果解析失败，则使用默认值
          hotValue = 0;
        }
        items.push({
          index: parseInt(item.rank),
          title: title,
          hotValue: hotValue,
          url: `https://www.so.com/s?q=${encodeURIComponent(title)}`,
        });
      }
      return items;
    } catch (error) {
      console.error("Search360Crawler error:", error);
      throw error;
    }
  }
}
