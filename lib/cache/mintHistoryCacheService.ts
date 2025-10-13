import { MintHistoryResponse } from "@/app/ca-mint-history/types/mintHistory";
import { fetchMintHistory } from "../api/splApi";
import logger from '../log/logger.server';
import cacheServer from './cacheServer';

// Cache configuration specific to mint history
const MINT_HISTORY_CACHE_TTL = 30 * 60; // 30 minutes in seconds


class MintHistoryCacheService {
  constructor() {
    logger.info('MintHistoryCacheService initialized');
  }

  /**
   * Generate cache key for mint history
   */
  private getCacheKey(foil: number, cardDetailId: number): string {
    return `mint_history_${foil}_${cardDetailId}`;
  }

  /**
   * Main method to get mint history - checks cache first, then fetches from API if needed
   */
  async getMintHistory(foil: number, cardDetailId: number): Promise<MintHistoryResponse> {
    const cacheKey = this.getCacheKey(foil, cardDetailId);
    const cached = cacheServer.get<MintHistoryResponse>(cacheKey);

    if (cached) {
      logger.debug(`Returning cached mint history for foil ${foil}, card ${cardDetailId}`);
      return cached;
    }

    // Not in cache, fetch from API
    logger.info(`Fetching mint history from API for foil ${foil}, card ${cardDetailId}`);

    const data = await fetchMintHistory(foil, cardDetailId);

    // Store in cache
    cacheServer.set(cacheKey, data, MINT_HISTORY_CACHE_TTL);
    logger.debug(`Cached mint history for foil ${foil}, card ${cardDetailId} with TTL ${MINT_HISTORY_CACHE_TTL}s`);
    return data;
  }

  /**
   * Clear specific mint history from cache
   */
  clearCache(foil: number, cardDetailId: number): void {
    const key = this.getCacheKey(foil, cardDetailId);
    cacheServer.del(key);
    logger.debug(`Cleared cache for mint history foil ${foil}, card ${cardDetailId}`);
  }
}

// Create singleton instance
const mintHistoryCacheService = new MintHistoryCacheService();

export default mintHistoryCacheService;
