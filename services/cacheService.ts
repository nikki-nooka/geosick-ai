// services/cacheService.ts

interface CacheItem<T> {
    value: T;
    expiry: number;
}

/**
 * Retrieves an item from the cache.
 * Returns the item if it exists and has not expired, otherwise returns null.
 * @param key The key of the item to retrieve.
 */
export function get<T>(key: string): T | null {
    try {
        const itemStr = localStorage.getItem(key);
        if (!itemStr) {
            return null;
        }

        const item: CacheItem<T> = JSON.parse(itemStr);
        const now = new Date().getTime();

        if (now > item.expiry) {
            localStorage.removeItem(key);
            return null;
        }

        return item.value;
    } catch (error) {
        console.error(`Error getting item from cache with key "${key}":`, error);
        return null;
    }
}

/**
 * Adds an item to the cache with a specific Time To Live (TTL).
 * @param key The key of the item to store.
 * @param value The value to store.
 * @param ttlMinutes The time to live for the cached item, in minutes.
 */
export function set<T>(key: string, value: T, ttlMinutes: number): void {
    try {
        const now = new Date();
        const expiry = now.getTime() + ttlMinutes * 60 * 1000;
        const item: CacheItem<T> = { value, expiry };
        localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
        console.error(`Error setting item in cache with key "${key}":`, error);
        // This can happen if localStorage is full.
    }
}
