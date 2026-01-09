import { HotData, HotItem } from "../types";
import { CrawlerManager } from "../crawlers/CrawlerManager";
import { cache } from "../utils/cache";

export class HotService {
  private crawlerManager: CrawlerManager;

  constructor() {
    this.crawlerManager = new CrawlerManager();
  }

  async getHotData(platform: string): Promise<HotData> {
    try {
      // Check if the platform name looks like a static file request
      const staticFileExtensions = [
        ".ico",
        ".css",
        ".js",
        ".png",
        ".jpg",
        ".jpeg",
        ".gif",
        ".svg",
        ".woff",
        ".woff2",
        ".ttf",
        ".eot",
      ];
      if (
        staticFileExtensions.some((ext) => platform.toLowerCase().endsWith(ext))
      ) {
        console.error(`Invalid platform name: ${platform}`);
        return {
          code: 500,
          icon: "",
          message: `Invalid platform name: ${platform}`,
          obj: [],
          timestamp: Date.now(),
        };
      }

      const data = await this.crawlerManager.crawl(platform);
      const crawler = this.crawlerManager
        .getSupportedPlatforms()
        .find((p) => p.name === platform);

      return {
        code: 200,
        icon: crawler?.icon || "",
        message: crawler?.displayName || platform,
        obj: data,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error(`Error getting hot data for platform ${platform}:`, error);
      return {
        code: 500,
        icon: "",
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
        items.forEach((item) => {
          allItems.push({
            ...item,
            desc: `${platform}: ${item.desc || item.title}`,
          });
        });
      });

      return {
        code: 200,
        icon: "",
        message: "All platforms",
        obj: allItems,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error("Error getting all hot data:", error);
      return {
        code: 500,
        icon: "",
        message: "Error fetching all data",
        obj: [],
        timestamp: Date.now(),
      };
    }
  }

  async getPlatformList(): Promise<
    { name: string; displayName: string; icon: string }[]
  > {
    const platforms = this.crawlerManager.getSupportedPlatforms();
    return platforms.map(({ name, displayName, icon }) => ({
      name,
      displayName,
      icon,
    }));
  }

  async refreshCache(platform?: string): Promise<void> {
    if (platform) {
      // Check if the platform name looks like a static file request
      const staticFileExtensions = [
        ".ico",
        ".css",
        ".js",
        ".png",
        ".jpg",
        ".jpeg",
        ".gif",
        ".svg",
        ".woff",
        ".woff2",
        ".ttf",
        ".eot",
      ];
      if (
        staticFileExtensions.some((ext) => platform.toLowerCase().endsWith(ext))
      ) {
        throw new Error(`Invalid platform name: ${platform}`);
      }
    }
    await this.crawlerManager.refreshCache(platform);
  }
}
