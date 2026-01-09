import { HotItem } from "../types";

export abstract class BaseCrawler {
  protected name: string;
  protected displayName: string;
  protected icon: string;
  protected url: string;

  constructor(name: string, displayName: string, icon: string, url: string) {
    this.name = name;
    this.displayName = displayName;
    this.icon = icon;
    this.url = url;
  }

  abstract crawl(): Promise<HotItem[]>;

  getName(): string {
    return this.name;
  }

  getDisplayName(): string {
    return this.displayName;
  }

  getIcon(): string {
    return this.icon;
  }

  getUrl(): string {
    return this.url;
  }
}
