import { SplCAGoldReward } from "@/app/ca-gold-rewards/types/cardCollection";
import { SplPlayerCardDetail, SplPlayerCollection } from "@/app/jackpot-prizes/types/card";
import { SplInventoryItem } from "@/app/jackpot-prizes/types/music";
import { Skins } from "@/app/jackpot-prizes/types/skins";
import { RankedDrawsPrizeCard } from "@/app/ranked-reward-draws/types/rankedDraws";
import { CardHistoryResponse } from "@/app/types/cardHistory";
import { PackJackpotCard } from "@/app/types/packJackpot";
import { MintHistoryByDateItem, MintHistoryResponse, SplCardDetail } from "@/app/types/shared";
import axios from "axios";
import * as rax from "retry-axios";

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
    console.warn(`Retry attempt #${cfg?.currentRetryAttempt}`);
  },
};

/**
 * Fetch card details from Splinterlands API
 */
export async function fetchCardDetails(): Promise<SplCardDetail[]> {
  const url = "/cards/get_details";
  console.info("Fetching card details from Splinterlands API");

  try {
    const res = await splBaseClient.get(url);
    const data = res.data;

    // Handle API-level error even if HTTP status is 200
    if (!data || !Array.isArray(data)) {
      throw new Error("Invalid response from Splinterlands API: expected array");
    }

    return data as SplCardDetail[];
  } catch (error) {
    console.error(`Failed to fetch card details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}

/**
 * Fetch pack jackpot overview from Splinterlands API
 */
export async function fetchPackJackpotOverview(edition: number = 14): Promise<PackJackpotCard[]> {
  const url = "/cards/pack_jackpot_overview";
  console.info(`Fetching pack jackpot overview for edition ${edition}`);

  try {
    const res = await splBaseClient.get(url, {
      params: { edition },
    });
    const data = res.data;

    // Handle API-level error even if HTTP status is 200
    if (!data || !Array.isArray(data)) {
      throw new Error("Invalid response from Splinterlands API: expected array");
    }

    console.info(`Fetched ${data.length} pack jackpot cards for edition ${edition}`);

    return data as PackJackpotCard[];
  } catch (error) {
    console.error(`Failed to fetch pack jackpot overview: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}


/**
 * Fetch mint history for a specific card and foil type.
 * When byDate is true, returns recent winners sorted by date instead.
 */
export async function fetchMintHistory(foil: number, cardDetailId: number, byDate: true, edition?: number): Promise<MintHistoryByDateItem[]>;
export async function fetchMintHistory(foil: number, cardDetailId: number, byDate?: false, edition?: number): Promise<MintHistoryResponse>;
export async function fetchMintHistory(
  foil: number,
  cardDetailId: number,
  byDate?: boolean,
  edition: number = 14,
): Promise<MintHistoryResponse | MintHistoryByDateItem[]> {
  const url = "/cards/mint_history";

  try {
    const params = byDate
      ? { foil, by_date: true, by_date_edition: edition }
      : { foil, card_detail_id: cardDetailId };

    const res = await splBaseClient.get(url, { params });
    const data = res.data;

    if (!data || typeof data !== "object") {
      throw new Error("Invalid response from Splinterlands API: expected object");
    }

    if (byDate) {
      if (!Array.isArray(data.mints)) {
        throw new Error(`Invalid response from Splinterlands API: expected mints array for foil ${foil}, edition ${edition}`);
      }
      return data.mints as MintHistoryByDateItem[];
    }

    return data as MintHistoryResponse;
  } catch (error) {
    console.error(`Failed to fetch mint history for foil ${foil}${
      byDate ? `, edition ${edition} (by_date)` : `, card ${cardDetailId}`
    }: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}

/**
 * Fetch pack jackpot skins from Splinterlands API
 */
export async function fetchJackPotSkins(): Promise<Skins[]> {
  const url = "/players/skins";
  console.info(`Fetching pack jackpot skins for username $JACKPOT_SKINS`);

  try {
    const res = await splBaseClient.get(url, { params: { username: "$JACKPOT_SKINS" } });
    const data = res.data;

    // Handle API-level error even if HTTP status is 200
    if (!data || !Array.isArray(data)) {
      throw new Error("Invalid response from Splinterlands API: expected array");
    }

    console.info(`Fetched ${data.length} pack jackpot skins for username $JACKPOT_SKINS`);

    return data as Skins[];
  } catch (error) {
    console.error(`Failed to fetch jackpot skins: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}

/**
 * Fetch pack jackpot gold from Splinterlands API
 */
export async function fetchJackPotGold(): Promise<SplCAGoldReward[]> {
  const url = "/cards/ca_gold_rewards";
  console.info(`Fetching pack jackpot gold for username $JACKPOT_GOLD`);

  try {
    const res = await splBaseClient.get(url);
    const data = res.data;

    // Handle API-level error even if HTTP status is 200
    if (!data || !Array.isArray(data)) {
      throw new Error("Invalid response from Splinterlands API: expected array");
    }

    return data as SplCAGoldReward[];
  } catch (error) {
    console.error(`Failed to fetch jackpot gold: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}


/**
 * Fetch ranked draws prize overview from Splinterlands API
 */
export async function fetchRankedDrawsPrizeOverview(): Promise<RankedDrawsPrizeCard[]> {
  const url = "/ranked_draws/prize_overview";
  console.info("Fetching ranked draws prize overview");

  try {
    const res = await splBaseClient.get(url);
    const data = res.data;

    // Handle API-level error even if HTTP status is 200
    if (!data || !Array.isArray(data)) {
      throw new Error("Invalid response from Splinterlands API: expected array");
    }

    console.info(`Fetched ${data.length} ranked draws prize cards`);

    return data as RankedDrawsPrizeCard[];
  } catch (error) {
    console.error(`Failed to fetch ranked draws prize overview: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
    console.info(`Fetching card history for card ID: ${cardId}`);

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

    console.info(`Fetched ${data.length} card history entries for card ${cardId}`);

    return data as CardHistoryResponse;
  } catch (error) {
    console.error(`Failed to fetch card history for ${cardId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}

/**
 * Fetch ranked draws prize overview from Splinterlands API
 */
export async function fetchFrontierDrawsPrizeOverview(): Promise<RankedDrawsPrizeCard[]> {
  const url = "/frontier_draws/prize_overview";
  console.info("Fetching frontier draws prize overview");

  try {
    const res = await splBaseClient.get(url);
    const data = res.data;

    // Handle API-level error even if HTTP status is 200
    if (!data || !Array.isArray(data)) {
      throw new Error("Invalid response from Splinterlands API: expected array");
    }

    console.info(`Fetched ${data.length} frontier draws prize cards`);

    return data as RankedDrawsPrizeCard[];
  } catch (error) {
    console.error(`Failed to fetch frontier draws prize overview: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}


/**
 * Fetch pack jackpot gold from Splinterlands API
 */
export async function fetchJackpotCards(): Promise<SplPlayerCardDetail[]> {
  const url = "/cards/collection/$JACKPOT";
  console.info(`Fetching pack jackpot gold for username $JACKPOT`);

  try {
    const res = await splBaseClient.get(url);
    const data = res.data as SplPlayerCollection;

    // Handle API-level error even if HTTP status is 200
    if (!data || !Array.isArray(data.cards)) {
      throw new Error("Invalid response from Splinterlands API: expected array");
    }

    return data.cards;
  } catch (error) {
    console.error(`Failed to fetch jackpot gold: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}
/**
 * Fetch music inventory from Splinterlands API for $MUSIC_JACKPOT
 */
export async function fetchJackpotMusic(): Promise<SplInventoryItem[]> {
  const url = "/players/inventory";
  console.info(`Fetching music inventory for username $MUSIC_JACKPOT`);

  try {
    const res = await splBaseClient.get(url, { params: { username: "$MUSIC_JACKPOT" } });
    const data = res.data;

    // Handle API-level error even if HTTP status is 200
    if (!data || !Array.isArray(data)) {
      throw new Error("Invalid response from Splinterlands API: expected array");
    }

    // Filter items where type === "Music"
    const musicItems = data.filter((item: SplInventoryItem) => item.type === "Music");

    console.info(`Fetched ${musicItems.length} music items for username $MUSIC_JACKPOT`);

    return musicItems as SplInventoryItem[];
  } catch (error) {
    console.error(`Failed to fetch music inventory: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}

/**
 * Fetch music inventory from Splinterlands API for $FRONTIER_MUSIC_JACKPOT
 */
export async function fetchFrontierJackpotMusic(): Promise<SplInventoryItem[]> {
  const url = "/players/inventory";
  console.info(`Fetching music inventory for username $FRONTIER_MUSIC_JACKPOT`);

  try {
    const res = await splBaseClient.get(url, { params: { username: "$FRONTIER_MUSIC_JACKPOT" } });
    const data = res.data;

    // Handle API-level error even if HTTP status is 200
    if (!data || !Array.isArray(data)) {
      throw new Error("Invalid response from Splinterlands API: expected array");
    }

    // Filter items where type === "Music"
    const musicItems = data.filter((item: SplInventoryItem) => item.type === "Music");

    console.info(`Fetched ${musicItems.length} music items for username $FRONTIER_MUSIC_JACKPOT`);

    return musicItems as SplInventoryItem[];
  } catch (error) {
    console.error(`Failed to fetch frontier music inventory: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}

/**
 * Fetch recent prizes from ranked draws
 */
export async function fetchRankedDrawsRecentPrizes(foil: number): Promise<MintHistoryByDateItem[]> {
  const url = "/ranked_draws/recent_prizes";
  console.info(`Fetching ranked draws recent prizes for foil ${foil}`);

  try {
    const res = await splBaseClient.get(url, { params: { foil } });
    const data = res.data;

    if (Array.isArray(data)) return data as MintHistoryByDateItem[];
    if (data && Array.isArray(data.mints)) return data.mints as MintHistoryByDateItem[];

    throw new Error("Invalid response from Splinterlands API: expected array");
  } catch (error) {
    console.error(`Failed to fetch ranked draws recent prizes: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}

/**
 * Fetch recent prizes from frontier draws
 */
export async function fetchFrontierDrawsRecentPrizes(foil: number): Promise<MintHistoryByDateItem[]> {
  const url = "/frontier_draws/recent_prizes";
  console.info(`Fetching frontier draws recent prizes for foil ${foil}`);

  try {
    const res = await splBaseClient.get(url, { params: { foil } });
    const data = res.data;

    if (Array.isArray(data)) return data as MintHistoryByDateItem[];
    if (data && Array.isArray(data.mints)) return data.mints as MintHistoryByDateItem[];

    throw new Error("Invalid response from Splinterlands API: expected array");
  } catch (error) {
    console.error(`Failed to fetch frontier draws recent prizes: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}
