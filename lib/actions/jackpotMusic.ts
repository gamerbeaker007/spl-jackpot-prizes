"use cache";

import { MusicDisplayItem, MusicItemData, SplInventoryItem } from "@/app/jackpot-prizes/types/music";
import { fetchFrontierJackpotMusic, fetchJackpotMusic } from "@/lib/api/splApi";
import logger from "@/lib/log/logger.server";
import { cacheLife } from "next/cache";

/**
 * Groups inventory items by item_detail_id and sums quantities
 */
function groupMusicItems(items: SplInventoryItem[]): MusicDisplayItem[] {
  const grouped = new Map<number, MusicDisplayItem>();

  for (const item of items) {
    const existing = grouped.get(item.item_detail_id);

    if (existing) {
      // Add quantity to existing item
      existing.total_quantity += item.quantity;
    } else {
      // Parse music data
      let musicData: MusicItemData | null = null;
      try {
        musicData = JSON.parse(item.data) as MusicItemData;
      } catch {
        logger.warn(`Failed to parse music data for item ${item.item_detail_id}`);
      }

      // Create new display item
      grouped.set(item.item_detail_id, {
        item_detail_id: item.item_detail_id,
        name: item.name,
        image_filename: item.image_filename,
        print_limit: item.print_limit,
        total_printed: item.total_printed,
        total_quantity: item.quantity,
        music_data: musicData,
      });
    }
  }

  return Array.from(grouped.values());
}

export interface JackpotMusicData {
  chestMusic: MusicDisplayItem[];
  frontierMusic: MusicDisplayItem[];
}

/**
 * Get jackpot music items from both $MUSIC_JACKPOT (Chest) and $FRONTIER_MUSIC_JACKPOT
 * Cached with 'minutes' lifetime since inventory changes periodically
 * Returns separate arrays for each source
 */
export async function getJackpotMusic(): Promise<JackpotMusicData> {
  "use cache";
  cacheLife("minutes");

  logger.info("Fetching jackpot music items");

  try {
    const [musicJackpot, frontierMusicJackpot] = await Promise.all([
      fetchJackpotMusic(),
      fetchFrontierJackpotMusic(),
    ]);

    // Group and aggregate quantities for each source
    const chestMusic = groupMusicItems(musicJackpot);
    const frontierMusic = groupMusicItems(frontierMusicJackpot);

    logger.info(
      `Successfully fetched ${chestMusic.length} chest music items and ${frontierMusic.length} frontier music items`
    );

    return {
      chestMusic,
      frontierMusic,
    };
  } catch (error) {
    logger.error(`Failed to fetch jackpot music: ${error instanceof Error ? error.message : "Unknown error"}`);
    throw error;
  }
}
