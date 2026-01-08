import { BaseCrawler } from './BaseCrawler';
import { extractMatches } from '../utils/crawlerHelper';
export class RenminCrawler extends BaseCrawler {
    constructor() {
        super('renmin', '人民网', 'http://www.people.com.cn/favicon.ico', // 根据Go代码中的图标URL
        'http://www.people.com.cn/GB/59476/index.html');
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
                    'Referer': 'http://www.people.com.cn/'
                }
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            // 使用正则表达式匹配人民网页面中的新闻链接
            // Go代码中使用的模式: <li><a href="(.*?)" target="_blank">(.*?)</a></li>
            const pattern = /<li><a\s+href\s*=\s*["']([^"']*)["']\s+target\s*=\s*["']_blank["']>([^<]+)<\/a><\/li>/gi;
            const matches = extractMatches(html, pattern);
            // 检查是否匹配到数据
            if (matches.length === 0) {
                // 尝试另一个常见的链接模式
                const fallbackPattern = /<a\s+href\s*=\s*["']([^"']*)["']\s+target\s*=\s*["']_blank["']>([^<]+)<\/a>/gi;
                const fallbackMatches = extractMatches(html, fallbackPattern);
                if (fallbackMatches.length === 0) {
                    console.warn('Renmin: 未匹配到数据，可能页面结构已变更');
                    return [];
                }
                // 使用备用匹配结果
                const maxItems = 20;
                const items = [];
                for (let index = 0; index < Math.min(fallbackMatches.length, maxItems); index++) {
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
                if (item.length >= 3) {
                    items.push({
                        index: index + 1,
                        title: item[2].trim(),
                        url: item[1],
                    });
                }
            }
            // 确保有有效数据
            if (items.length === 0) {
                console.warn('Renmin: 处理后的数据为空');
                return [];
            }
            return items;
        }
        catch (error) {
            console.error('RenminCrawler error:', error);
            throw error;
        }
    }
}
