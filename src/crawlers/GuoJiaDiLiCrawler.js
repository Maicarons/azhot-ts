import { BaseCrawler } from './BaseCrawler';
import { extractMatches } from '../utils/crawlerHelper';
export class GuoJiaDiLiCrawler extends BaseCrawler {
    constructor() {
        super('guojiadili', 'guojiadili', 'https://www.dili360.com/favicon.ico', // 根据Go代码中的图标URL
        'https://www.dili360.com/');
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
                    'Referer': 'https://www.dili360.com/'
                }
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            // 使用正则表达式匹配国家地理热门文章
            const pattern = /<li>\s*<span>\d*<\/span>\s*<h3><a href="(.*?)" target="_blank">(.*?)<\/a>/g;
            const matched = extractMatches(html, pattern);
            // 检查是否匹配到数据
            if (matched.length === 0) {
                console.warn('GuoJiaDiLi: 未匹配到数据，可能页面结构已变更');
                return [];
            }
            const items = [];
            for (let index = 0; index < matched.length; index++) {
                const item = matched[index];
                // 添加边界检查
                if (item.length >= 3) {
                    let urlPath = item[1];
                    // 确保 URL 路径正确拼接
                    let fullURL = 'https://www.dili360.com' + urlPath;
                    // 如果已经是完整的 URL，不需要拼接
                    if (urlPath.startsWith('http')) {
                        fullURL = urlPath;
                    }
                    items.push({
                        index: index + 1,
                        title: item[2],
                        url: fullURL,
                    });
                }
            }
            return items;
        }
        catch (error) {
            console.error('GuoJiaDiLiCrawler error:', error);
            throw error;
        }
    }
}
