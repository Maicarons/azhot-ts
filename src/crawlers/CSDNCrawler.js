import { BaseCrawler } from './BaseCrawler';
export class CSDNCrawler extends BaseCrawler {
    constructor() {
        super('csdn', 'CSDN', 'https://csdnimg.cn/public/favicon.ico', // 根据Go代码中的图标URL
        'https://blog.csdn.net/phoenix/web/blog/hotRank?&pageSize=100');
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
                    'Accept': 'application/json, text/plain, */*',
                    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                    'Referer': 'https://blog.csdn.net/',
                    'Origin': 'https://blog.csdn.net',
                    'Sec-Fetch-Dest': 'empty',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Site': 'same-origin',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive'
                }
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const items = [];
            for (let index = 0; index < data.data.length; index++) {
                const item = data.data[index];
                items.push({
                    index: index + 1,
                    title: item.articleTitle,
                    url: item.articleDetailUrl,
                    hotValue: parseInt(item.pcHotRankScore) || 0, // 将字符串转换为数字
                });
            }
            return items;
        }
        catch (error) {
            console.error('CSDNCrawler error:', error);
            throw error;
        }
    }
}
