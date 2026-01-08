import { HotData, HotItem } from '../types';
import { CrawlerManager } from '../crawlers/CrawlerManager';
import { cache } from '../utils/cache';

export class HotService {
  private crawlerManager: CrawlerManager;

  constructor() {
    this.crawlerManager = new CrawlerManager();
  }

  async getHotData(platform: string): Promise<HotData> {
    try {
      const data = await this.crawlerManager.crawl(platform);
      const crawler = this.crawlerManager.getSupportedPlatforms().find(p => p.name === platform);

      return {
        code: 200,
        icon: crawler?.icon || '',
        message: crawler?.displayName || platform,
        obj: data,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error(`Error getting hot data for platform ${platform}:`, error);
      return {
        code: 500,
        icon: '',
        message: `Error fetching data for ${platform}`,
        obj: [],
        timestamp: Date.now(),
      };
    }
  }

  async getAllHotData(): Promise<HotData> {
    try {
      const allData = await this.crawlerManager.crawlAll();
      const allItems: HotItem[] = [];

      // Flatten all platform data into a single array
      Object.entries(allData).forEach(([platform, items]) => {
        items.forEach(item => {
          allItems.push({
            ...item,
            desc: `${platform}: ${item.desc || item.title}`
          });
        });
      });

      return {
        code: 200,
        icon: '',
        message: 'All platforms',
        obj: allItems,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('Error getting all hot data:', error);
      return {
        code: 500,
        icon: '',
        message: 'Error fetching all data',
        obj: [],
        timestamp: Date.now(),
      };
    }
  }

  async getPlatformList(): Promise<{ name: string; displayName: string; icon: string; url: string }[]> {
    return this.crawlerManager.getSupportedPlatforms();
  }

  async refreshCache(platform?: string): Promise<void> {
    await this.crawlerManager.refreshCache(platform);
  }
}