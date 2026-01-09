class Cache {
  constructor() {
    this.store = new Map();
  }
  set(key, data, ttl = 5 * 60 * 1000) {
    this.store.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }
  get(key) {
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
  has(key) {
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
  delete(key) {
    return this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
  // Clean up expired items periodically
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.store.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.store.delete(key);
      }
    }
  }
}
export const cache = new Cache();
