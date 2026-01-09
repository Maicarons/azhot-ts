import { BaseCrawler } from "./BaseCrawler";
export class QqnewsCrawler extends BaseCrawler {
  constructor() {
    super(
      "qqnews",
      "腾讯新闻",
      "https://mat1.gtimg.com/qqcdn/qqindex2021/favicon.ico", // 根据Go代码中的图标URL
      "https://r.inews.qq.com/gw/event/hot_ranking_list?page_size=51",
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
          Referer: "https://news.qq.com/",
        },
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // 检查数据是否为空或格式不正确
      if (data.idlist.length === 0 || data.idlist[0].newslist.length === 0) {
        console.warn("Qqnews: API返回数据为空");
        return [];
      }
      // 获取新闻列表数据
      const newsListData = data.idlist[0].newslist;
      const items = [];
      for (let index = 0; index < newsListData.length; index++) {
        const item = newsListData[index];
        // 跳过第一个项目（根据Go代码逻辑）
        if (index === 0) {
          continue;
        }
        const hot = item.hotEvent.hotScore / 10000;
        const hotValue = `${hot.toFixed(1)}万`;
        items.push({
          index: index,
          title: item.title,
          url: item.url,
          desc: `${item.time} 热度: ${hotValue}`, // 将时间和热度信息放在desc中
        });
      }
      return items;
    } catch (error) {
      console.error("QqnewsCrawler error:", error);
      throw error;
    }
  }
}
