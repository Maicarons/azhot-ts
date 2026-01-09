import { BaseCrawler } from "./BaseCrawler";
import { HotItem } from "../types";

interface QuarkResponse {
  data: {
    hotNews: {
      item: Array<{
        url: string;
        title: string;
        hot: string;
      }>;
    };
  };
}

export class QuarkCrawler extends BaseCrawler {
  constructor() {
    super(
      "quark",
      "夸克",
      "https://gw.alicdn.com/imgextra/i3/O1CN018r2tKf28YP7ev0fPF_!!6000000007944-2-tps-48-48.png", // 根据Go代码中的图标URL
      "https://biz.quark.cn/api/trending/ranking/getNewsRanking?modules=hotNews&uc_param_str=dnfrpfbivessbtbmnilauputogpintnwmtsvcppcprsnnnchmicckpgixsnx",
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
          Referer: "https://quark.cn/",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: QuarkResponse = await response.json();

      // 检查数据是否为空
      if (data.data.hotNews.item.length === 0) {
        console.warn("Quark: API返回数据为空");
        return [];
      }

      const itemsData = data.data.hotNews.item;
      const items: HotItem[] = [];

      for (let i = 0; i < itemsData.length; i++) {
        const item = itemsData[i];

        // 尝试解析热度值，如果失败则使用默认值0
        let hot = 0;
        try {
          hot = parseFloat(item.hot);
        } catch (err) {
          hot = 0;
        }

        items.push({
          index: i + 1,
          title: item.title,
          url: item.url,
          desc: `${(hot / 10000).toFixed(1)}万`, // 将热度值转换为"X.X万"的格式
        });
      }

      return items;
    } catch (error) {
      console.error("QuarkCrawler error:", error);
      throw error;
    }
  }
}
