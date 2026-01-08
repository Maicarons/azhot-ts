import { BaseCrawler } from './BaseCrawler';
import { extractMatches } from '../utils/crawlerHelper';
export class GitHubCrawler extends BaseCrawler {
    constructor() {
        super('github', 'GitHub', 'https://github.githubassets.com/favicons/favicon.png', // 根据Go代码中的图标URL
        'https://github.com/trending');
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
                    'Referer': 'https://github.com/'
                }
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            // 使用正则表达式匹配GitHub Trending数据
            const pattern = /<span\s+data-view-component="true"\s+class="text-normal">\s*([^<]+)\s*<\/span>\s*([^<]+)<\/a>\s*<\/h2>\s*<p\sclass="col-9 color-fg-muted my-1 pr-4">\s*([^<]+)\s*<\/p>/g;
            const matched = extractMatches(html, pattern);
            // 检查是否匹配到数据
            if (matched.length === 0) {
                console.warn('GitHub: 未匹配到 trending 数据，可能页面结构已变更');
                return [];
            }
            const items = [];
            for (let index = 0; index < matched.length; index++) {
                const item = matched[index];
                // 添加边界检查
                if (item.length >= 4) {
                    // 清理用户名和仓库名
                    const user = item[1].trim();
                    const repo = item[2].trim();
                    // 合并并移除所有空格
                    const trimmed = (user + repo).replace(/\s+/g, '');
                    const desc = item[3] ? item[3].trim() : '';
                    items.push({
                        index: index + 1,
                        title: trimmed,
                        desc: desc,
                        url: `https://github.com/${trimmed}`,
                    });
                }
            }
            return items;
        }
        catch (error) {
            console.error('GitHubCrawler error:', error);
            throw error;
        }
    }
}
