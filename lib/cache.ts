// lib/cache.ts
interface CacheItem<T> {
  data: T;
  expiresAt: number;
}

class CacheManager {
  private cache = new Map<string, CacheItem<any>>();

  set<T>(key: string, data: T, ttlSeconds: number = 3600): void {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // For patterns like 'hotels:*'
  deletePattern(pattern: string): void {
    const regex = new RegExp(pattern.replace('*', '.*'));
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }
}

export const cacheManager = new CacheManager();

// Redis-like interface for production use (when you upgrade)
export async function cacheWithFallback<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number = 3600
): Promise<T> {
  // Check in-memory cache first
  const cached = cacheManager.get<T>(key);
  if (cached) return cached;

  // Fetch fresh data
  const data = await fetcher();

  // Store in cache
  cacheManager.set(key, data, ttlSeconds);

  return data;
}

// Cache utilities for specific entities
export const cacheKeys = {
  hotel: (id: string | number) => `hotel:${id}`,
  hotelsList: (page: number = 1) => `hotels:list:${page}`,
  booking: (id: string | number) => `booking:${id}`,
  user: (id: string) => `user:${id}`,
  search: (query: string) => `search:${query}`,
};

// Invalidate related caches
export function invalidateHotelCache(hotelId?: string | number): void {
  if (hotelId) {
    cacheManager.delete(cacheKeys.hotel(hotelId));
  }
  cacheManager.deletePattern('hotels:list:.*');
  cacheManager.deletePattern('search:.*');
}

export function invalidateBookingCache(bookingId?: string | number): void {
  if (bookingId) {
    cacheManager.delete(cacheKeys.booking(bookingId));
  }
}
