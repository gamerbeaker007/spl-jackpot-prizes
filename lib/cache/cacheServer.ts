import NodeCache from 'node-cache';
import logger from '../log/logger.server';

// Cache configuration
const CACHE_TTL = 30 * 60; // 30 minutes in seconds
const CHECK_PERIOD = 10 * 60; // Check for expired keys every 10 minutes

class CacheServer {
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache({
      stdTTL: CACHE_TTL,
      checkperiod: CHECK_PERIOD,
      useClones: false, // Better performance, but be careful with object mutations
    });

    // Log cache events
    this.cache.on('set', (key: string) => {
      logger.debug(`Cache SET: ${key}`);
    });

    this.cache.on('get', (key: string) => {
      logger.debug(`Cache GET: ${key}`);
    });

    this.cache.on('del', (key: string) => {
      logger.debug(`Cache DEL: ${key}`);
    });

    this.cache.on('expired', (key: string) => {
      logger.debug(`Cache EXPIRED: ${key}`);
    });

    logger.info('CacheServer initialized');
  }

  /**
   * Get a value from cache
   */
  get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  /**
   * Set a value in cache with optional TTL
   */
  set<T>(key: string, value: T, ttl?: number): boolean {
    return this.cache.set(key, value, ttl || CACHE_TTL);
  }

  /**
   * Delete a key from cache
   */
  del(key: string): number {
    return this.cache.del(key);
  }

  /**
   * Check if a key exists in cache
   */
  has(key: string): boolean {
    return this.cache.has(key);
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return this.cache.getStats();
  }

  /**
   * Flush all cache entries
   */
  flushAll(): void {
    this.cache.flushAll();
    logger.info('Cache flushed');
  }

  /**
   * Get all cache keys
   */
  keys(): string[] {
    return this.cache.keys();
  }
}

// Create singleton instance
const cacheServer = new CacheServer();
export default cacheServer;