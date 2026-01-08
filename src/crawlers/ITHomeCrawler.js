import { BaseCrawler } from './BaseCrawler';
import { extractMatches } from '../utils/crawlerHelper';
export class ITHomeCrawler extends BaseCrawler {
    constructor() {
        super('ithome', 'ithome', 'https://www.ithome.com/favicon.ico', // 根据Go代码中的图标URL
        'https://m.ithome.com/rankm/');
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
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                    'Referer': 'https://m.ithome.com/'
                }
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            // 使用正则表达式匹配IT之家移动端的热搜数据
            const pattern = /<a href="(https:\/\/m\.ithome\.com\/html\/\d+\.htm)"[^>]*>[\s\S]*?<p class="plc-title">([^<]+)<\/p>/g;
            const matches = extractMatches(html, pattern);
            // 检查是否匹配到数据
            if (matches.length === 0) {
                console.warn('ITHome: 未匹配到数据，可能页面结构已变更');
                return [];
            }
            // 确定要取多少条数据（最多12条）
            let count = matches.length;
            if (count > 12) {
                count = 12;
            }
            const items = [];
            for (let index = 0; index < count; index++) {
                const item = matches[index];
                // 添加边界检查
                if (item.length >= 3) {
                    items.push({
                        index: index + 1,
                        title: item[2],
                        url: item[1],
                    });
                }
            }
            // 确保有有效数据
            if (items.length === 0) {
                console.warn('ITHome: 处理后的数据为空');
                return [];
            }
            return items;
        }
        catch (error) {
            console.error('ITHomeCrawler error:', error);
            throw error;
        }
    }
}
