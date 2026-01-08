import { BaseCrawler } from './BaseCrawler';
export class ShaoShuPaiCrawler extends BaseCrawler {
    constructor() {
        super('shaoshupai', '少数派', 'https://cdn-static.sspai.com/favicon/sspai.ico', 'https://sspai.com/api/v1/article/tag/page/get?limit=100000&tag=%E7%83%AD%E9%97%A8%E6%96%87%E7%AB%A0');
    }
    async crawl() {
        try {
            // 创建带超时的请求
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时
            const response = await fetch(this.url, {
                signal: controller.signal,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                    'Accept': 'application/json',
                    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
                }
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const jsonData = await response.json();
            // 检查数据是否为空
            if (!jsonData.data || jsonData.data.length === 0) {
                console.warn('ShaoShuPai: API返回数据为空');
                return [];
            }
            // 处理数据
            const data = jsonData.data;
            const maxItems = 20; // 限制返回数量
            const items = [];
            for (let index = 0; index < Math.min(data.length, maxItems); index++) {
                const item = data[index];
                items.push({
                    index: index + 1,
                    title: item.title,
                    url: `https://sspai.com/post/${item.id}`,
                });
            }
            return items;
        }
        catch (error) {
            console.error('ShaoShuPaiCrawler error:', error);
            throw error;
        }
    }
}
