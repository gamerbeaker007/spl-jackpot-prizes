'use server'

import { RankedDrawsPrizeCard } from '@/app/ranked-reward-draws/types/rankedDraws';
import { fetchFrontierDrawsPrizeOverview } from '@/lib/api/splApi';


export async function getFrontierDraws(): Promise<RankedDrawsPrizeCard[]> {
  return fetchFrontierDrawsPrizeOverview()
}
