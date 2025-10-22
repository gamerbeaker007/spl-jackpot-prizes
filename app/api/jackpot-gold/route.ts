import { SplCardDetail } from '@/app/jackpot-gold/types/cardCollection';
import { fetchJackPotGold } from '@/lib/api/splApi';
import logger from '@/lib/log/logger.server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    logger.info('Jackpot prizes API route called');
    const cards = await fetchJackPotGold();
    logger.info(`Jackpot prizes API route completed: ${cards.length} prizes`);

        // Group cards by card_detail_id and foil, then count them
        const cardGroups = new Map<string, {
          qty: number;
          id: number;
          edition: number;
          cardSet: string;
          foil: number;
          mint: string | null;
        }>();

        cards.forEach((card: SplCardDetail) => {
          const key = `${card.card_detail_id}-${card.foil}`;

          if (cardGroups.has(key)) {
            const existing = cardGroups.get(key)!;
            existing.qty += 1;
          } else {
            cardGroups.set(key, {
              qty: 1,
              id: card.card_detail_id,
              edition: card.edition,
              cardSet: card.card_set,
              foil: card.foil,
              mint: card.mint
            });
          }
        });

        // Convert map to array
        const result = Array.from(cardGroups.values());

        logger.info(`Fetched ${cards.length} cards, grouped into ${result.length} unique card types for $JACKPOT_GOLD`);

    return NextResponse.json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Jackpot prizes API error: ${errorMessage}`);
    return NextResponse.json({ error: 'Failed to fetch jackpot prizes' }, { status: 500 });
  }
}
