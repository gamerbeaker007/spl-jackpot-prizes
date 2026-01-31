import { SplCAGoldReward } from "@/app/ca-gold-rewards/types/cardCollection";
import { Balance } from "@/app/jackpot-prizes/types/balances";
import { SplPlayerCardDetail, SplPlayerCollection } from "@/app/jackpot-prizes/types/card";
import { SplInventoryItem } from "@/app/jackpot-prizes/types/music";
import { Skins } from "@/app/jackpot-prizes/types/skins";
import { RankedDrawsPrizeCard } from "@/app/ranked-reward-draws/types/rankedDraws";
import { CardHistoryResponse } from "@/app/types/cardHistory";
import { PackJackpotCard } from "@/app/types/packJackpot";
import { MintHistoryResponse, SplCardDetail } from "@/app/types/shared";
import axios from "axios";
import * as rax from "retry-axios";
import logger from "../log/logger.server";

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
export async function fetchCardDetails(): Promise<SplCardDetail[]> {
  const url = "/cards/get_details";
  logger.info("Fetching card details from Splinterlands API");

  try {
    const res = await splBaseClient.get(url);
    const data = res.data;

    // Handle API-level error even if HTTP status is 200
    if (!data || !Array.isArray(data)) {
      throw new Error("Invalid response from Splinterlands API: expected array");
    }

    return data as SplCardDetail[];
  } catch (error) {
    logger.error(`Failed to fetch card details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}

/**
 * Fetch pack jackpot overview from Splinterlands API
 */
export async function fetchPackJackpotOverview(edition: number = 14): Promise<PackJackpotCard[]> {
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

    return data as MintHistoryResponse;
  } catch (error) {
    logger.error(`Failed to fetch mint history for foil ${foil}, card ${cardDetailId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}


/**
 * @deprecated should not be used anymore here for reference on how it was done before
 * Fetch pack jackpot balances from Splinterlands API
 */
export async function fetchJackPotPrizes(): Promise<Balance[]> {
  const url = "/players/balances";
  logger.info(`Fetching pack jackpot balances for username $JACKPOT`);

  try {
    const res = await splBaseClient.get(url, { params: { username: "$JACKPOT" } });
    const data = res.data;

    // Handle API-level error even if HTTP status is 200
    if (!data || !Array.isArray(data)) {
      throw new Error("Invalid response from Splinterlands API: expected array");
    }

    logger.info(`Fetched ${data.length} pack jackpot balances for username $JACKPOT`);

    return data as Balance[];
  } catch (error) {
    logger.error(`Failed to fetch jackpot balances: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}

/**
 * Fetch pack jackpot skins from Splinterlands API
 */
export async function fetchJackPotSkins(): Promise<Skins[]> {
  const url = "/players/skins";
  logger.info(`Fetching pack jackpot skins for username $JACKPOT_SKINS`);

  try {
    const res = await splBaseClient.get(url, { params: { username: "$JACKPOT_SKINS" } });
    const data = res.data;

    // Handle API-level error even if HTTP status is 200
    if (!data || !Array.isArray(data)) {
      throw new Error("Invalid response from Splinterlands API: expected array");
    }

    logger.info(`Fetched ${data.length} pack jackpot skins for username $JACKPOT_SKINS`);

    return data as Skins[];
  } catch (error) {
    logger.error(`Failed to fetch jackpot skins: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}

/**
 * Fetch pack jackpot gold from Splinterlands API
 */
export async function fetchJackPotGold(): Promise<SplCAGoldReward[]> {
  const url = "/cards/ca_gold_rewards";
  logger.info(`Fetching pack jackpot gold for username $JACKPOT_GOLD`);

  try {
    const res = await splBaseClient.get(url);
    const data = res.data;

    // Handle API-level error even if HTTP status is 200
    if (!data || !Array.isArray(data)) {
      throw new Error("Invalid response from Splinterlands API: expected array");
    }

    return data as SplCAGoldReward[];
  } catch (error) {
    logger.error(`Failed to fetch jackpot gold: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}


/**
 * Fetch ranked draws prize overview from Splinterlands API
 */
export async function fetchRankedDrawsPrizeOverview(): Promise<RankedDrawsPrizeCard[]> {
  const url = "/ranked_draws/prize_overview";
  logger.info("Fetching ranked draws prize overview");

  try {
    const res = await splBaseClient.get(url);
    const data = res.data;

    // Handle API-level error even if HTTP status is 200
    if (!data || !Array.isArray(data)) {
      throw new Error("Invalid response from Splinterlands API: expected array");
    }

    logger.info(`Fetched ${data.length} ranked draws prize cards`);

    return data as RankedDrawsPrizeCard[];
  } catch (error) {
    logger.error(`Failed to fetch ranked draws prize overview: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}

/**
 * Fetches card history for a specific card ID
 * @param cardId - The card ID (e.g., "C7-378-G32ZII2HWG")
 * @returns Array of card history items
 */
export async function fetchCardHistory(cardId: string): Promise<CardHistoryResponse> {
  try {
    logger.info(`Fetching card history for card ID: ${cardId}`);

    const response = await splBaseClient.get('/cards/history', {
      params: {
        id: cardId
      }
    });

    const { data } = response;

    // Handle API-level error even if HTTP status is 200
    if (!data || !Array.isArray(data)) {
      throw new Error("Invalid response from Splinterlands API: expected array");
    }

    logger.info(`Fetched ${data.length} card history entries for card ${cardId}`);

    return data as CardHistoryResponse;
  } catch (error) {
    logger.error(`Failed to fetch card history for ${cardId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}

/**
 * Fetch ranked draws prize overview from Splinterlands API
 */
export async function fetchFrontierDrawsPrizeOverview(): Promise<RankedDrawsPrizeCard[]> {
  const url = "/frontier_draws/prize_overview";
  logger.info("Fetching frontier draws prize overview");

  try {
    const res = await splBaseClient.get(url);
    const data = res.data;

    // Handle API-level error even if HTTP status is 200
    if (!data || !Array.isArray(data)) {
      throw new Error("Invalid response from Splinterlands API: expected array");
    }

    logger.info(`Fetched ${data.length} frontier draws prize cards`);

    return data as RankedDrawsPrizeCard[];
  } catch (error) {
    logger.error(`Failed to fetch frontier draws prize overview: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}


/**
 * Fetch pack jackpot gold from Splinterlands API
 */
export async function fetchJackpotCards(): Promise<SplPlayerCardDetail[]> {
  const url = "/cards/collection/$JACKPOT";
  logger.info(`Fetching pack jackpot gold for username $JACKPOT`);

  try {
    const res = await splBaseClient.get(url);
    const data = res.data as SplPlayerCollection;

    // Handle API-level error even if HTTP status is 200
    if (!data || !Array.isArray(data.cards)) {
      throw new Error("Invalid response from Splinterlands API: expected array");
    }

    return data.cards;
  } catch (error) {
    logger.error(`Failed to fetch jackpot gold: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}
/**
 * Fetch music inventory from Splinterlands API for $MUSIC_JACKPOT
 */
export async function fetchJackpotMusic(): Promise<SplInventoryItem[]> {
  const url = "/players/inventory";
  logger.info(`Fetching music inventory for username $MUSIC_JACKPOT`);

  try {
    const res = await splBaseClient.get(url, { params: { username: "$MUSIC_JACKPOT" } });
    const data = res.data;

    // Handle API-level error even if HTTP status is 200
    if (!data || !Array.isArray(data)) {
      throw new Error("Invalid response from Splinterlands API: expected array");
    }

    // Filter items where type === "Music"
    const musicItems = data.filter((item: SplInventoryItem) => item.type === "Music");

    logger.info(`Fetched ${musicItems.length} music items for username $MUSIC_JACKPOT`);

    return musicItems as SplInventoryItem[];
  } catch (error) {
    logger.error(`Failed to fetch music inventory: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}

/**
 * Fetch music inventory from Splinterlands API for $FRONTIER_MUSIC_JACKPOT
 */
export async function fetchFrontierJackpotMusic(): Promise<SplInventoryItem[]> {
  const url = "/players/inventory";
  logger.info(`Fetching music inventory for username $FRONTIER_MUSIC_JACKPOT`);

  try {
    const res = await splBaseClient.get(url, { params: { username: "$FRONTIER_MUSIC_JACKPOT" } });
    const data = res.data;

    // Handle API-level error even if HTTP status is 200
    if (!data || !Array.isArray(data)) {
      throw new Error("Invalid response from Splinterlands API: expected array");
    }

    // Filter items where type === "Music"
    const musicItems = data.filter((item: SplInventoryItem) => item.type === "Music");

    logger.info(`Fetched ${musicItems.length} music items for username $FRONTIER_MUSIC_JACKPOT`);

    return musicItems as SplInventoryItem[];
  } catch (error) {
    logger.error(`Failed to fetch frontier music inventory: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}
