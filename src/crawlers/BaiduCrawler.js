import { BaseCrawler } from './BaseCrawler';
import { fetchWithTimeout } from '../utils/crawlerHelper';
export class BaiduCrawler extends BaseCrawler {
    constructor() {
        super('baidu', '百度', 'https://www.baidu.com/favicon.ico', // 根据Go代码中的图标URL更新
        'https://top.baidu.com/board?tab=realtime');
    }
    async crawl() {
        try {
            const html = await fetchWithTimeout(this.url, 10000);
            // 使用正则表达式匹配热搜标题
            const pattern = /<div\s+class=\"c-single-text-ellipsis\">([\s\S]*?)<\/div>/g;
            const matches = [];
            let match;
            while ((match = pattern.exec(html)) !== null) {
                // 提取文本内容（去除HTML标签和特殊字符）
                let divContent = match[1];
                // 移除HTML标签，只保留文本内容
                let textContent = divContent.replace(/<[^>]*>/g, '');
                // 逐字符处理，只保留有效字符
                let cleanedText = '';
                for (let i = 0; i < textContent.length; i++) {
                    const charCode = textContent.charCodeAt(i);
                    // 保留普通字母数字、常见中文字符（基本汉字区）、标点符号和其他可见字符
                    if ((charCode >= 32 && charCode <= 126) || // ASCII 可见字符
                        (charCode >= 0x4e00 && charCode <= 0x9fff) || // 基本汉字区
                        (charCode >= 0x3400 && charCode <= 0x4dbf) || // 扩展A区
                        charCode === 32 || // 空格
                        (charCode >= 0x2000 && charCode <= 0x206f) || // 通用标点
                        (charCode >= 0x3000 && charCode <= 0x303f) // CJK符号和标点
                    ) {
                        // 额外过滤掉一些特殊控制字符
                        if (charCode < 127 || (charCode > 0x007f && charCode < 0x00a0) || charCode > 0x009f) {
                            cleanedText += textContent.charAt(i);
                        }
                    }
                }
                // 移除多余的空白字符
                cleanedText = cleanedText.replace(/\s+/g, ' ').trim();
                if (cleanedText) {
                    matches.push(cleanedText);
                }
            }
            // 构造热搜项目数组
            const hotItems = matches.map((title, index) => ({
                index: index + 1,
                title: title,
                url: `https://www.baidu.com/s?wd=${encodeURIComponent(title)}`
            }));
            return hotItems;
        }
        catch (error) {
            console.error(`Error crawling Baidu: ${error}`);
            return [];
        }
    }
}
