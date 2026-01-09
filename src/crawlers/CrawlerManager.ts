import { BaseCrawler } from "./BaseCrawler";
import { HotItem } from "../types";
import { cache } from "../utils/cache";
import { ZhihuCrawler } from "./ZhihuCrawler";
import { WeiboCrawler } from "./WeiboCrawler";
import { BaiduCrawler } from "./BaiduCrawler";
import { ToutiaoCrawler } from "./ToutiaoCrawler";
import { BilibiliCrawler } from "./BilibiliCrawler";
import { CCTVCrawler } from "./CCTVCrawler";
import { Doc360Crawler } from "./Doc360Crawler";
import { Search360Crawler } from "./Search360Crawler";
import { AcFunCrawler } from "./AcFunCrawler";
import { CSDNCrawler } from "./CSDNCrawler";
import { DongQiuDiCrawler } from "./DongQiuDiCrawler";
import { DouBanCrawler } from "./DouBanCrawler";
import { DouYinCrawler } from "./DouYinCrawler";
import { GitHubCrawler } from "./GitHubCrawler";
import { GuoJiaDiLiCrawler } from "./GuoJiaDiLiCrawler";
import { HistoryTodayCrawler } from "./HistoryTodayCrawler";
import { HuPuCrawler } from "./HuPuCrawler";
import { ITHomeCrawler } from "./ITHomeCrawler";
import { LishipinCrawler } from "./LishipinCrawler";
import { NanfangzhoumoCrawler } from "./NanfangzhoumoCrawler";
import { PengpaiCrawler } from "./PengpaiCrawler";
import { QqnewsCrawler } from "./QqnewsCrawler";
import { QuarkCrawler } from "./QuarkCrawler";
import { RenminCrawler } from "./RenminCrawler";
import { ShaoShuPaiCrawler } from "./ShaoShuPaiCrawler";
import { SougouCrawler } from "./SougouCrawler";
import { SouhuCrawler } from "./SouhuCrawler";
import { PLATFORM_CONFIGS } from "../api-routes";

export class CrawlerManager {
  private crawlers: Map<string, BaseCrawler> = new Map();

  constructor() {
    // Initialize all crawlers
    this.registerCrawler(new ZhihuCrawler());
    this.registerCrawler(new WeiboCrawler());
    this.registerCrawler(new BaiduCrawler());
    this.registerCrawler(new ToutiaoCrawler());
    this.registerCrawler(new BilibiliCrawler());
    this.registerCrawler(new CCTVCrawler());
    this.registerCrawler(new Doc360Crawler());
    this.registerCrawler(new Search360Crawler());
    this.registerCrawler(new AcFunCrawler());
    this.registerCrawler(new CSDNCrawler());
    this.registerCrawler(new DongQiuDiCrawler());
    this.registerCrawler(new DouBanCrawler());
    this.registerCrawler(new DouYinCrawler());
    this.registerCrawler(new GitHubCrawler());
    this.registerCrawler(new GuoJiaDiLiCrawler());
    this.registerCrawler(new HistoryTodayCrawler());
    this.registerCrawler(new HuPuCrawler());
    this.registerCrawler(new ITHomeCrawler());
    this.registerCrawler(new LishipinCrawler());
    this.registerCrawler(new NanfangzhoumoCrawler());
    this.registerCrawler(new PengpaiCrawler());
    this.registerCrawler(new QqnewsCrawler());
    this.registerCrawler(new QuarkCrawler());
    this.registerCrawler(new RenminCrawler());
    this.registerCrawler(new ShaoShuPaiCrawler());
    this.registerCrawler(new SougouCrawler());
    this.registerCrawler(new SouhuCrawler());

    // In a full implementation, we would register all 30+ crawlers here
    // For now, we'll add just a few as examples

    // Validate that all implemented crawlers are in the API routes configuration
    this.validatePlatformRegistration();
  }

  private validatePlatformRegistration(): void {
    const registeredPlatforms = Array.from(this.crawlers.keys());
    const missingFromConfigs = registeredPlatforms.filter(
      (platform) => !(platform in PLATFORM_CONFIGS),
    );

    if (missingFromConfigs.length > 0) {
      console.warn(
        "Warning: The following platforms are implemented but not in PLATFORM_CONFIGS:",
        missingFromConfigs,
      );
    }
  }

  private registerCrawler(crawler: BaseCrawler): void {
    this.crawlers.set(crawler.getName(), crawler);
  }

  async crawl(platform: string): Promise<HotItem[]> {
    // Filter out common static file requests that are not platforms
    if (this.isStaticFileRequest(platform)) {
      throw new Error(`Invalid platform name: ${platform}`);
    }

    const crawler = this.crawlers.get(platform);
    if (!crawler) {
      // Check if the platform exists in our configs but hasn't been implemented yet
      if (platform in PLATFORM_CONFIGS) {
        console.warn(
          `Platform ${platform} is configured but not yet implemented`,
        );
        throw new Error(`Platform ${platform} not yet implemented`);
      }
      throw new Error(`Platform ${platform} not supported`);
    }

    // Check cache first
    const cacheKey = `hot_${platform}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      const data = await crawler.crawl();
      // Cache for 5 minutes
      cache.set(cacheKey, data, 5 * 60 * 1000);
      return data;
    } catch (error) {
      console.error(`Error crawling platform ${platform}:`, error);
      // Return cached data if available even if it's expired, or empty array
      return cachedData || [];
    }
  }

  async crawlAll(): Promise<Record<string, HotItem[]>> {
    const results: Record<string, HotItem[]> = {};
    const promises = Array.from(this.crawlers.entries()).map(
      async ([name, crawler]) => {
        try {
          const data = await crawler.crawl();
          results[name] = data;
        } catch (error) {
          console.error(`Error crawling platform ${name}:`, error);
          const cacheKey = `hot_${name}`;
          const cachedData = cache.get(cacheKey);
          results[name] = cachedData || [];
        }
      },
    );

    await Promise.all(promises);
    return results;
  }

  getSupportedPlatforms(): {
    name: string;
    displayName: string;
    icon: string;
    url: string;
  }[] {
    return Array.from(this.crawlers.values()).map((crawler) => ({
      name: crawler.getName(),
      displayName: crawler.getDisplayName(),
      icon: crawler.getIcon(),
      url: crawler.getUrl(),
    }));
  }

  async refreshCache(platform?: string): Promise<void> {
    if (platform) {
      // Filter out common static file requests that are not platforms
      if (this.isStaticFileRequest(platform)) {
        throw new Error(`Invalid platform name: ${platform}`);
      }

      const crawler = this.crawlers.get(platform);
      if (!crawler) {
        // Check if the platform exists in our configs but hasn't been implemented yet
        if (platform in PLATFORM_CONFIGS) {
          throw new Error(`Platform ${platform} not yet implemented`);
        }
        throw new Error(`Platform ${platform} not supported`);
      }

      const cacheKey = `hot_${platform}`;
      cache.set(cacheKey, await crawler.crawl(), 5 * 60 * 1000);
    } else {
      // Refresh all platforms
      for (const [name, crawler] of this.crawlers) {
        try {
          const cacheKey = `hot_${name}`;
          cache.set(cacheKey, await crawler.crawl(), 5 * 60 * 1000);
        } catch (error) {
          console.error(`Error refreshing cache for platform ${name}:`, error);
        }
      }
    }
  }

  private isStaticFileRequest(platform: string): boolean {
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
    return staticFileExtensions.some((ext) =>
      platform.toLowerCase().endsWith(ext),
    );
  }
}
