'use server'

import { JackpotCardDetail } from "@/app/jackpot-prizes/types/card";
import { fetchJackpotCards } from "@/lib/api/splApi";


export async function getJackpotCards(): Promise<JackpotCardDetail[]> {
  const rawCards  = await fetchJackpotCards()

  const groupMap = new Map<string, JackpotCardDetail>();

  rawCards.forEach(card => {
    const key = `${card.card_detail_id}-${card.foil}`;

    if (groupMap.has(key)) {
      const existing = groupMap.get(key)!;
      existing.qty += 1;
    } else {
      groupMap.set(key, {
        qty: 1,
        id: card.card_detail_id,
        edition: card.edition,
        cardSet: card.card_set,
        foil: card.foil,
        mint: card.mint,
      });
    }
  });

  return Array.from(groupMap.values())

}
