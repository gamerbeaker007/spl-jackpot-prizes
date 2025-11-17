'use server'

import { RankedDrawsPrizeCard } from '@/app/ranked-reward-draws/types/rankedDraws';
import { fetchRankedDrawsPrizeOverview } from '@/lib/api/splApi';
import { cacheLife } from "next/cache";


export async function getRankedDraws(): Promise<RankedDrawsPrizeCard[]> {
  'use cache'
  cacheLife('minutes')

  return await fetchRankedDrawsPrizeOverview()
}
