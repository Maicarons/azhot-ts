import { BaseCrawler } from './BaseCrawler';
import { extractMatches } from '../utils/crawlerHelper';
export class HuPuCrawler extends BaseCrawler {
    constructor() {
        super('hupu', 'hupu', 'https://www.hupu.com/favicon.ico', // 根据Go代码中的图标URL
        'https://www.hupu.com/');
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
                    'Referer': 'https://www.hupu.com/'
                }
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            // 使用正则表达式匹配虎扑热门文章
            const pattern = /<a\s+href="([^"]+)"[^>]+>\s*<div[^>]+>\s*<div[^>]+>\d+<\/div>\s*<div[^>]+>(.*?)<\/div>/g;
            const matches = extractMatches(html, pattern);
            // 检查是否匹配到数据
            if (matches.length === 0) {
                console.warn('HuPu: 未匹配到数据，可能页面结构已变更');
                return [];
            }
            const items = [];
            for (let index = 0; index < matches.length; index++) {
                const item = matches[index];
                // 添加边界检查
                if (item.length >= 3) {
                    let url = item[1];
                    const title = item[2];
                    // 确保 URL 是完整的
                    if (url && url.startsWith('/')) {
                        url = 'https://www.hupu.com' + url;
                    }
                    items.push({
                        index: index + 1,
                        title: title,
                        url: url,
                    });
                }
            }
            return items;
        }
        catch (error) {
            console.error('HuPuCrawler error:', error);
            throw error;
        }
    }
}
