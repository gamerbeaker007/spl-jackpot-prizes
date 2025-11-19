export interface SplPlayerCardDetail {
  card_detail_id: number;
  player: string;
  uid: string;
  xp: number;
  gold: boolean;
  edition: number;
  card_set: string;
  collection_power: number;
  bcx: number;
  bcx_unbound: number;
  foil: number;
  mint: string | null;
  level: number;
}

export interface SplPlayerCollection {
  player: string;
  cards: SplPlayerCardDetail[];
}

export interface JackpotCardDetail {
  qty: number;
  id: number;
  edition: number;
  cardSet: string;
  foil: number;
  mint: string | null;
}
