import { CardDetail } from "@/app/ca-mint-history/types/cardDetails";
import { MintHistoryResponse } from "@/app/ca-mint-history/types/mintHistory";
import { PackJackpotCard } from "@/app/ca-mint-history/types/packJackpot";
import axios from "axios";
import * as rax from "retry-axios";
import logger from "../log/logger.server";
import cacheServer from "../cache/cacheServer";
import { Balance } from "@/app/jackpot-prizes/types/balances";

const splBaseClient = axios.create({
  baseURL: "https://api.splinterlands.com",
  timeout: 60000,
  headers: {
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "User-Agent": "SPL-Data/1.0",
  },
});

rax.attach(splBaseClient);
splBaseClient.defaults.raxConfig = {
  instance: splBaseClient,
  retry: 10,
  retryDelay: 1000,
  backoffType: "exponential",
  statusCodesToRetry: [
    [429, 429],
    [500, 599],
  ],
  onRetryAttempt: (err) => {
    const cfg = rax.getConfig(err);
    logger.warn(`Retry attempt #${cfg?.currentRetryAttempt}`);
  },
};

/**
 * Fetch card details from Splinterlands API
 */
export async function fetchCardDetails(): Promise<CardDetail[]> {
  const cacheKey = "card_details";
  const cached = cacheServer.get<CardDetail[]>(cacheKey);
  
  if (cached) {
    logger.debug("Returning cached card details");
    return cached;
  }

  const url = "/cards/get_details";
  logger.info("Fetching card details from Splinterlands API");
  
  try {
    const res = await splBaseClient.get(url);
    const data = res.data;

    // Handle API-level error even if HTTP status is 200
    if (!data || !Array.isArray(data)) {
      throw new Error("Invalid response from Splinterlands API: expected array");
    }

    // Cache for 1 hour (3600 seconds)
    cacheServer.set(cacheKey, data, 3600);
    logger.info(`Fetched ${data.length} card details`);
    
    return data as CardDetail[];
  } catch (error) {
    logger.error(`Failed to fetch card details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}

/**
 * Fetch pack jackpot overview from Splinterlands API
 */
export async function fetchPackJackpotOverview(edition: number = 14): Promise<PackJackpotCard[]> {
  const cacheKey = `pack_jackpot_overview_${edition}`;
  const cached = cacheServer.get<PackJackpotCard[]>(cacheKey);
  
  if (cached) {
    logger.debug(`Returning cached pack jackpot overview for edition ${edition}`);
    return cached;
  }

  const url = "/cards/pack_jackpot_overview";
  logger.info(`Fetching pack jackpot overview for edition ${edition}`);
  
  try {
    const res = await splBaseClient.get(url, {
      params: { edition },
    });
    const data = res.data;

    // Handle API-level error even if HTTP status is 200
    if (!data || !Array.isArray(data)) {
      throw new Error("Invalid response from Splinterlands API: expected array");
    }

    // Cache for 1 hour (3600 seconds)
    cacheServer.set(cacheKey, data, 3600);
    logger.info(`Fetched ${data.length} pack jackpot cards for edition ${edition}`);
    
    return data as PackJackpotCard[];
  } catch (error) {
    logger.error(`Failed to fetch pack jackpot overview: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}

/**
 * Fetch mint history for a specific card and foil type
 */
export async function fetchMintHistory(foil: number, cardDetailId: number): Promise<MintHistoryResponse> {
  const cacheKey = `mint_history_${foil}_${cardDetailId}`;
  const cached = cacheServer.get<MintHistoryResponse>(cacheKey);
  
  if (cached) {
    logger.debug(`Returning cached mint history for foil ${foil}, card ${cardDetailId}`);
    return cached;
  }

  const url = "/cards/mint_history";
  
  try {
    const res = await splBaseClient.get(url, {
      params: { 
        foil, 
        card_detail_id: cardDetailId 
      },
    });
    const data = res.data;

    // Handle API-level error even if HTTP status is 200
    if (!data || typeof data !== "object") {
      throw new Error("Invalid response from Splinterlands API: expected object");
    }

    // Cache for 30 minutes (1800 seconds)
    cacheServer.set(cacheKey, data, 1800);
    
    return data as MintHistoryResponse;
  } catch (error) {
    logger.error(`Failed to fetch mint history for foil ${foil}, card ${cardDetailId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}

/**
 * Fetch pack jackpot overview from Splinterlands API
 */
export async function fetchBalances(): Promise<Balance[]> {
  const cacheKey = `pack_jackpot_balances`;
  const cached = cacheServer.get<Balance[]>(cacheKey);

  if (cached) {
    logger.debug(`Returning cached pack jackpot balances`);
    return cached;
  }

  const url = "/players/balances";
  logger.info(`Fetching pack jackpot balances for username $JACKPOT`);

  try {
    const res = await splBaseClient.get(url, { params: { username: "$JACKPOT" } });
    const data = res.data;

    // Handle API-level error even if HTTP status is 200
    if (!data || !Array.isArray(data)) {
      throw new Error("Invalid response from Splinterlands API: expected array");
    }

    // Cache for 1 hour (3600 seconds)
    cacheServer.set(cacheKey, data, 3600);
    logger.info(`Fetched ${data.length} pack jackpot balances`);
    
    return data as Balance[];
  } catch (error) {
    logger.error(`Failed to fetch jackpot balances: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}