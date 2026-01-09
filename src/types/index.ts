export interface HotItem {
  index: number;
  title: string;
  url?: string;
  hotValue?: number;
  desc?: string;
}

export interface HotData {
  code: number;
  icon: string;
  message: string;
  obj: HotItem[];
  timestamp: number;
}

export interface PlatformConfig {
  name: string;
  displayName: string;
  icon: string;
  url: string;
  crawler: () => Promise<HotItem[]>;
}
