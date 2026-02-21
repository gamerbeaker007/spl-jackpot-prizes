import { PKBidsResponse, PKPricesResponse } from "@/app/types/pkPrices";
import axios from "axios";
import * as rax from "retry-axios";

const peakMonstersClient = axios.create({
  baseURL: "https://peakmonsters.com/api",
  timeout: 30000,
  headers: {
    "Accept": "application/json",
    "User-Agent": "SPL-Data/1.0",
  },
});

rax.attach(peakMonstersClient);
peakMonstersClient.defaults.raxConfig = {
  instance: peakMonstersClient,
  retry: 5,
  retryDelay: 1000,
  backoffType: "exponential",
  statusCodesToRetry: [
    [429, 429],
    [500, 599],
  ],
  onRetryAttempt: (err) => {
    const cfg = rax.getConfig(err);
    console.warn(`PeakMonsters retry attempt #${cfg?.currentRetryAttempt}`);
  },
};

/**
 * Fetch all card market prices from PeakMonsters
 */
export async function fetchPeakMonsterPrices(): Promise<PKPricesResponse> {
  const url = "/market/cards/prices";
  console.info("Fetching card prices from PeakMonsters API");

  try {
    const res = await peakMonstersClient.get<PKPricesResponse>(url);
    const data = res.data;

    if (!data || !Array.isArray(data.prices)) {
      throw new Error("Invalid response from PeakMonsters API: expected prices array");
    }

    console.info(`Fetched ${data.prices.length} card prices from PeakMonsters`);
    return data;
  } catch (error) {
    console.error(
      `Failed to fetch PeakMonsters prices: ${error instanceof Error ? error.message : "Unknown error"}`
    );
    throw error;
  }
}

/**
 * Fetch top bids from PeakMonsters
 */
export async function fetchPeakMonsterTopBids(): Promise<PKBidsResponse> {
  const url = "/bids/top";
  console.info("Fetching top bids from PeakMonsters API");

  try {
    const res = await peakMonstersClient.get<PKBidsResponse>(url);
    const data = res.data;

    if (!data || !Array.isArray(data.bids)) {
      throw new Error("Invalid response from PeakMonsters API: expected bids array");
    }

    console.info(`Fetched ${data.bids.length} top bids from PeakMonsters`);
    return data;
  } catch (error) {
    console.error(
      `Failed to fetch PeakMonsters top bids: ${error instanceof Error ? error.message : "Unknown error"}`
    );
    throw error;
  }
}
