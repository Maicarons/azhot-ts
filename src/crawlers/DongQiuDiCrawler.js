import { BaseCrawler } from './BaseCrawler';
export class DongQiuDiCrawler extends BaseCrawler {
    constructor() {
        super('dongqiudi', 'dongqiudi', 'https://www.dongqiudi.com/images/dqd-logo.png', // 根据Go代码中的图标URL
        'https://dongqiudi.com/api/v3/archive/pc/index/getIndex');
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
                    'Referer': 'https://dongqiudi.com/'
                }
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // 检查数据是否为空
            if (!data.data || !data.data.new_list || data.data.new_list.length === 0) {
                console.warn('DongQiuDi API返回数据为空');
                return [];
            }
            const items = [];
            for (let index = 0; index < data.data.new_list.length; index++) {
                const item = data.data.new_list[index];
                items.push({
                    index: index + 1,
                    title: item.title,
                    url: item.share,
                });
            }
            return items;
        }
        catch (error) {
            console.error('DongQiuDiCrawler error:', error);
            throw error;
        }
    }
}
