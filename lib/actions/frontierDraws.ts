'use server'

import { fetchFrontierDrawsPrizeOverview } from '@/lib/api/splApi'
import { RankedDrawsPrizeCard } from '@/app/ranked-reward-draws/types/rankedDraws'
import { cacheLife } from "next/cache";


export async function getFrontierDraws(): Promise<RankedDrawsPrizeCard[]> {
  'use cache'
  cacheLife('minutes')

  return await fetchFrontierDrawsPrizeOverview()
}
