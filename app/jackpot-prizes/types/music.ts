export interface MusicItemData {
  long_name: string;
  artist: string;
  track_length: string;
  series: string;
  burn_value: string;
}

/**
 * Generic Splinterlands inventory item (used for Music type items)
 */
export interface SplInventoryItem {
  uid: string;
  item_detail_id: number;
  player: string;
  created_date: string;
  created_tx: string;
  created_block_num: number;
  in_use: boolean;
  lock_days: number | null;
  unlock_date: string | null;
  unlock_tx: string | null;
  listed: boolean;
  stake_start_date: string | null;
  stake_end_date: string | null;
  boost: string | null;
  stake_plot: string | null;
  stake_region: string | null;
  id: number;
  name: string;
  type: string;
  sub_type: string | null;
  data: string; // JSON stringified MusicItemData
  transferable: boolean;
  consumable: boolean;
  print_limit: number;
  total_printed: number;
  image_filename: string;
  rarity: string | null;
  quantity: number;
}

/**
 * Display-ready music item with aggregated quantities
 * Groups multiple inventory items with same item_detail_id
 */
export interface MusicDisplayItem {
  item_detail_id: number;
  name: string;
  image_filename: string;
  print_limit: number;
  total_printed: number;
  total_quantity: number; // Sum of all quantities for this item_detail_id
  music_data: MusicItemData | null;
}
