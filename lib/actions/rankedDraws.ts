'use server'

import { RankedDrawsPrizeCard } from '@/app/ranked-reward-draws/types/rankedDraws';
import { fetchRankedDrawsPrizeOverview } from '@/lib/api/splApi';


export async function getRankedDraws(): Promise<RankedDrawsPrizeCard[]> {
  return await fetchRankedDrawsPrizeOverview()
}
