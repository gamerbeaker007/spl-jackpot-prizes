export interface Mint {
  uid: string;
  card_detail_id: number;
  xp: number;
  gold: boolean;
  tier: number;
  foil: number;
  mint: string;
  mint_player: string | null;
  mint_date: string | null;
  mint_block: number | null;
  mint_tx: string | null;
  guild: string | null;
  title_pre: string | null;
  title_post: string | null;
  league: number | null;
  modern_league: number | null;
  survival_league: number | null;
  guild_name: string | null;
  guild_data: string | null;
  avatar_id: number | null;
  edition: number;
}

export interface MintHistoryResponse {
  total: number;
  total_minted: number;
  mints: Mint[];
}
