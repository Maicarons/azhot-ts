import { BaseCrawler } from './BaseCrawler';
import { extractMatches } from '../utils/crawlerHelper';
export class WeiboCrawler extends BaseCrawler {
    constructor() {
        super('weibo', '微博', 'https://weibo.com/favicon.ico', // 根据Go代码中的图标URL更新
        'https://s.weibo.com/top/summary');
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
                    'Cookie': 'SUB=_2AkMasdasdqadTy2Pna4Rl77p7cJZAXC',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                    'Referer': 'https://s.weibo.com/'
                }
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            // 使用正则表达式提取热搜数据
            const items = [];
            // 正则表达式匹配热搜条目 - 与Go代码保持一致
            const pattern = /<a href="(\/weibo\?q=[^"]+)"[^>]*target="_blank">([^<]+)<\/a>\s*<span>([^<]*)?<\/span>/g;
            const matched = extractMatches(html, pattern);
            // 预编译正则表达式，用于清理热度值中的非数字字符
            const nonDigitRegex = /[^\d]/g;
            for (let index = 0; index < matched.length; index++) {
                const item = matched[index];
                if (item.length >= 3) {
                    const title = item[2].trim();
                    const url = 'https://s.weibo.com' + item[1];
                    let hotValue = '';
                    if (item.length >= 4) {
                        hotValue = item[3].trim();
                    }
                    // 清理热度值中的非数字字符
                    if (hotValue !== '') {
                        hotValue = hotValue.replace(nonDigitRegex, '').trim();
                    }
                    items.push({
                        index: index + 1,
                        title: title,
                        url: url,
                        hotValue: hotValue ? parseInt(hotValue) || 0 : 0
                    });
                }
            }
            // 如果正则匹配失败，尝试备用方法
            if (items.length === 0) {
                const fallbackItems = await this.extractWeiboHotSearchFallback(html);
                if (fallbackItems.length > 0) {
                    return fallbackItems;
                }
            }
            // 检查是否获取到数据
            if (items.length === 0) {
                console.warn('Weibo: 无法提取热搜数据，页面结构可能已变更');
                return [];
            }
            return items;
        }
        catch (error) {
            console.error('WeiboCrawler error:', error);
            throw error;
        }
    }
    async extractWeiboHotSearchFallback(content) {
        const items = [];
        // 尝试匹配更简单的模式 - 与Go代码保持一致
        const patterns = [
            /<a href="(\/weibo\?q=[^"]+)"[^>]*>([^<]+)<\/a>/g,
            /class="td-02".*?<a href="(\/weibo\?q=[^"]+)"[^>]*>([^<]+)<\/a>/g,
        ];
        for (const pattern of patterns) {
            const matched = extractMatches(content, pattern);
            for (let index = 0; index < matched.length; index++) {
                const item = matched[index];
                if (item.length >= 3) {
                    const title = item[2].trim();
                    const url = 'https://s.weibo.com' + item[1];
                    items.push({
                        index: index + 1,
                        title: title,
                        url: url,
                        hotValue: 0 // 备用方法可能无法获取热度值
                    });
                }
            }
            if (items.length > 0) {
                break;
            }
        }
        return items;
    }
}
