'use server'

import { fetchPackJackpotOverview } from '@/lib/api/splApi'
import { PackJackpotCard } from '@/app/ca-mint-history/types/packJackpot'
import { cacheLife } from "next/cache";


export async function getJackpotOverview(edition: number = 14): Promise<PackJackpotCard[]> {
  'use cache'
  cacheLife('seconds')

  return await fetchPackJackpotOverview(edition)
}
