interface CacheItem {
  data: any;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class Cache {
  private store: Map<string, CacheItem> = new Map();

  set(key: string, data: any, ttl: number = 5 * 60 * 1000): void {
    // Default 5 minutes
    this.store.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): any | null {
    const item = this.store.get(key);
    if (!item) {
      return null;
    }

    if (Date.now() - item.timestamp > item.ttl) {
      this.store.delete(key);
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    const item = this.store.get(key);
    if (!item) {
      return false;
    }

    if (Date.now() - item.timestamp > item.ttl) {
      this.store.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    return this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  // Clean up expired items periodically
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.store.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.store.delete(key);
      }
    }
  }
}

export const cache = new Cache();
